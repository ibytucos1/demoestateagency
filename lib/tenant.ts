import { cookies, headers } from 'next/headers'
import { Prisma } from '@prisma/client'
import { db } from './db'

const fallbackTenant = {
  id: 'acme-tenant-id',
  slug: 'acme',
  name: 'Acme Demo',
  theme: {
    primaryColor: '#111827',
    secondaryColor: '#1f2937',
    logo: null,
    features: {
      propertyManagement: true,
    },
  },
  whatsappNumber: null as string | null,
}

function isPrismaConnectionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if (error instanceof Prisma.PrismaClientInitializationError) return true
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') return true
  const message = 'message' in error && typeof error.message === 'string' ? error.message : ''
  return message.includes("Can't reach database server")
}

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
export async function getTenant(tenantId?: string): Promise<{ id: string; slug: string; name: string; theme: any; whatsappNumber: string | null }> {
  const identifier = tenantId || (await getTenantId())
  
  // Try to find by slug first (if it looks like a slug, not a UUID/cuid)
  // Slugs are short strings like 'acme', 'bluebird'
  // IDs are longer like 'acme-tenant-id' or CUIDs
  try {
    let tenant = null
    if (identifier.length < 20 && !identifier.includes('-')) {
      // Looks like a slug
      tenant = await db.tenant.findUnique({
        where: { slug: identifier },
        select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
      })
    }

    // If not found by slug, try by ID
    if (!tenant) {
      tenant = await db.tenant.findUnique({
        where: { id: identifier },
        select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
      })
    }

    if (!tenant) {
      throw new Error(`Tenant not found: ${identifier}`)
    }

    return tenant
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn('[getTenant] Falling back to default tenant due to database connectivity issue')
      return fallbackTenant
    }
    throw error
  }
}

