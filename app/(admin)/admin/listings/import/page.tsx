import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { CSVImportPage } from '@/components/csv-import-page'

export default async function ImportListingsPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  return <CSVImportPage />
}

