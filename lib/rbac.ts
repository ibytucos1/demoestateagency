import { getCurrentUserId } from './auth'
import { db } from './db'
import { getTenant } from './tenant'

export type UserRole = 'owner' | 'admin' | 'agent'

export interface User {
  id: string
  tenantId: string
  email: string
  name: string | null
  role: UserRole
}

/**
 * Resolve tenant identifier (slug or ID) to actual tenant ID
 */
async function resolveTenantId(identifier: string): Promise<string> {
  const tenant = await getTenant(identifier)
  return tenant.id
}

/**
 * Get current user from Supabase Auth and DB
 * Accepts either tenant slug or tenant ID
 */
export async function getCurrentUser(tenantIdOrSlug: string): Promise<User | null> {
  // Resolve slug to ID if needed
  const tenantId = await resolveTenantId(tenantIdOrSlug)
  const authId = await getCurrentUserId()
  if (!authId) {
    console.log('[getCurrentUser] No authId found')
    return null
  }

  console.log(`[getCurrentUser] Looking for user with authId: ${authId}, tenantId: ${tenantId}`)

  const user = await db.user.findUnique({
    where: { authId },
  })

  if (!user) {
    console.log(`[getCurrentUser] No user found in database for authId: ${authId}`)
    // Try to find any user with this authId to debug
    const anyUser = await db.user.findMany({
      where: { authId },
    })
    console.log(`[getCurrentUser] Debug: Found ${anyUser.length} users with this authId`)
    return null
  }

  console.log(`[getCurrentUser] Found user: email=${user.email}, user.tenantId=${user.tenantId}, requested.tenantId=${tenantId}`)

  if (user.tenantId !== tenantId) {
    console.log(`[getCurrentUser] Tenant mismatch: user.tenantId=${user.tenantId}, requested=${tenantId}`)
    return null
  }

  return {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

/**
 * Require auth and role (redirects if not authorized)
 * Accepts either tenant slug or tenant ID
 */
export async function requireAuth(tenantIdOrSlug: string, requiredRoles?: UserRole[]): Promise<User> {
  const user = await getCurrentUser(tenantIdOrSlug)
  if (!user) {
    // Import redirect dynamically to avoid issues
    const { redirect } = await import('next/navigation')
    redirect('/sign-in?redirect_url=' + encodeURIComponent('/admin'))
    // This never returns, but TypeScript doesn't know that
    throw new Error('Redirecting to sign-in')
  }
  if (requiredRoles && !hasRole(user, requiredRoles)) {
    throw new Error('Forbidden')
  }
  return user
}
