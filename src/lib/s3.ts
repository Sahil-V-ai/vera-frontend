import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const validateEnv = () => {
  const required = ['AWS_S3_BUCKET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export type GeneratePresignedUrlParams = {
  tenantId: string;
  filename: string;
  contentType: string;
  expiresInSeconds?: number; // default 300 (5 minutes)
};

export type GeneratePresignedUrlResult = {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  region: string;
};

/**
 * Generates a presigned URL for uploading a file directly to S3.
 * The URL is valid for 5 minutes by default.
 * 
 * Key format: {tenantId}/{timestamp}-{random-8-chars}-{filename}
 * This prevents collisions and provides some obscurity.
 * 
 * This function is designed to be portable - it can be moved to a standalone
 * Lambda function without modifications (only environment variables needed).
 */
export async function generatePresignedUploadUrl(params: GeneratePresignedUrlParams): Promise<GeneratePresignedUrlResult> {
  validateEnv();

  const { tenantId, filename, contentType, expiresInSeconds = 300 } = params;

  // Sanitize filename (remove path separators, etc.)
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Generate unique key: tenantId/timestamp-random-originalFilename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const s3Key = `${tenantId}/${timestamp}-${random}-${safeFilename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

  return {
    uploadUrl,
    s3Key,
    bucket: process.env.AWS_S3_BUCKET!,
    region: process.env.AWS_S3_REGION!,
  };
}

/**
 * Helper to construct the public URL for an S3 object after upload.
 * Note: This assumes the bucket is publicly accessible or you'll need signed GET URLs.
 */
export function getPublicUrl(bucket: string, region: string, key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
