import { z } from "zod";
import { getSession } from "@/lib/auth-server";
import { generatePresignedUploadUrl } from "@/lib/s3";

const createUploadUrlSchema = z.object({
  filename: z.string().min(1).max(255),
  content_type: z.string().min(1),
});

export async function GET() {
  return new Response(JSON.stringify({ error: "Use POST" }), { status: 405 });
}

export async function POST(request: Request) {
  try {
    // Get authenticated user session
    const session = await getSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Get tenant ID from user
    const tenantId = session.user.tenant?.id;
    if (!tenantId) {
      return new Response(JSON.stringify({ error: "User not associated with a tenant" }), { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { filename, content_type } = createUploadUrlSchema.parse(body);

    // Validate file type (audio only)
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 
      'audio/mp3', 'audio/flac', 'audio/ogg'
    ];
    if (!allowedMimeTypes.includes(content_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only audio files are allowed." }),
        { status: 400 }
      );
    }

    // Generate presigned S3 URL
    const result = await generatePresignedUploadUrl({
      tenantId,
      filename,
      contentType: content_type,
      expiresInSeconds: 300, // 5 minutes
    });

    // Return the upload URL and S3 key
    return new Response(JSON.stringify({
      success: true,
      upload_url: result.uploadUrl,
      s3_key: result.s3Key,
      bucket: result.bucket,
      region: result.region,
    }), { status: 200 });

  } catch (error) {
    console.error("Error creating upload URL:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid request", details: error.format() }), { status: 400 });
    }
    
    return new Response(JSON.stringify({ error: "Failed to create upload URL" }), { status: 500 });
  }
}
