import { Card } from "@/components/Card";
import { CardBody, Select, SelectItem, Button } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { UploadIcon, AlertCircle, Loader2, X } from "lucide-react";
import { FileHeadphone } from "public/icons/FileHeadphone";

interface Agent {
  id: string;
  name: string | null;
  email: string;
}

interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  s3Key?: string;
  callId?: string;
  agentId?: string;
}

export const Route = createFileRoute("/_protected/dashboard/upload-recordings")({
  component: Page,
});

function Page() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        if (response.ok) {
          const data = await response.json();
          setAgents(data.agents || []);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgents();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const uploadFile = async (file: File): Promise<void> => {
    const fileId = crypto.randomUUID();

    // Add file to state with uploading status
    setFiles(prev => [...prev, {
      id: fileId,
      filename: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }]);

    try {
      // Step 1: Get presigned upload URL
      const uploadUrlResponse = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type || 'application/octet-stream',
        }),
      });

      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { upload_url, s3_key } = await uploadUrlResponse.json();

      // Step 2: Upload file directly to S3 with progress tracking
      await uploadToS3WithProgress(upload_url, file, (progress) => {
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, progress } : f
        ));
      });

      // Step 3: Create call record in database
      const currentFile = files.find(f => f.id === fileId);
      const createCallResponse = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recording_url: s3_key,
          s3_key,
          filename: file.name,
          duration: 0,
          source: 'manual',
          agent: currentFile?.agentId || '',
        }),
      });

      if (!createCallResponse.ok) {
        throw new Error('Failed to create call record');
      }

      const { call } = await createCallResponse.json();

      // Update file status to completed
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'completed', s3Key: s3_key, callId: call.id, progress: 100 } : f
      ));

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' } : f
      ));
    }
  };

  const uploadToS3WithProgress = (url: string, file: File, onProgress: (progress: number) => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);
    });
  };

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const audioFiles = Array.from(selectedFiles).filter(file =>
      file.type.startsWith('audio/') ||
      ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/flac'].includes(file.type)
    );

    if (audioFiles.length === 0) {
      alert('Please select audio files only (MP3, WAV, M4A, FLAC)');
      return;
    }

    // Limit to reasonable batch size
    if (files.length + audioFiles.length > 10) {
      alert('Maximum 10 files can be uploaded at once');
      return;
    }

    // Upload each file
    for (const file of audioFiles) {
      await uploadFile(file);
    }
  }, [files.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
    }
  }, [handleFileSelect]);

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Upload Recordings
          </h1>
          <p className="text-gray-600 text-sm">
            Upload call recordings and map them to agents
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-6 shadow-sm border border-gray-100">
          <CardBody className="p-8">
            <div
              className={`
                border-2 border-dashed rounded-lg p-12
                flex flex-col items-center justify-center
                transition-all cursor-pointer bg-white
                ${isDragging
                  ? 'border-indigo-400 bg-indigo-50/50'
                  : 'border-gray-200 hover:border-indigo-300'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.m4a,.flac"
                className="hidden"
                onChange={handleInputChange}
              />
              <UploadIcon className="w-10 h-10 text-gray-400 mb-4" strokeWidth={1.5} />
              <p className="text-sm mb-2 text-gray-700">
                Drag additional files here to add them to your repository
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Or <span className="text-indigo-600 font-medium">choose your files</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Supported formats: MP3, WAV, M4A, FLAC
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Files Section */}
        {files.length === 0 ? (
          <Card className="shadow-sm border border-gray-100">
            <CardBody className="py-20 flex flex-col items-center justify-center bg-white rounded-xl text-center">
              <FileHeadphone className="w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-gray-900 mb-1">No recordings uploaded yet</h3>
              <p className="text-xs text-gray-500">Drag and drop files above or click to browse</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 ml-1">
              Uploaded Files ({files.length})
            </h2>
            <Card className="shadow-sm border border-gray-100">
              <CardBody className="p-4 flex flex-col gap-3">
                {files.map((file) => (
                  <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#f9fafb] border border-default-200">
                    <div className="flex items-center gap-4">
                      {file.status === 'uploading' ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin shrink-0" />
                      ) : file.status === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded shrink-0">
                          <FileHeadphone className="w-4 h-4 text-[#8a94a6]" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {file.filename}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {file.status === 'uploading' ? (
                        <div className="w-32 bg-gray-200 rounded-full h-2 mb-1 overflow-hidden">
                          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${file.progress}%` }}></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Select
                            size="sm"
                            placeholder="Select agent"
                            className="w-40"
                            aria-label="Select agent"
                            selectedKeys={file.agentId ? [file.agentId] : []}
                            onChange={(e) => {
                              setFiles(prev => prev.map(f =>
                                f.id === file.id ? { ...f, agentId: e.target.value } : f
                              ));
                            }}
                            classNames={{
                              trigger: "bg-transparent shadow-none border border-black/10 hover:bg-black/5"
                            }}
                          >
                            {agents.map((agent) => (
                              <SelectItem key={agent.id}>
                                {agent.name || agent.email}
                              </SelectItem>
                            ))}
                          </Select>
                          <button
                            className="p-1.5 text-black hover:text-red-500 transition-colors"
                            onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-3">
                  <Button className="bg-[#6b7280] text-white font-medium px-8 py-2 rounded-lg hover:bg-[#4b5563]">
                    Ingest {files.length} Recording{files.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
