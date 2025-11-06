'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CreatePropertyDialog } from './create-property-dialog'

export interface PropertyListItem {
  id: string
  name: string
  city: string
  code?: string | null
  ownerName?: string | null
  totalUnits: number
  occupiedUnits: number
  maintenanceOpen: number
  overduePayments: number
  createdAt: string
}

interface PropertyTableProps {
  properties: PropertyListItem[]
}

export function PropertyTable({ properties }: PropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showOccupiedOnly, setShowOccupiedOnly] = useState(false)

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = [property.name, property.city, property.code]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesOccupancy = showOccupiedOnly ? property.occupiedUnits > 0 : true

      return matchesSearch && matchesOccupancy
    })
  }, [properties, searchTerm, showOccupiedOnly])

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search properties or cities"
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showOccupiedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOccupiedOnly((prev) => !prev)}
            >
              Occupied only
            </Button>
            <CreatePropertyDialog />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">No properties match the current filters.</div>
          )}

          {filtered.map((property) => {
            const occupancyRate = property.totalUnits === 0 ? 0 : Math.round((property.occupiedUnits / property.totalUnits) * 100)
            const vacantUnits = property.totalUnits - property.occupiedUnits

            return (
              <div key={property.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                    {property.code && <Badge variant="secondary">{property.code}</Badge>}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.city}
                    {property.ownerName ? ` • Managed by ${property.ownerName}` : ''}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{property.totalUnits} units</span>
                    <span className={cn('rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700', occupancyRate > 80 && 'bg-emerald-200 text-emerald-800')}>
                      {property.occupiedUnits} occupied ({occupancyRate}% )
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{vacantUnits} vacant</span>
                    {property.maintenanceOpen > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                        {property.maintenanceOpen} open maintenance
                      </span>
                    )}
                    {property.occupiedUnits > 0 && property.overduePayments > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700 font-medium">
                        {property.overduePayments} rent overdue
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/property-management/${property.id}`}>Manage</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


