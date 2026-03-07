import { auth } from "@/lib/auth"
import { prisma } from "prisma/client"
import { APIError } from "better-auth/errors"
import { z } from "zod"

const tenantSettingsSchema = z.object({
    name: z.string().optional(),
    timezone: z.string().optional(),
    industry: z.string().optional(),
})

export async function PUT({ request }: { request: Request }) {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
        throw APIError("UNAUTHORIZED")
    }

    const tenantId = session.user.tenantId
    
    if (!tenantId) {
        throw APIError("BAD_REQUEST", { message: "No tenant found" })
    }

    const body = await request.json()
    const parsed = tenantSettingsSchema.parse(body)

    const updateData: {
        name?: string
        timezone?: string
        industry?: any
    } = {}

    if (parsed.name) updateData.name = parsed.name
    if (parsed.timezone) updateData.timezone = parsed.timezone
    if (parsed.industry) {
        const industries = [
            'technology_software',
            'e_commerce_retail', 
            'finance',
            'healthcare',
            'education',
            'real_estate',
            'telecommunication',
            'manufacturing',
            'professional_services',
            'others'
        ] as const
        if (industries.includes(parsed.industry as any)) {
            updateData.industry = parsed.industry
        }
    }

    await prisma.tenant.update({
        where: { id: tenantId },
        data: updateData,
    })

    return Response.json({ success: true })
}
