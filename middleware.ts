import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Use NEXT_PUBLIC_ vars (available in middleware) or fallback to regular vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY) in your .env.local file'
  )
}

const SUPABASE_URL = supabaseUrl as string
const SUPABASE_ANON_KEY = supabaseAnonKey as string

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client for middleware
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session
  await supabase.auth.getSession()

  // Check tenant from cookie or query param
  // For admin routes, we'll detect user's tenant after auth check
  // For public routes, no default tenant needed (shows all listings)
  let tenant = request.cookies.get('x-tenant')?.value || request.nextUrl.searchParams.get('tenant')
  
  // Protect admin routes and detect tenant from user's account
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    if (!session) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
    
    // Check cached tenant for this user (avoids DB query on every request)
    const cachedTenantCookie = request.cookies.get(`x-tenant-cache-${session.user.id}`)
    const cachedTenant = cachedTenantCookie?.value
    
    // If we have a cached tenant for this user, use it
    if (cachedTenant && !tenant) {
      tenant = cachedTenant
    }
    
    // If no tenant cached, fetch from DB and cache it
    if (!tenant && session.user?.id) {
      try {
        const { db } = await import('@/lib/db')
        const user = await db.user.findUnique({
          where: { authId: session.user.id },
          select: { Tenant: { select: { slug: true } } },
        })
        if (user?.Tenant?.slug) {
          tenant = user.Tenant.slug
          
          // Cache the tenant slug for this user (1 hour TTL)
          response.cookies.set(`x-tenant-cache-${session.user.id}`, tenant, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // 1 hour
            secure: process.env.NODE_ENV === 'production',
          })
        }
      } catch (error) {
        console.warn('[middleware] Could not fetch user tenant:', error)
      }
    }
  }
  
  // Set tenant in headers/cookies (only if tenant is determined)
  if (tenant) {
    response.headers.set('x-tenant', tenant)
    response.cookies.set('x-tenant', tenant, { 
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|ico|png|jpg|jpeg|gif|svg|ttf|woff|woff2)).*)',
    '/(api|trpc)(.*)',
  ],
}
