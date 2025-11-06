'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Building2, User, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PaymentRow {
  id: string
  tenantName: string
  propertyName: string
  unitLabel: string
  dueDate: string
  amountDue: number
  amountPaid: number | null
  paidAt: string | null
  status: string
  method: string | null
  reference: string | null
  isOverdue: boolean
}

interface PaymentsTableProps {
  payments: PaymentRow[]
}

const statusColors: Record<string, string> = {
  PAID: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PENDING: 'bg-blue-100 text-blue-700 border-blue-200',
  PARTIAL: 'bg-amber-100 text-amber-700 border-amber-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
  WAIVED: 'bg-slate-100 text-slate-700 border-slate-200',
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [overdueFilter, setOverdueFilter] = useState<boolean>(false)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const router = useRouter()

  const filtered = useMemo(() => {
    let result = payments

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (overdueFilter) {
      result = result.filter((p) => p.isOverdue)
    }

    return result
  }, [payments, statusFilter, overdueFilter])

  const handleMarkPaid = async (paymentId: string, amountDue: number) => {
    if (!confirm('Mark this payment as paid?')) return

    setProcessingId(paymentId)
    try {
      const response = await fetch(`/api/property-management/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountDue,
          paidAt: new Date().toISOString(),
          method: 'Manual',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to mark payment as paid')
      }

      router.refresh()
    } catch (error) {
      console.error('Failed to mark payment as paid:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to mark payment as paid'}`)
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Payment History</CardTitle>
          <p className="text-sm text-gray-500">All rent payments across your portfolio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === '' && !overdueFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('')
              setOverdueFilter(false)
            }}
          >
            All
          </Button>
          <Button
            variant={overdueFilter ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('')
              setOverdueFilter(true)
            }}
            className={overdueFilter ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Overdue
          </Button>
          <Button
            variant={statusFilter === 'PAID' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('PAID')
              setOverdueFilter(false)
            }}
          >
            Paid
          </Button>
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setStatusFilter('PENDING')
              setOverdueFilter(false)
            }}
          >
            Pending
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No payments match this filter.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((payment) => (
            <div
              key={payment.id}
              className={cn(
                'rounded-lg border p-4 transition-colors',
                payment.isOverdue && payment.status !== 'PAID'
                  ? 'border-red-200 bg-red-50/50'
                  : 'border-slate-200 hover:bg-slate-50/50'
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-semibold text-gray-900">{formatCurrency(payment.amountDue)}</h4>
                    <Badge className={cn('border', statusColors[payment.status] || statusColors.PENDING)}>
                      {payment.status.toLowerCase()}
                    </Badge>
                    {payment.isOverdue && payment.status !== 'PAID' && (
                      <Badge className="border bg-red-100 text-red-700 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{payment.tenantName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {payment.unitLabel} - {payment.propertyName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due: {formatDate(payment.dueDate)}</span>
                    </div>
                  </div>

                  {payment.paidAt && (
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      Paid on {formatDate(payment.paidAt)}
                      {payment.method && ` via ${payment.method}`}
                      {payment.reference && ` (Ref: ${payment.reference})`}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {payment.status !== 'PAID' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkPaid(payment.id, payment.amountDue)}
                      disabled={processingId === payment.id}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {processingId === payment.id ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                          Mark Paid
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

