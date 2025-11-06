'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bed, Bath, Calendar, UserCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TerminateLeaseButton } from './terminate-lease-button'
import { cn } from '@/lib/utils'

export interface UnitOverviewItem {
  id: string
  label: string
  status: string
  bedrooms?: number | null
  bathrooms?: number | null
  rentAmount?: string | null
  tenantName?: string | null
  leaseId?: string | null
  nextDueDate?: string | null
}

const statusColors: Record<string, string> = {
  VACANT: 'bg-slate-100 text-slate-700 border-slate-200',
  OCCUPIED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  MAINTENANCE: 'bg-amber-100 text-amber-700 border-amber-200',
  RESERVED: 'bg-blue-100 text-blue-700 border-blue-200',
}

interface UnitOverviewProps {
  units: UnitOverviewItem[]
}

export function UnitOverview({ units }: UnitOverviewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filtered = useMemo(() => {
    if (!statusFilter) return units
    return units.filter((unit) => unit.status === statusFilter)
  }, [statusFilter, units])

  const statuses = Array.from(new Set(units.map((unit) => unit.status)))

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Units</CardTitle>
          <p className="text-sm text-gray-500">Active leases and availability per unit.</p>
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
              {status.toLowerCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filtered.length === 0 && <p className="text-sm text-gray-500">No units match this filter.</p>}

        {filtered.map((unit) => (
          <div key={unit.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{unit.label}</h3>
                  <Badge className={cn('border', statusColors[unit.status] ?? statusColors.VACANT)}>
                    {unit.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {unit.bedrooms !== null && unit.bedrooms !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {unit.bedrooms} beds
                    </span>
                  )}
                  {unit.bathrooms !== null && unit.bathrooms !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {unit.bathrooms} baths
                    </span>
                  )}
                  {unit.rentAmount && <span>{unit.rentAmount}</span>}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 text-sm text-gray-600 sm:items-end">
                {unit.tenantName ? (
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <UserCircle2 className="h-4 w-4" />
                    {unit.tenantName}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">No active tenant</span>
                )}
                {unit.nextDueDate && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Next due {unit.nextDueDate}
                  </span>
                )}
                {unit.leaseId && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/property-management/leases/${unit.leaseId}`}>View lease</Link>
                    </Button>
                    <TerminateLeaseButton
                      leaseId={unit.leaseId}
                      tenantName={unit.tenantName}
                      unitLabel={unit.label}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


