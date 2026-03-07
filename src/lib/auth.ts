import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "prisma/client";
import { customSession, magicLink } from "better-auth/plugins";
import { sendEmail } from "@/lib/email";
import { createAuthMiddleware } from "better-auth/api";
import { applyPendingOnboarding, getUserTenant } from "@/routes/api/auth/-actions";




export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    tanstackStartCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const appName = process.env.BETTER_AUTH_APP_NAME || 'Vera Intelligence';
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${appName} - Magic Link</h2>
            <p>Click the button below to sign in to your account.</p>
            <p style="margin: 20px 0;">
              <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Sign In
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${url}</p>
            <p>This link will expire in 5 minutes.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #999; font-size: 12px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `;

        const text = `Sign in to ${appName} by clicking the link: ${url}`;

        await sendEmail({
          to: email,
          subject: `Magic Link for ${appName}`,
          html,
          text,
        });
      },
    }),
    customSession(async ({ user, session }) => {
      try {
        const userTenant = await getUserTenant({ data: { userId: user.id } })
        return {
          user: {
            ...user,
            tenant: userTenant?.tenant,
            role: userTenant?.role
          },
          session
        };
      } catch (error) {
        console.log("Failed to get user details", error)
        throw error
      }
    })]
  ,
  appName: "Vera Intelligence",
  hooks: {
    after:
      createAuthMiddleware(async (ctx) => {
        const user = ctx.context.newSession?.user;
        if (user) {
          await applyPendingOnboarding({ data: { userId: user.id, email: user.email } });
        }
      })
  },
});
