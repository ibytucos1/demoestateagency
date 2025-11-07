import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { LeadsClient } from './leads-client'

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
  let agents: Awaited<ReturnType<typeof db.user.findMany>> = []
  let metrics: any[] = []

  try {
    ;[leads, agents, metrics] = await Promise.all([
      db.lead.findMany({
        where: { tenantId },
        include: {
          Listing: {
            select: { title: true, slug: true },
          },
          AssignedUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      // Fetch agents for assignment
      db.user.findMany({
        where: { 
          tenantId,
          role: { in: ['owner', 'admin', 'agent'] }
        },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      }),
      // Calculate metrics
      Promise.all([
        // Total leads
        db.lead.count({ where: { tenantId } }),
        // Leads by status
        db.lead.groupBy({
          by: ['status'],
          where: { tenantId },
          _count: { status: true },
        }),
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
        assignedTo: null,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+44 20 7946 0000',
        message: 'Interested in scheduling a viewing for the demo property.',
        source: 'form',
        status: 'new',
        notes: null,
        createdAt: new Date('2024-01-10T09:00:00Z'),
        updatedAt: new Date('2024-01-10T09:00:00Z'),
        Listing: null,
        AssignedUser: null,
      },
    ] as any

    agents = []

    metrics = [
      1, // totalLeads
      [{ status: 'new', _count: { status: 1 } }], // leadsByStatus
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
    leadsByStatus,
    leadsLast7Days,
    leadsLast30Days,
    leadsBySource,
    whatsappClicksTotal,
    whatsappClicksLast7Days,
    whatsappClicksLast30Days,
    uniqueWhatsappUsers,
  ] = metrics

  // Format status counts
  const statusCounts = {
    new: leadsByStatus.find((s: any) => s.status === 'new')?._count.status || 0,
    contacted: leadsByStatus.find((s: any) => s.status === 'contacted')?._count.status || 0,
    qualified: leadsByStatus.find((s: any) => s.status === 'qualified')?._count.status || 0,
    converted: leadsByStatus.find((s: any) => s.status === 'converted')?._count.status || 0,
    archived: leadsByStatus.find((s: any) => s.status === 'archived')?._count.status || 0,
  }

  // Format source counts
  const sourceCounts = {
    form: leadsBySource.find((s: any) => s.source === 'form')?._count.source || 0,
    phone: leadsBySource.find((s: any) => s.source === 'phone')?._count.source || 0,
    portal: leadsBySource.find((s: any) => s.source === 'portal')?._count.source || 0,
    valuation: leadsBySource.find((s: any) => s.source === 'valuation')?._count.source || 0,
    contact: leadsBySource.find((s: any) => s.source === 'contact')?._count.source || 0,
  }

  const uniqueWhatsappUsersCount = uniqueWhatsappUsers.length

  return (
    <LeadsClient
      initialLeads={leads as any}
      agents={agents as any}
      metrics={{
        totalLeads,
        statusCounts,
        leadsLast7Days,
        leadsLast30Days,
        sourceCounts,
        whatsappClicksTotal,
        whatsappClicksLast7Days,
        whatsappClicksLast30Days,
        uniqueWhatsappUsersCount,
      }}
    />
  )
}
