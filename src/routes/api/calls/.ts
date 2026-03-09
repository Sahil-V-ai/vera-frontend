import { z } from "zod";
import { getSession } from "@/lib/auth-server";
import { prisma } from "prisma/client";

// Match enum values from prisma/schema.prisma
enum CallSource {
  google_meet = "google_meet",
  manual = "manual",
  teams = "teams",
  exotel = "exotel",
}

enum CallStatus {
  pending = "pending",
  processing = "processing",
  retry = "retry",
  completed = "completed",
}

const createCallSchema = z.object({
  recording_url: z.string().min(1),
  s3_key: z.string().min(1),
  duration: z.number().int().positive().optional(),
  filename: z.string().min(1),
  source: z.enum(['manual', 'google_meet', 'teams', 'exotel']).default('manual'),
  agent: z.string().optional().default(''),
});

export async function POST(request: Request) {
  try {
    // Get authenticated user session
    const session = await getSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Get tenant ID and user ID from session
    const tenantId = session.user.tenant?.id;
    const userId = session.user.id;
    if (!tenantId) {
      return new Response(JSON.stringify({ error: "User not associated with a tenant" }), { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { recording_url, s3_key, duration, source, agent } = createCallSchema.parse(body);

    // Generate a unique ID for the call
    const callId = crypto.randomUUID();

    // Create call record in database
    const call = await prisma.call.create({
      data: {
        id: callId,
        tenantId,
        creator: userId,
        agent: agent || "",
        source: source as CallSource,
        recording_url: recording_url || s3_key, // Store the S3 key or full URL
        duration: duration || 0,
        timestamp: new Date(),
        status: CallStatus.pending,
        retry_count: 0,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      call: {
        id: call.id,
        recording_url: call.recording_url,
        status: call.status,
      },
    }), { status: 201 });

  } catch (error) {
    console.error("Error creating call record:", error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid request", details: error.format() }), { status: 400 });
    }
    
    return new Response(JSON.stringify({ error: "Failed to create call record" }), { status: 500 });
  }
}
