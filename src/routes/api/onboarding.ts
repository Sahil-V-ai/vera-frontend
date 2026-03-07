import { z } from "zod"
import { prisma } from "prisma/client"

import { createFileRoute } from '@tanstack/react-router'
const onboardingSchema = z.object({
  email: z.string().email(),
  organization_name: z.string().optional(),
  primary_use_case: z.enum(["sales", "customer_support", "operational_calls", "all_of_the_above"]).optional(),
  timezone: z.string().optional(),
  industry: z.enum(["technology_software", "e_commerce_retail", "finance", "healthcare", "education", "real_estate", "telecommunication", "manufacturing", "professional_services", "others"]).optional(),
})


export const Route = createFileRoute('/api/onboarding')({
  validateSearch: onboardingSchema,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { email, organization_name, primary_use_case, timezone, industry } = onboardingSchema.parse(body)

          const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { tenantId: true },
          })

          if (existingUser?.tenantId) {
            const updateData: any = {}

            if (organization_name) updateData.name = organization_name
            if (primary_use_case) updateData.primary_use_case = primary_use_case
            if (timezone) updateData.timezone = timezone
            if (industry) updateData.industry = industry

            await prisma.tenant.update({
              where: { id: existingUser.tenantId },
              data: updateData,
            })
          } else {
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 24)

            await prisma.pendingOnboarding.upsert({
              where: { email },
              create: {
                email,
                organizationName: organization_name,
                primaryUseCase: primary_use_case,
                timezone,
                industry,
                expiresAt,
              },
              update: {
                organizationName: organization_name,
                primaryUseCase: primary_use_case,
                timezone,
                industry,
                expiresAt,
              },
            })
          }

          return Response.json({
            success: true,
          })
        } catch (error) {
          console.error('Error saving onboarding:', error)
          return Response.json(
            { error: 'Failed to save onboarding' },
            { status: 500 }
          )
        }
      }
      ,
    },
  },
})
