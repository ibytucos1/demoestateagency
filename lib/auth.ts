import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { env } from './env'

/**
 * Create Supabase client for server components/actions
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies()

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
})

/**
 * Get current user from Supabase session
 */
export async function getCurrentSession() {
  const supabase = await createClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  
  if (error) {
    console.log(`[getCurrentSession] Error: ${error.message}`)
  }
  
  console.log(`[getCurrentSession] Session exists: ${!!session}, user ID: ${session?.user?.id || 'none'}`)
  return session
}

/**
 * Get current user ID from Supabase session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  const userId = session?.user?.id ?? null
  console.log(`[getCurrentUserId] Returning: ${userId || 'null'}`)
  return userId
}

