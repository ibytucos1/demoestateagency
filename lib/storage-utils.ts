/**
 * Utility functions for Supabase Storage URLs
 * This file does NOT import env.ts to avoid client-side validation errors
 */

/**
 * Get public URL synchronously (for use in client components)
 * This constructs the URL without requiring server-side env access
 */
export function getPublicUrlSync(key: string): string {
  // Construct Supabase Storage public URL
  // Format: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<key>
  // Use NEXT_PUBLIC_SUPABASE_URL which is available at build time in client components
  const bucket = 'media'
  
  // Get base URL - NEXT_PUBLIC_ vars are available in both server and client at build time
  const baseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL as string)?.replace(/\/$/, '') || ''
  
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not set. Images may not load correctly.')
    // Return empty string to avoid breaking the app
    return ''
  }
  
  return `${baseUrl}/storage/v1/object/public/${bucket}/${key}`
}

