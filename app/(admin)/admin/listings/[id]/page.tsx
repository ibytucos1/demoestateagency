import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { ListingEditor } from '@/components/listing-editor'

export default async function EditListingPage({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  const listing = await db.listing.findUnique({
    where: { id: params.id },
  })

  if (!listing || listing.tenantId !== tenantId) {
    notFound()
  }

  return <ListingEditor listing={listing} />
}

