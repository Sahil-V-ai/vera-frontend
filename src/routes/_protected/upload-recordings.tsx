import { Card } from "@/components/Card";
import { CardBody } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";

export const Route = createFileRoute("/_protected/upload-recordings")({
  component: Page,
});

function Page() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload Recordings
          </h1>
          <p className="text-gray-600">
            Upload call recordings and map them to agents
          </p>
        </div>

        {/* Organization Section */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <div
              className="
              border-2 border-dashed rounded-lg p-8 sm:p-12 lg:p-16
              flex flex-col items-center justify-center
              transition-colors cursor-pointer
              border-gray-300 hover:border-indigo-400 hover:bg-gray-50
            "
            >
              <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-base sm:text-lg mb-2 text-center">
                Drag additional files here to add them to your repository
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Or{" "}
                <button className="text-indigo-600 hover:underline">
                  choose your files
                </button>
              </p>
              <p className="text-xs text-gray-400 text-center">
                Supported formats: MP3, WAV, M4A, FLAC
              </p>
              <input type="file" multiple accept="audio/*" className="hidden" />
            </div>
          </CardBody>
        </Card>

        <Card>
            <CardBody className="p-6 flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-audio w-12 h-12 text-gray-300 mx-auto mb-4"><path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"></path></svg>
                <p className="text-gray-600 mb-2">No recordings uploaded yet.</p>
                <p className="text-sm text-gray-400 mt-2">Drag and drop files above or click to browse</p>
            </CardBody>
        </Card>
      </div>
    </main>
  );
}
