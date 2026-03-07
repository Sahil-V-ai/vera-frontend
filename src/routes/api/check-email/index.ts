import { z } from "zod"
import { prisma } from "prisma/client"

import { createFileRoute } from '@tanstack/react-router'
const checkEmailSchema = z.object({
  email: z.string().email(),
})

export const Route = createFileRoute('/api/check-email/')({
  validateSearch: checkEmailSchema,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { email } = checkEmailSchema.parse(body)

          const existingUser = await prisma.user.findUnique({
            where: { email },
            include: {
              tenant: true
            },
          })
          console.log(existingUser?.tenant);

          if (existingUser) {
            const tenantOnboardingComplete = !!(
              existingUser.tenant?.primary_use_case &&
              existingUser.tenant?.timezone &&
              existingUser.tenant?.industry
            )

            return Response.json({
              exists: true,
              onboardingComplete: tenantOnboardingComplete,
            })
          }

          return Response.json({
            exists: false,
            onboardingComplete: false,
          })
        } catch (error) {
          console.error('Error checking email:', error)
          return Response.json(
            { error: 'Failed to check email' },
            { status: 500 }
          )
        }
      },
    },
  },
})
