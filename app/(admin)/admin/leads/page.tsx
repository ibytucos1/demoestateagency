import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, TrendingUp, Clock, FileText, Phone, Globe, MessageSquare } from 'lucide-react'

function isConnectionIssue(error: unknown) {
  if (!(error instanceof Error)) return false
  const code = (error as any)?.code
  if (error.name === 'PrismaClientInitializationError') return true
  if (code === 'P1001') return true
  const message = typeof error.message === 'string' ? error.message : ''
  return message.includes("Can't reach database server")
}

export default async function LeadsPage() {
  const tenant = await getTenant()
  const tenantId = tenant.id
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  // Fetch leads with metrics
  let leads: Awaited<ReturnType<typeof db.lead.findMany>> = []
  let metrics: any[] = []

  try {
    ;[leads, metrics] = await Promise.all([
      db.lead.findMany({
        where: { tenantId },
        include: {
          Listing: {
            select: { title: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      // Calculate metrics
      Promise.all([
        // Total leads
        db.lead.count({ where: { tenantId } }),
        // Leads with listing
        db.lead.count({ where: { tenantId, listingId: { not: null } } }),
        // Leads without listing (general enquiries)
        db.lead.count({ where: { tenantId, listingId: null } }),
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
        // WhatsApp clicks - total (with error handling for missing table)
        (async () => {
          try {
            // @ts-ignore - WhatsAppClick model may not exist until migration is run
            return await (db as any).whatsAppClick?.count({ where: { tenantId } }) || 0
          } catch {
            return 0
          }
        })(),
        // WhatsApp clicks - last 7 days
        (async () => {
          try {
            // @ts-ignore - WhatsAppClick model may not exist until migration is run
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
            // @ts-ignore - WhatsAppClick model may not exist until migration is run
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
            // @ts-ignore - WhatsAppClick model may not exist until migration is run
            const clicks = await (db as any).whatsAppClick?.findMany({
              where: {
                tenantId,
                createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
              },
              select: { ipAddress: true },
            }) || []
            const uniqueIPs = new Set(clicks.map((c: any) => c.ipAddress).filter(Boolean))
            return Array.from(uniqueIPs).map((ip: any) => ({ ipAddress: ip }))
          } catch {
            return []
          }
        })(),
      ]),
    ])
  } catch (error) {
    if (!isConnectionIssue(error)) {
      throw error
    }

    console.warn('[LeadsPage] Falling back to demo data due to database connectivity issue')

    leads = [
      {
        id: 'demo-lead-1',
        tenantId,
        listingId: null,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+44 20 7946 0000',
        message: 'Interested in scheduling a viewing for the demo property.',
        source: 'form',
        createdAt: new Date('2024-01-10T09:00:00Z'),
        updatedAt: new Date('2024-01-10T09:00:00Z'),
        Listing: null,
      },
    ] as any

    metrics = [
      1, // totalLeads
      0, // leadsWithListing
      1, // generalLeads
      0, // leadsLast7Days
      0, // leadsLast30Days
      [{ source: 'form', _count: { source: 1 } }], // leadsBySource
      0, // whatsappClicksTotal
      0, // whatsappClicksLast7Days
      0, // whatsappClicksLast30Days
      [], // uniqueWhatsappUsers
    ]
  }

  const [
    totalLeads,
    leadsWithListing,
    generalLeads,
    leadsLast7Days,
    leadsLast30Days,
    leadsBySource,
    whatsappClicksTotal,
    whatsappClicksLast7Days,
    whatsappClicksLast30Days,
    uniqueWhatsappUsers,
  ] = metrics

  const uniqueWhatsappUsersCount = uniqueWhatsappUsers.length

  // Format source counts
  const sourceCounts = {
    form: leadsBySource.find((s: any) => s.source === 'form')?._count.source || 0,
    phone: leadsBySource.find((s: any) => s.source === 'phone')?._count.source || 0,
    portal: leadsBySource.find((s: any) => s.source === 'portal')?._count.source || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button asChild>
          <a href="/api/leads/export">Export CSV</a>
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time leads
            </p>
          </CardContent>
        </Card>

        {/* Leads Last 7 Days */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsLast7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {leadsLast30Days} in last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Leads by Source - Form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Enquiries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceCounts.form}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Via contact forms
            </p>
          </CardContent>
        </Card>

        {/* Property-Specific Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Enquiries</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsWithListing}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {generalLeads} general enquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Source Breakdown */}
      {(sourceCounts.phone > 0 || sourceCounts.portal > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{sourceCounts.form}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <FileText className="h-3 w-3" />
                  Forms
                </div>
              </div>
              {sourceCounts.phone > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{sourceCounts.phone}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </div>
                </div>
              )}
              {sourceCounts.portal > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{sourceCounts.portal}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Globe className="h-3 w-3" />
                    Portal
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{whatsappClicksTotal}</div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{whatsappClicksLast7Days}</div>
              <div className="text-sm text-muted-foreground">Last 7 Days</div>
              <div className="text-xs text-muted-foreground mt-1">
                {whatsappClicksLast30Days} in last 30 days
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{uniqueWhatsappUsersCount}</div>
              <div className="text-sm text-muted-foreground">Unique Users (30d)</div>
              <div className="text-xs text-muted-foreground mt-1">
                People who clicked WhatsApp links
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Leads</h2>
        <div className="grid gap-4">
          {leads.map((lead: any) => (
            <Card key={lead.id}>
              <CardHeader>
                <CardTitle>{lead.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </p>
                  {lead.phone && (
                    <p>
                      <strong>Phone:</strong> <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </p>
                  )}
                  {lead.Listing && (
                    <p>
                      <strong>Listing:</strong>{' '}
                      <a href={`/listing/${lead.Listing.slug}`} className="text-primary hover:underline">
                        {lead.Listing.title}
                      </a>
                    </p>
                  )}
                  <p>
                    <strong>Message:</strong> {lead.message}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Source: {lead.source}</span>
                    <span>{new Date(lead.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {leads.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No leads yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
