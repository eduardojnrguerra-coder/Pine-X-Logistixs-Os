import "server-only";
import { z } from "zod";

// Full config, including secrets (Supabase service role key, provider API
// secrets, Resend key). Importing this from a client component is a build
// error by design — use `config.client.ts` for the NEXT_PUBLIC_* subset
// that's safe to ship to the browser.

const envSchema = z.object({
  // Business identity (white-label branding)
  NEXT_PUBLIC_BUSINESS_NAME: z.string().min(1),
  NEXT_PUBLIC_LOGO_URL: z.string().optional(),
  NEXT_PUBLIC_PRIMARY_COLOR: z.string().default("#1d4ed8"),
  NEXT_PUBLIC_CURRENCY_CODE: z.string().length(3).default("ZAR"),
  NEXT_PUBLIC_LOCALE: z.string().default("en-ZA"),

  // Business contact details (replaces hardcoded personal contact info)
  BUSINESS_CONTACT_EMAIL: z.string().email(),
  BUSINESS_CONTACT_PHONE: z.string().optional(),
  BUSINESS_WHATSAPP_NUMBER: z.string().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Email (Resend)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Fleet tracking provider
  TRACKING_PROVIDER: z
    .enum([
      "demo",
      "cartrack",
      "netstar",
      "tracker_sa",
      "mix_telematics",
      "ctrack",
      "webfleet",
      "teltonika",
    ])
    .default("demo"),
  TRACKING_API_KEY: z.string().optional(),
  TRACKING_API_SECRET: z.string().optional(),

  // WhatsApp (optional channel)
  WHATSAPP_ENABLED: z.coerce.boolean().default(false),
  WHATSAPP_PROVIDER: z.enum(["twilio", "meta_cloud_api"]).optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
});

export type AppConfig = z.infer<typeof envSchema>;

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration. Check your .env against .env.example:\n${issues}`,
    );
  }

  return parsed.data;
}

export const config = loadConfig();
