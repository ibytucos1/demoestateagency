import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Resend Email
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_TO_EMAIL: z.string().email().optional(), // For notifications

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Google APIs
  NEXT_PUBLIC_MAPS_BROWSER_KEY: z.string().min(1),
  PLACES_SERVER_KEY: z.string().min(1),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Cloudflare Turnstile
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Plausible
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),

  // Inngest
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

function getEnv(): Env & { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string } {
  try {
    const parsed = envSchema.parse(process.env)
    // Default NEXT_PUBLIC_ vars to regular vars if not set
    const nextPublicUrl = parsed.NEXT_PUBLIC_SUPABASE_URL || parsed.SUPABASE_URL
    const nextPublicKey = parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || parsed.SUPABASE_ANON_KEY
    return {
      ...parsed,
      NEXT_PUBLIC_SUPABASE_URL: nextPublicUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: nextPublicKey,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path.join('.')).join(', ')
      throw new Error(`Missing or invalid environment variables: ${missing}`)
    }
    throw error
  }
}

export const env = getEnv()

