import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import { Card, CardContent } from '@/components/ui/card'
import { CreateTenantDialog } from '@/components/property-management/create-tenant-dialog'
import { Badge } from '@/components/ui/badge'
import { UserCircle2, Mail, Phone, Calendar } from 'lucide-react'

export default async function TenantsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id

  await requireAuth(tenantId, ['admin', 'agent'])

  if (!isPropertyManagementEnabled(tenant.theme)) {
    redirect('/admin')
  }

  const tenantProfiles = await db.tenantProfile.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    include: {
      Leases: {
        where: {
          status: { in: ['ACTIVE', 'DRAFT'] },
        },
        select: {
          id: true,
          status: true,
          Unit: {
            select: {
              label: true,
              Property: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Tenant Profiles</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage tenant information and create leases
          </p>
        </div>
        <CreateTenantDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          {tenantProfiles.length === 0 && (
            <div className="py-16 text-center">
              <UserCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">No tenant profiles yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Create tenant profiles to start managing leases
              </p>
              <CreateTenantDialog />
            </div>
          )}

          {tenantProfiles.length > 0 && (
            <div className="divide-y divide-gray-100">
              {tenantProfiles.map((profile) => {
                const activeLeases = profile.Leases.filter((l) => l.status === 'ACTIVE')
                const draftLeases = profile.Leases.filter((l) => l.status === 'DRAFT')

                return (
                  <div
                    key={profile.id}
                    className="flex flex-col gap-4 p-6 hover:bg-gray-50 transition-colors md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <UserCircle2 className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        {activeLeases.length > 0 && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            Active Lease
                          </Badge>
                        )}
                        {draftLeases.length > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Draft Lease
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {profile.email && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {profile.email}
                          </span>
                        )}
                        {profile.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {profile.phone}
                          </span>
                        )}
                        {profile.dateOfBirth && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {profile.Leases.length > 0 && (
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Current Units:</span>{' '}
                          {profile.Leases.map((lease) => (
                            <span key={lease.id} className="inline-block mr-2">
                              {lease.Unit.Property.name} - {lease.Unit.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {profile.notes && (
                        <p className="text-sm text-gray-500 line-clamp-2">{profile.notes}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

