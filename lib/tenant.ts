import { cookies, headers } from 'next/headers'
import { db } from './db'

/**
 * Get current tenant ID from request
 */
export async function getTenantId(): Promise<string> {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant')
  if (tenant) return tenant

  // Fallback to cookie
  const cookieStore = await cookies()
  const tenantCookie = cookieStore.get('x-tenant')?.value
  if (tenantCookie) return tenantCookie

  // Default for demo
  return 'acme'
}

/**
 * Get tenant with validation
 * Accepts either tenant ID or slug
 */
export async function getTenant(tenantId?: string): Promise<{ id: string; slug: string; name: string; theme: any }> {
  const identifier = tenantId || (await getTenantId())
  
  // Try to find by slug first (if it looks like a slug, not a UUID/cuid)
  // Slugs are short strings like 'acme', 'bluebird'
  // IDs are longer like 'acme-tenant-id' or CUIDs
  let tenant = null
  if (identifier.length < 20 && !identifier.includes('-')) {
    // Looks like a slug
    tenant = await db.tenant.findUnique({
      where: { slug: identifier },
      select: { id: true, slug: true, name: true, theme: true },
    })
  }
  
  // If not found by slug, try by ID
  if (!tenant) {
    tenant = await db.tenant.findUnique({
      where: { id: identifier },
      select: { id: true, slug: true, name: true, theme: true },
    })
  }

  if (!tenant) {
    throw new Error(`Tenant not found: ${identifier}`)
  }

  return tenant
}

