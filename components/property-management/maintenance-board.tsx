'use client'

import Link from 'next/link'
import { ClipboardCheck, Wrench, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'

export interface MaintenanceListItem {
  id: string
  summary: string
  status: string
  priority: string
  propertyName: string
  unitLabel?: string | null
  requestedAt: string
  assignedAgentId?: string | null
}

const statusBadgeStyles: Record<string, string> = {
  OPEN: 'bg-amber-100 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
  ON_HOLD: 'bg-slate-100 text-slate-700 border-slate-200',
  RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-200 text-slate-700 border-slate-300',
}

const priorityIcon: Record<string, React.ReactNode> = {
  LOW: <Clock className="h-4 w-4" />,
  MEDIUM: <Wrench className="h-4 w-4" />,
  HIGH: <AlertTriangle className="h-4 w-4" />,
  URGENT: <AlertTriangle className="h-4 w-4 text-red-500" />,
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const timeDivisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
]

function formatRelativeTimeFromNow(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'just now'
  }

  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of timeDivisions) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return relativeTimeFormatter.format(Math.round(duration), 'year')
}

interface MaintenanceBoardProps {
  maintenance: MaintenanceListItem[]
}

export function MaintenanceBoard({ maintenance }: MaintenanceBoardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('OPEN')

  const filtered = useMemo(() => {
    if (!statusFilter) return maintenance
    return maintenance.filter((item) => item.status === statusFilter)
  }, [maintenance, statusFilter])

  const statuses = Array.from(new Set(maintenance.map((item) => item.status)))

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ClipboardCheck className="h-5 w-5" />
            Maintenance queue
          </CardTitle>
          <p className="text-sm text-gray-500">Track outstanding tickets across the portfolio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('')}
          >
            All
          </Button>
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Nothing to show for this filter.
          </div>
        )}

        {filtered.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-4 transition hover:border-slate-300">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-800">{item.propertyName}</span>
                  {item.unitLabel && <span>• Unit {item.unitLabel}</span>}
                </div>
                <p className="text-base font-semibold text-gray-900">{item.summary}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <Badge className={statusBadgeStyles[item.status] ?? statusBadgeStyles.OPEN}>{item.status.replace('_', ' ')}</Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {priorityIcon[item.priority]}
                    {item.priority.toLowerCase()}
                  </Badge>
                  <span>Opened {formatRelativeTimeFromNow(item.requestedAt)}</span>
                  {item.assignedAgentId && <span>Assigned to {item.assignedAgentId}</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/property-management/maintenance/${item.id}`}>Update</Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


