import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect admin routes
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Check tenant from cookie or query param (demo only - use subdomain in production)
  const tenant = req.cookies.get('x-tenant')?.value || req.nextUrl.searchParams.get('tenant') || 'acme'
  
  // Set tenant in headers for server components
  const response = NextResponse.next()
  response.headers.set('x-tenant', tenant)
  response.cookies.set('x-tenant', tenant, { 
    httpOnly: false, // Allow JS access for switching
    sameSite: 'lax',
    path: '/',
  })

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|ico|png|jpg|jpeg|gif|svg|ttf|woff|woff2)).*)',
    '/(api|trpc)(.*)',
  ],
}

