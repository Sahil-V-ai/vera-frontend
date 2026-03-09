import { createFileRoute } from '@tanstack/react-router';
import { z } from "zod";
import { getSession } from "@/lib/auth-server";
import { createRule, getRulesByTenant, updateRule, deleteRule, ruleExists } from "@/lib/dynamodb";

// Schemas
const createRuleSchema = z.object({
  name: z.string().min(1).max(255),
  triggerType: z.enum(['agents_says', 'contains', 'mentions_keywords', 'amount_threshold', 'missing_tag', 'time_based']),
  conditionValue: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high']),
  sendNotification: z.boolean(),
});

const updateRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255).optional(),
  triggerType: z.enum(['agents_says', 'contains', 'mentions_keywords', 'amount_threshold', 'missing_tag', 'time_based']).optional(),
  conditionValue: z.string().min(1).optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  sendNotification: z.boolean().optional(),
});

export const Route = createFileRoute('/api/rules/')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const session = await getSession();
          if (!session?.user?.tenant?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const tenantId = session.user.tenant.id;
          const rules = await getRulesByTenant(tenantId);

          return new Response(JSON.stringify({ rules }), { status: 200 });
        } catch (error) {
          console.error("Error fetching rules:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch rules" }), { status: 500 });
        }
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession();
          if (!session?.user?.tenant?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const tenantId = session.user.tenant.id;
          const userId = session.user.id;

          const body = await request.json();
          const { name, triggerType, conditionValue, severity, sendNotification } = createRuleSchema.parse(body);

          const newRule = {
            id: crypto.randomUUID(),
            tenantId,
            name,
            triggerType,
            conditionValue,
            severity,
            sendNotification,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            status: 'active' as const,
            triggeredCount: 0,
            lastTriggered: null,
          };

          await createRule(newRule);

          return new Response(JSON.stringify({ rule: newRule }), { status: 201 });
        } catch (error) {
          console.error("Error creating rule:", error);

          if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: "Invalid request", details: error.format() }), { status: 400 });
          }

          return new Response(JSON.stringify({ error: "Failed to create rule" }), { status: 500 });
        }
      },

      PUT: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession();
          if (!session?.user?.tenant?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const tenantId = session.user.tenant.id;
          const body = await request.json();
          const { id, ...updates } = updateRuleSchema.parse(body);

          // Verify rule exists and belongs to tenant
          const exists = await ruleExists(tenantId, id);
          if (!exists) {
            return new Response(JSON.stringify({ error: "Rule not found" }), { status: 404 });
          }

          const updatedRule = await updateRule(tenantId, id, updates);

          return new Response(JSON.stringify({ rule: updatedRule }), { status: 200 });
        } catch (error) {
          console.error("Error updating rule:", error);

          if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: "Invalid request", details: error.format() }), { status: 400 });
          }

          return new Response(JSON.stringify({ error: "Failed to update rule" }), { status: 500 });
        }
      },

      DELETE: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession();
          if (!session?.user?.tenant?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const tenantId = session.user.tenant.id;
          const { searchParams } = new URL(request.url);
          const id = searchParams.get('id');

          if (!id) {
            return new Response(JSON.stringify({ error: "Rule ID required" }), { status: 400 });
          }

          await deleteRule(tenantId, id);

          return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error) {
          console.error("Error deleting rule:", error);
          return new Response(JSON.stringify({ error: "Failed to delete rule" }), { status: 500 });
        }
      }
    }
  }
})