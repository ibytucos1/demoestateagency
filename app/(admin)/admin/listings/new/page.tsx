import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { ListingEditor } from '@/components/listing-editor'

export default async function NewListingPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  return <ListingEditor />
}

