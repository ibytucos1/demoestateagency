import { auth } from '@clerk/nextjs/server'
import { db } from './db'

export type UserRole = 'owner' | 'admin' | 'agent'

export interface User {
  id: string
  tenantId: string
  email: string
  name: string | null
  role: UserRole
}

/**
 * Get current user from Clerk and DB
 */
export async function getCurrentUser(tenantId: string): Promise<User | null> {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user || user.tenantId !== tenantId) {
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
 * Require auth and role (throws if not authorized)
 */
export async function requireAuth(tenantId: string, requiredRoles?: UserRole[]): Promise<User> {
  const user = await getCurrentUser(tenantId)
  if (!user) {
    throw new Error('Unauthorized')
  }
  if (requiredRoles && !hasRole(user, requiredRoles)) {
    throw new Error('Forbidden')
  }
  return user
}

