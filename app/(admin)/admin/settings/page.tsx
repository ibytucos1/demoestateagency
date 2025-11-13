import { getTenantId, getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateWhatsappNumber, updateContactInfo } from './actions'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin'])
  const tenant = await getTenant(tenantId)
  
  const updateWhatsAppAction = updateWhatsappNumber.bind(null, { tenantId: tenant.id, tenantSlug: tenant.slug })
  const updateContactAction = updateContactInfo.bind(null, { tenantId: tenant.id, tenantSlug: tenant.slug })

  const showSuccess = searchParams.success === 'contact' || searchParams.success === 'whatsapp'
  const successMessage = searchParams.success === 'contact' 
    ? 'Contact information saved successfully!' 
    : 'WhatsApp number saved successfully!'

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          ✅ {successMessage}
        </div>
      )}
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This contact info will appear on all property cards.
          </p>
          <form action={updateContactAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="+442071234567"
                defaultValue={tenant.contactPhone ?? ''}
              />
              <p className="text-sm text-muted-foreground">
                Phone number for Call button on property cards. Use international format (e.g. +44...).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="info@yourcompany.com"
                defaultValue={tenant.contactEmail ?? ''}
              />
              <p className="text-sm text-muted-foreground">
                Email address for Email button on property cards (desktop only).
              </p>
            </div>

            <Button type="submit">Save Contact Info</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>WhatsApp Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateWhatsAppAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                placeholder="+447700900123"
                defaultValue={tenant.whatsappNumber ?? ''}
              />
              <p className="text-sm text-muted-foreground">
                Use the international format with country code (e.g. +44...). Leave blank to remove the WhatsApp CTA.
              </p>
            </div>
            <Button type="submit">Save WhatsApp</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

