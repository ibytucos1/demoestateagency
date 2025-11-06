import { notFound, redirect } from 'next/navigation'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import { db } from '@/lib/db'
import { PaymentsTable } from '@/components/property-management/payments-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'

export default async function PaymentsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id

  await requireAuth(tenantId, ['admin', 'agent'])

  if (!isPropertyManagementEnabled(tenant.theme)) {
    redirect('/admin')
  }

  // Get all payments with related data
  const payments = await db.payment.findMany({
    where: {
      tenantId,
      Lease: {
        status: { in: ['ACTIVE', 'DRAFT'] },
      },
    },
    include: {
      Lease: {
        include: {
          TenantProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Unit: {
            select: {
              id: true,
              label: true,
              Property: {
                select: {
                  id: true,
                  name: true,
                  addressLine1: true,
                  city: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { dueDate: 'asc' },
    take: 500,
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate statistics
  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amountPaid || p.amountDue), 0)

  const totalPending = payments.filter((p) => p.status === 'PENDING').length

  const totalOverdue = payments.filter((p) => {
    if (p.status === 'PAID') return false
    const dueDate = new Date(p.dueDate)
    return dueDate < today
  }).length

  const overdueAmount = payments
    .filter((p) => {
      if (p.status === 'PAID') return false
      const dueDate = new Date(p.dueDate)
      return dueDate < today
    })
    .reduce((sum, p) => sum + Number(p.amountDue), 0)

  // Transform payments for the table
  const paymentRows = payments.map((payment) => {
    const tenantName = payment.Lease?.TenantProfile
      ? `${payment.Lease.TenantProfile.firstName} ${payment.Lease.TenantProfile.lastName}`.trim()
      : 'Unknown'
    
    const propertyName = payment.Lease?.Unit?.Property?.name || 'Unknown Property'
    const unitLabel = payment.Lease?.Unit?.label || 'Unknown Unit'
    
    const dueDate = new Date(payment.dueDate)
    const isOverdue = payment.status !== 'PAID' && dueDate < today

    return {
      id: payment.id,
      tenantName,
      propertyName,
      unitLabel,
      dueDate: payment.dueDate.toISOString(),
      amountDue: Number(payment.amountDue),
      amountPaid: payment.amountPaid ? Number(payment.amountPaid) : null,
      paidAt: payment.paidAt?.toISOString() || null,
      status: payment.status,
      method: payment.method,
      reference: payment.reference,
      isOverdue,
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Rent Payments</h1>
        <p className="text-sm text-gray-600">Track rent collection, overdue payments, and payment history.</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From paid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Not yet due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalOverdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">£{overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Needs collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <PaymentsTable payments={paymentRows} />
    </div>
  )
}

