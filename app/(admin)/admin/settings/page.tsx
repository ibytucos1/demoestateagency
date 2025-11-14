import { getTenantId, getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateWhatsappNumber, updateContactInfo } from './actions'
import { 
  Building2, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2,
  Info,
  Settings as SettingsIcon
} from 'lucide-react'

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900 rounded-lg shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tenant Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tenant Information Card */}
          <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Agency Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Agency Name
                </p>
                <p className="text-base font-semibold text-gray-900">{tenant.name}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  URL Slug
                </p>
                <Badge variant="outline" className="font-mono text-xs">
                  {tenant.slug}
                </Badge>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Tenant ID
                </p>
                <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200 break-all">
                  {tenant.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-blue-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">About Settings</p>
                  <p className="text-blue-800">
                    These contact details will appear on all property listing cards across your website, 
                    allowing potential clients to reach you directly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information Card */}
          <Card className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Phone and email for property inquiries
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={updateContactAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-indigo-600" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    placeholder="+442071234567"
                    defaultValue={tenant.contactPhone ?? ''}
                    className="h-11 border-2 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1.5 pt-1">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Use international format (e.g., +44 20 7123 4567). This appears on the "Call" button.
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-600" />
                    Contact Email
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="info@yourcompany.com"
                    defaultValue={tenant.contactEmail ?? ''}
                    className="h-11 border-2 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1.5 pt-1">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Primary contact email for inquiries. Visible on desktop property cards.
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button type="submit" size="lg" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Save Contact Information
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card className="border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Enable instant messaging with clients
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={updateWhatsAppAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="tel"
                    placeholder="+447700900123"
                    defaultValue={tenant.whatsappNumber ?? ''}
                    className="h-11 border-2 focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 flex items-start gap-1.5 pt-1">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Include country code (e.g., +44 7700 900123). Leave blank to disable WhatsApp button.
                    </span>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Save WhatsApp Number
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

