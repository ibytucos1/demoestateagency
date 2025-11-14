import { Suspense } from 'react'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { LeadsMetrics } from './components/leads-metrics'
import { LeadsContent } from './components/leads-content'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

/**
 * Leads Page with Suspense Boundaries
 * 
 * Structure:
 * - Shell (instant render): Header + layout
 * - Suspense 1: Metrics dashboard (9+ DB queries)
 * - Suspense 2: Leads list (heavy findMany with relations)
 */

export default async function LeadsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  return (
    <div className="space-y-6">
      {/* ✅ INSTANT: Header (no DB queries) */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Lead
        </Button>
      </div>

      {/* 🔄 SUSPENSE 1: Metrics Dashboard (9+ queries, ~200-500ms) */}
      <Suspense fallback={<MetricsSkeleton />}>
        <LeadsMetrics tenantId={tenantId} />
      </Suspense>

      {/* 🔄 SUSPENSE 2: Leads List (heavy query with relations, ~100-300ms) */}
      <Suspense fallback={<LeadsListSkeleton />}>
        <LeadsContent tenantId={tenantId} />
      </Suspense>
    </div>
  )
}

/**
 * Skeleton for metrics dashboard (matches actual metrics layout)
 */
function MetricsSkeleton() {
  return (
    <>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

/**
 * Skeleton for leads list (matches actual leads layout)
 */
function LeadsListSkeleton() {
  return (
    <>
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full md:w-48" />
            <Skeleton className="h-10 w-full md:w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
