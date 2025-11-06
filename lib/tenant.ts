import { cookies, headers } from 'next/headers'
import { Prisma } from '@prisma/client'
import { db } from './db'

// Fallback tenant (used only if DB connection fails)
async function getFallbackTenant() {
  try {
    // Try to get first tenant from DB
    const firstTenant = await db.tenant.findFirst({
      select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
    })
    if (firstTenant) {
      return firstTenant
    }
  } catch (error) {
    // If DB query fails, use hardcoded fallback
  }
  
  // Hardcoded fallback (should rarely be used)
  return {
    id: 'fallback-tenant-id',
    slug: 'default',
    name: 'Default Tenant',
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
 * Priority:
 * 1. Header (x-tenant)
 * 2. Cookie (x-tenant)
 * 3. Authenticated user's tenant from DB
 * 4. Empty string for public pages (shows all listings)
 */
export async function getTenantId(): Promise<string> {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant')
  if (tenant) return tenant

  // Fallback to cookie
  const cookieStore = await cookies()
  const tenantCookie = cookieStore.get('x-tenant')?.value
  if (tenantCookie) return tenantCookie

  // If no tenant set, try to get from authenticated user's account
  try {
    const { getCurrentUserId } = await import('./auth')
    const authId = await getCurrentUserId()
    if (authId) {
      const user = await db.user.findUnique({
        where: { authId },
        select: { Tenant: { select: { slug: true } } },
      })
      if (user?.Tenant?.slug) {
        return user.Tenant.slug
      }
    }
  } catch (error) {
    // If we can't get user's tenant, fall through to default
    console.warn('[getTenantId] Could not get user tenant:', error)
  }

  // For public pages, return empty string (will show all listings)
  // For admin pages, this should never be reached (user's tenant should be found above)
  return ''
}

/**
 * Get tenant with validation
 * Accepts either tenant ID or slug
 * For public pages, if no tenant specified, returns first tenant (for theme/branding)
 */
export async function getTenant(tenantId?: string): Promise<{ id: string; slug: string; name: string; theme: any; whatsappNumber: string | null }> {
  const identifier = tenantId || (await getTenantId())
  
  // If no identifier and this is a public page, get first tenant for branding
  if (!identifier || identifier === '') {
    try {
      const firstTenant = await db.tenant.findFirst({
        select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
      })
      if (firstTenant) {
        return firstTenant
      }
    } catch (error) {
      // Fall through to error handling
    }
  }
  
  // Try to find by slug first (slugs can contain spaces, so don't check for dashes)
  // IDs are longer like 'acme-tenant-id' or CUIDs
  try {
    let tenant = null
    
    // Try slug first (slugs can be any string)
    tenant = await db.tenant.findUnique({
      where: { slug: identifier },
      select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
    })

    // If not found by slug, try by ID
    if (!tenant) {
      tenant = await db.tenant.findUnique({
        where: { id: identifier },
        select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
      })
    }

    // If still not found (e.g., old cookie with deleted tenant), fall back to first tenant
    if (!tenant) {
      console.warn(`[getTenant] Tenant "${identifier}" not found, falling back to first available tenant`)
      const firstTenant = await db.tenant.findFirst({
        select: { id: true, slug: true, name: true, theme: true, whatsappNumber: true },
        orderBy: { createdAt: 'asc' },
      })
      
      if (firstTenant) {
        return firstTenant
      }
      
      // If no tenants exist at all, throw error
      throw new Error(`No tenants found in database`)
    }

    return tenant
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn('[getTenant] Falling back to default tenant due to database connectivity issue')
      return await getFallbackTenant()
    }
    throw error
  }
}

