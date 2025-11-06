'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Please add these to your .env.local file. ' +
    'You can copy the values from SUPABASE_URL and SUPABASE_ANON_KEY if you have them set. ' +
    'Example:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key'
  )
}

/**
 * Create Supabase client for client components
 */
export function createClient() {
  return createBrowserClient(supabaseUrl as string, supabaseAnonKey as string)
}

