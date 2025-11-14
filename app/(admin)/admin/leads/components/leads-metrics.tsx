import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Phone, MessageSquare } from 'lucide-react'

interface LeadsMetricsProps {
  tenantId: string
}

/**
 * Async Server Component: Fetches and displays lead metrics
 * 
 * Queries:
 * - Total leads count
 * - Leads by status (groupBy)
 * - Leads last 7/30 days
 * - Leads by source (groupBy)
 * - WhatsApp clicks (total, 7d, 30d, unique users)
 * 
 * Total: 9+ database queries
 */
export async function LeadsMetrics({ tenantId }: LeadsMetricsProps) {
  let metrics: any[] = []

  try {
    metrics = await Promise.all([
      // Total leads
      db.lead.count({ where: { tenantId } }),
      
      // Leads by status (with fallback for unmigrated DB)
      (async () => {
        try {
          return await db.lead.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { status: true },
          })
        } catch (error) {
          console.warn('[LeadsMetrics] Status field not available, using fallback')
          const totalLeads = await db.lead.count({ where: { tenantId } })
          return [{ status: 'new', _count: { status: totalLeads } }]
        }
      })(),
      
      // Leads in last 7 days
      db.lead.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      
      // Leads in last 30 days
      db.lead.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      
      // Leads by source
      db.lead.groupBy({
        by: ['source'],
        where: { tenantId },
        _count: { source: true },
      }),
      
      // WhatsApp clicks - total
      (async () => {
        try {
          // @ts-ignore - WhatsAppClick model may not exist
          return await (db as any).whatsAppClick?.count({ where: { tenantId } }) || 0
        } catch {
          return 0
        }
      })(),
      
      // WhatsApp clicks - last 7 days
      (async () => {
        try {
          // @ts-ignore
          return await (db as any).whatsAppClick?.count({
            where: {
              tenantId,
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          }) || 0
        } catch {
          return 0
        }
      })(),
      
      // WhatsApp clicks - last 30 days
      (async () => {
        try {
          // @ts-ignore
          return await (db as any).whatsAppClick?.count({
            where: {
              tenantId,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          }) || 0
        } catch {
          return 0
        }
      })(),
      
      // Unique WhatsApp users (by IP) - last 30 days
      (async () => {
        try {
          // @ts-ignore
          const clicks = await (db as any).whatsAppClick?.findMany({
            where: {
              tenantId,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
            select: { ipAddress: true },
          }) || []
          const uniqueIPs = new Set(clicks.map((c: any) => c.ipAddress).filter(Boolean))
          return uniqueIPs.size
        } catch {
          return 0
        }
      })(),
    ])
  } catch (error) {
    console.error('[LeadsMetrics] Error fetching metrics:', error)
    // Return empty metrics on error
    metrics = [0, [], 0, 0, [], 0, 0, 0, 0]
  }

  const [
    totalLeads,
    leadsByStatus,
    leadsLast7Days,
    leadsLast30Days,
    leadsBySource,
    whatsappClicksTotal,
    whatsappClicksLast7Days,
    whatsappClicksLast30Days,
    uniqueWhatsappUsersCount,
  ] = metrics

  // Format status counts
  const statusCounts = {
    new: leadsByStatus.find((s: any) => s.status === 'new')?._count.status || 0,
    contacted: leadsByStatus.find((s: any) => s.status === 'contacted')?._count.status || 0,
    qualified: leadsByStatus.find((s: any) => s.status === 'qualified')?._count.status || 0,
    converted: leadsByStatus.find((s: any) => s.status === 'converted')?._count.status || 0,
    archived: leadsByStatus.find((s: any) => s.status === 'archived')?._count.status || 0,
  }

  return (
    <>
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {leadsLast7Days} in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsLast30Days}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Inquiries</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leadsBySource.find((s: any) => s.source === 'phone')?._count.source || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Clicks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whatsappClicksTotal}</div>
            <p className="text-xs text-muted-foreground">
              {whatsappClicksLast7Days} in last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Leads by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-900 hover:bg-blue-100">
                New
              </Badge>
              <span className="text-sm font-semibold">{statusCounts.new}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-900 hover:bg-yellow-100">
                Contacted
              </Badge>
              <span className="text-sm font-semibold">{statusCounts.contacted}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-900 hover:bg-purple-100">
                Qualified
              </Badge>
              <span className="text-sm font-semibold">{statusCounts.qualified}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-900 hover:bg-green-100">
                Converted
              </Badge>
              <span className="text-sm font-semibold">{statusCounts.converted}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-100">
                Archived
              </Badge>
              <span className="text-sm font-semibold">{statusCounts.archived}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

