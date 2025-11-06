import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users2, Wrench, AlertTriangle } from 'lucide-react'
import { db } from '@/lib/db'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { StatsGrid } from '@/components/property-management/stats-grid'
import { PropertyTable } from '@/components/property-management/property-table'
import { MaintenanceBoard } from '@/components/property-management/maintenance-board'
import { CreateLeaseWizard } from '@/components/property-management/create-lease-wizard'
import { Button } from '@/components/ui/button'
import { isPropertyManagementEnabled } from '@/lib/property-management'

function isConnectionIssue(error: unknown) {
  if (!(error instanceof Error)) return false
  const code = (error as any)?.code
  if (error.name === 'PrismaClientInitializationError') return true
  if (code === 'P1001') return true
  const message = typeof error.message === 'string' ? error.message : ''
  return message.includes("Can't reach database server")
}

export default async function PropertyManagementPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id

  await requireAuth(tenantId, ['admin', 'agent'])

  if (!isPropertyManagementEnabled(tenant.theme)) {
    redirect('/admin')
  }

  const now = new Date()

  let properties: Awaited<ReturnType<typeof db.property.findMany>> = []
  let unitBreakdown: Array<{ status: string; _count: { _all: number } }> = []
  let maintenanceItems: Awaited<ReturnType<typeof db.maintenanceRequest.findMany>> = []
  let maintenanceOpenByProperty: Array<{ propertyId: string; _count: { _all: number } }> = []
  let activeLeaseCount = 0
  let overduePayments = 0
  let overduePaymentsByProperty: Array<{ propertyId: string; _count: { _all: number } }> = []

  try {
    ;[
      properties,
      unitBreakdown,
      maintenanceItems,
      maintenanceOpenByProperty,
      activeLeaseCount,
      overduePayments,
      overduePaymentsByProperty,
    ] = await Promise.all([
      db.property.findMany({
        where: { tenantId },
        include: {
          Units: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
      db.unit.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { _all: true },
      }),
      db.maintenanceRequest.findMany({
        where: { tenantId },
        include: {
          Property: { select: { name: true } },
          Unit: { select: { label: true } },
        },
        orderBy: { requestedAt: 'desc' },
        take: 10,
      }),
      db.maintenanceRequest.groupBy({
        by: ['propertyId'],
        where: {
          tenantId,
          status: { in: ['OPEN', 'IN_PROGRESS', 'ON_HOLD'] },
        },
        _count: { _all: true },
      }),
      db.lease.count({
        where: {
          tenantId,
          status: { in: ['ACTIVE', 'DRAFT'] },
        },
      }),
      db.payment.count({
        where: {
          tenantId,
          status: { in: ['PENDING', 'PARTIAL'] },
          dueDate: { lt: now },
        },
      }),
      db.payment.findMany({
        where: {
          tenantId,
          status: { in: ['PENDING', 'PARTIAL'] },
          dueDate: { lt: now },
        },
        include: {
          Lease: {
            select: {
              Unit: {
                select: {
                  propertyId: true,
                },
              },
            },
          },
        },
      }),
    ])
  } catch (error) {
    if (!isConnectionIssue(error)) {
      throw error
    }

    console.warn('[PropertyManagementPage] Falling back to demo data due to database connectivity issue')

    properties = [
      {
        id: 'demo-property-1',
        tenantId,
        name: 'Demo Residences',
        code: 'DR-01',
        description: 'Placeholder property used when the database is unavailable.',
        addressLine1: '1 Demo Street',
        addressLine2: null,
        city: 'London',
        postcode: 'EC1A 1AA',
        country: 'UK',
        lat: null,
        lng: null,
        ownerName: 'Demo Owner',
        ownerEmail: 'owner@example.com',
        metadata: null,
        externalId: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        Units: [
          { id: 'demo-unit-1', status: 'OCCUPIED' as const },
          { id: 'demo-unit-2', status: 'VACANT' as const },
        ],
        Listings: [],
        Maintenance: [],
      },
    ] as any

    unitBreakdown = [
      { status: 'OCCUPIED', _count: { _all: 1 } },
      { status: 'VACANT', _count: { _all: 1 } },
    ]

    maintenanceItems = [
      {
        id: 'demo-maintenance-1',
        tenantId,
        propertyId: 'demo-property-1',
        unitId: null,
        tenantProfileId: null,
        summary: 'Demo maintenance task',
        description: 'Example maintenance request shown when offline.',
        priority: 'MEDIUM',
        status: 'OPEN',
        requestedAt: new Date('2024-01-05T09:00:00Z'),
        scheduledAt: null,
        resolvedAt: null,
        assignedAgentId: null,
        source: 'manual',
        attachments: null,
        metadata: null,
        Property: { name: 'Demo Residences' },
        Unit: null,
      },
    ] as any

    maintenanceOpenByProperty = [{ propertyId: 'demo-property-1', _count: { _all: 1 } }]
    activeLeaseCount = 1
    overduePayments = 0
    overduePaymentsByProperty = []
  }

  const totalProperties = properties.length
  const totalUnits = unitBreakdown.reduce((acc, current) => acc + current._count._all, 0)
  const occupiedUnits = unitBreakdown.find((row) => row.status === 'OCCUPIED')?._count._all ?? 0
  const vacancyUnits = totalUnits - occupiedUnits
  const vacancyRate = totalUnits > 0 ? Math.round((vacancyUnits / totalUnits) * 100) : 0

  const openMaintenanceTotal = maintenanceItems.filter((item) => ['OPEN', 'IN_PROGRESS', 'ON_HOLD'].includes(item.status)).length

  const maintenanceCountMap = new Map(maintenanceOpenByProperty.map((row) => [row.propertyId, row._count._all]))

  // Group overdue payments by property
  const overduePaymentsMap = new Map<string, number>()
  overduePaymentsByProperty.forEach((payment) => {
    const propertyId = payment.Lease?.Unit?.propertyId
    if (propertyId) {
      overduePaymentsMap.set(propertyId, (overduePaymentsMap.get(propertyId) || 0) + 1)
    }
  })

  const propertyRows = properties.map((property) => {
    const totalUnitsForProperty = property.Units.length
    const occupiedUnitsForProperty = property.Units.filter((unit) => unit.status === 'OCCUPIED').length
    const hasOverduePayments = overduePaymentsMap.get(property.id) ?? 0

    return {
      id: property.id,
      name: property.name,
      city: property.city,
      code: property.code,
      ownerName: property.ownerName,
      totalUnits: totalUnitsForProperty,
      occupiedUnits: occupiedUnitsForProperty,
      maintenanceOpen: maintenanceCountMap.get(property.id) ?? 0,
      overduePayments: hasOverduePayments,
      createdAt: property.createdAt.toISOString(),
    }
  })

  const maintenanceRows = maintenanceItems.map((item) => ({
    id: item.id,
    summary: item.summary,
    status: item.status,
    priority: item.priority,
    propertyName: item.Property.name,
    unitLabel: item.Unit?.label ?? null,
    requestedAt: item.requestedAt.toISOString(),
    assignedAgentId: item.assignedAgentId ?? null,
  }))

  const stats = [
    {
      label: 'Managed properties',
      value: totalProperties.toString(),
      helper: `${totalUnits} total units`,
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: 'Occupied units',
      value: `${occupiedUnits}/${totalUnits}`,
      helper: `Vacancy ${vacancyRate}%`,
      accent: vacancyRate > 15 ? 'warning' : 'success',
      icon: <Users2 className="h-5 w-5" />,
    },
    {
      label: 'Active leases',
      value: activeLeaseCount.toString(),
      helper: overduePayments > 0 ? `${overduePayments} overdue payments` : 'All payments current',
      accent: overduePayments > 0 ? 'warning' : 'success',
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      label: 'Open maintenance',
      value: openMaintenanceTotal.toString(),
      helper: openMaintenanceTotal > 0 ? 'Review queue' : 'All clear',
      accent: openMaintenanceTotal > 0 ? 'warning' : 'success',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Property Management</h1>
          <p className="text-sm text-gray-600">Portfolio control, maintenance triage, and rent collection in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/property-management/tenants">View Tenants</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/property-management/payments">View Payments</Link>
          </Button>
          <CreateLeaseWizard />
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PropertyTable properties={propertyRows} />
        </div>
        <div className="xl:col-span-2">
          <MaintenanceBoard maintenance={maintenanceRows} />
        </div>
      </div>
    </div>
  )
}


