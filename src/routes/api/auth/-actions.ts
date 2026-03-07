import { createServerFn } from "@tanstack/react-start";
import { prisma } from "prisma/client";
import z from "zod";

export const getUserTenant = createServerFn().inputValidator(data => data as { userId: string }).handler(async ({ data }) => {
    return await prisma.user.findUnique({ where: { id: data.userId }, select: { tenant: true, role: true } })
})

export const applyPendingOnboarding = createServerFn().inputValidator(z.object({ userId: z.string(), email: z.email() })).handler(async ({ data }) => {
    try {
        const { email, userId } = data
        const pending = await prisma.pendingOnboarding.findUnique({
            where: { email },
        });

        if (!pending) return;

        const now = new Date();
        if (pending.expiresAt < now) {
            await prisma.pendingOnboarding.delete({ where: { email } });
            return;
        }

        const domain = email.split("@")[1] || "unknown";
        const tenant = await prisma.tenant.create({
            data: {
                id: crypto.randomUUID(),
                domain,
                name: pending.organizationName || domain,
                active: true,
                primary_use_case: pending.primaryUseCase as any,
                timezone: pending.timezone || "UTC",
                industry: pending.industry as any,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { tenantId: tenant.id },
        });

        await prisma.pendingOnboarding.delete({ where: { email } });
    } catch (error) {
        console.log("Failed to apply pending onbaording", error);
    }
});