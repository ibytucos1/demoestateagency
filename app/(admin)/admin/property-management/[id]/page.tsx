import { notFound, redirect } from 'next/navigation'
import { MapPin, Mail, Phone } from 'lucide-react'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UnitOverview } from '@/components/property-management/unit-overview'
import { MaintenanceBoard } from '@/components/property-management/maintenance-board'
import { CreateUnitDialog } from '@/components/property-management/create-unit-dialog'
import { Badge } from '@/components/ui/badge'
import { isPropertyManagementEnabled } from '@/lib/property-management'

interface RouteParams {
  params: { id: string }
}

export default async function PropertyDetailPage({ params }: RouteParams) {
  const tenant = await getTenant()
  const tenantId = tenant.id

  await requireAuth(tenantId, ['admin', 'agent'])

  if (!isPropertyManagementEnabled(tenant.theme)) {
    redirect('/admin')
  }

  const property = await db.property.findFirst({
    where: { tenantId, id: params.id },
    include: {
      Units: {
        include: {
          Leases: {
            where: { status: { in: ['ACTIVE', 'DRAFT'] } },
            include: {
              TenantProfile: {
                select: { firstName: true, lastName: true },
              },
              Payments: {
                where: { status: { in: ['PENDING', 'PARTIAL'] } },
                orderBy: { dueDate: 'asc' },
                take: 1,
              },
            },
            orderBy: { startDate: 'desc' },
            take: 1,
          },
        },
      },
      Maintenance: {
        orderBy: { requestedAt: 'desc' },
        take: 6,
        include: {
          Unit: { select: { label: true } },
        },
      },
    },
  })

  if (!property) {
    notFound()
  }

  const unitItems = property.Units.map((unit) => {
    const lease = unit.Leases[0]
    const tenantName = lease?.TenantProfile
      ? `${lease.TenantProfile.firstName} ${lease.TenantProfile.lastName}`.trim()
      : null
    const nextPayment = lease?.Payments[0]

    const rentAmount = unit.rentAmount
      ? `£${Number(unit.rentAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : null

    return {
      id: unit.id,
      label: unit.label,
      status: unit.status,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      rentAmount,
      tenantName,
      leaseId: lease?.id ?? null,
      nextDueDate: nextPayment ? new Date(nextPayment.dueDate).toLocaleDateString() : null,
    }
  })

  const maintenanceRows = property.Maintenance.map((item) => ({
    id: item.id,
    summary: item.summary,
    status: item.status,
    priority: item.priority,
    propertyName: property.name,
    unitLabel: item.Unit?.label ?? null,
    requestedAt: item.requestedAt.toISOString(),
    assignedAgentId: item.assignedAgentId ?? null,
  }))

  const occupancy = unitItems.length
    ? Math.round((unitItems.filter((unit) => unit.status === 'OCCUPIED').length / unitItems.length) * 100)
    : 0

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold text-gray-900">{property.name}</h1>
            {property.code && <Badge variant="secondary">{property.code}</Badge>}
          </div>
          <CreateUnitDialog propertyId={property.id} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {property.addressLine1}, {property.city}
          </span>
          {property.ownerEmail && (
            <span className="inline-flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {property.ownerEmail}
            </span>
          )}
          {property.ownerPhone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {property.ownerPhone}
            </span>
          )}
          <Badge variant="outline">Occupancy {occupancy}%</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UnitOverview units={unitItems} />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Property details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700">Location</p>
                <p>{property.addressLine1}</p>
                {property.addressLine2 && <p>{property.addressLine2}</p>}
                <p>
                  {property.city} {property.postcode}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Owner</p>
                <p>{property.ownerName ?? 'Not set'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Units</p>
                <p>{unitItems.length} total</p>
              </div>
            </CardContent>
          </Card>

          <MaintenanceBoard maintenance={maintenanceRows} />
        </div>
      </div>
    </div>
  )
}


