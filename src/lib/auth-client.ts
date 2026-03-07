import { createAuthClient } from 'better-auth/react'
import { customSessionClient, magicLinkClient } from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [magicLinkClient(),
  customSessionClient<typeof auth>()
  ],
})
