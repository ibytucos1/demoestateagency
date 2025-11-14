import { Suspense } from 'react'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import { Button } from '@/components/ui/button'
import { Filter, Upload, Plus } from 'lucide-react'
import Link from 'next/link'
import { ListingsTable } from './components/listings-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Listings Page with Suspense Boundaries
 * 
 * Structure:
 * - Shell (instant render): Header + controls
 * - Suspense: Listings table (2 DB queries: listings + statusCounts)
 */

export default async function ListingsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  const pmEnabled = isPropertyManagementEnabled(tenant.theme)

  return (
    <div className="space-y-6">
      {/* ✅ INSTANT: Header (no DB queries) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track all your properties</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" asChild size="sm" className="gap-2">
            <Link href="/admin/listings/import">
              <Upload className="h-4 w-4" />
              Import CSV
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/admin/listings/new">
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* 🔄 SUSPENSE: Listings Table (2 queries: listings + statusCounts, ~100-200ms) */}
      <Suspense fallback={<ListingsTableSkeleton />}>
        <ListingsTable tenantId={tenantId} pmEnabled={pmEnabled} />
      </Suspense>
    </div>
  )
}

/**
 * Skeleton for listings table (matches actual layout)
 */
function ListingsTableSkeleton() {
  return (
    <>
      {/* Page Title Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Skeleton className="h-10 w-full sm:w-96" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="col-span-4"><Skeleton className="h-4 w-24" /></div>
            <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
            <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
            <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
            <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                {/* Property */}
                <div className="col-span-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <Skeleton className="h-5 w-24" />
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
