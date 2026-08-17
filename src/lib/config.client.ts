import { z } from "zod";

// Public subset of the app config, safe to import from client components.
// Only NEXT_PUBLIC_* vars belong here — anything else is a secret and must
// stay in config.ts (server-only).
const publicEnvSchema = z.object({
  NEXT_PUBLIC_BUSINESS_NAME: z.string().min(1),
  NEXT_PUBLIC_LOGO_URL: z.string().optional(),
  NEXT_PUBLIC_PRIMARY_COLOR: z.string().default("#1d4ed8"),
  NEXT_PUBLIC_CURRENCY_CODE: z.string().length(3).default("ZAR"),
  NEXT_PUBLIC_LOCALE: z.string().default("en-ZA"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type PublicAppConfig = z.infer<typeof publicEnvSchema>;

function loadPublicConfig(): PublicAppConfig {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME,
    NEXT_PUBLIC_LOGO_URL: process.env.NEXT_PUBLIC_LOGO_URL,
    NEXT_PUBLIC_PRIMARY_COLOR: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
    NEXT_PUBLIC_CURRENCY_CODE: process.env.NEXT_PUBLIC_CURRENCY_CODE,
    NEXT_PUBLIC_LOCALE: process.env.NEXT_PUBLIC_LOCALE,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid public environment configuration. Check your .env against .env.example:\n${issues}`,
    );
  }

  return parsed.data;
}

export const publicConfig = loadPublicConfig();
