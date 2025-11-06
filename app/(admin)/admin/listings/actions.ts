"use server"

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getTenant, getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'

const updateSchema = z.object({
  listingId: z.string().min(1),
  status: z.enum(['draft', 'active', 'sold', 'let']),
})

const deleteSchema = z.object({
  listingId: z.string().min(1),
})

async function ensureAccess(allowedRoles: Parameters<typeof requireAuth>[1]) {
  const tenantIdentifier = await getTenantId()
  await requireAuth(tenantIdentifier, allowedRoles)
  const tenant = await getTenant(tenantIdentifier)
  return tenant.id
}

export async function updateListingStatusAction(data: { listingId: string; status: string }) {
  const tenantId = await ensureAccess(['owner', 'admin', 'agent'])
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid request')
  }

  const { listingId, status } = parsed.data

  await db.listing.update({
    where: {
      id: listingId,
      tenantId,
    },
    data: {
      status,
    },
  })

  revalidatePath('/admin/listings')
}

export async function deleteListingAction(data: { listingId: string }) {
  const tenantId = await ensureAccess(['owner', 'admin'])
  const parsed = deleteSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? 'Invalid request')
  }

  const { listingId } = parsed.data

  await db.listing.delete({
    where: {
      id: listingId,
      tenantId,
    },
  })

  revalidatePath('/admin/listings')
}

