import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized: false}
  }),
});
