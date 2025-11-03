import { getTenantId, getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SettingsPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin'])
  const tenant = await getTenant(tenantId)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {tenant.name}</p>
            <p><strong>Slug:</strong> {tenant.slug}</p>
            <p><strong>ID:</strong> {tenant.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

