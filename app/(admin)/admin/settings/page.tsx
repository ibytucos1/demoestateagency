import { getTenantId, getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateWhatsappNumber } from './actions'

export default async function SettingsPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin'])
  const tenant = await getTenant(tenantId)
  const updateAction = updateWhatsappNumber.bind(null, { tenantId: tenant.id, tenantSlug: tenant.slug })

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
            <p><strong>WhatsApp:</strong> {tenant.whatsappNumber || 'Not set'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>WhatsApp Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                placeholder="+447700900123"
                defaultValue={tenant.whatsappNumber ?? ''}
              />
              <p className="text-sm text-muted-foreground">
                Use the international format with country code (e.g. +44...). Leave blank to remove the WhatsApp CTA.
              </p>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

