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
  
  // If admin route and no tenant set, we'll detect it from user's account after auth
  // For now, leave tenant empty for public pages
  if (!tenant && request.nextUrl.pathname.startsWith('/admin')) {
    // Will be set after checking user's tenant
    tenant = null
  }
  
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
    
    // If no tenant set, get from user's account
    if (!tenant && session.user?.id) {
      try {
        const { db } = await import('@/lib/db')
        const user = await db.user.findUnique({
          where: { authId: session.user.id },
          select: { Tenant: { select: { slug: true } } },
        })
        if (user?.Tenant?.slug) {
          tenant = user.Tenant.slug
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
