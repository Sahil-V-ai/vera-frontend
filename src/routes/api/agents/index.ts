import { getSession } from "@/lib/auth-server";
import { prisma } from "prisma/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const tenantId = session.user.tenant?.id;
    if (!tenantId) {
      return new Response(JSON.stringify({ error: "User not associated with a tenant" }), { status: 400 });
    }

    const agents = await prisma.user.findMany({
      where: {
        tenantId,
        role: "agent",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return new Response(JSON.stringify({ agents }), { status: 200 });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch agents" }), { status: 500 });
  }
}
