import { db } from '@/lib/db'
import { LeadsClient } from '../leads-client'

interface LeadsContentProps {
  tenantId: string
}

/**
 * Async Server Component: Fetches leads and agents, renders LeadsClient
 * 
 * Queries:
 * - Leads with relations (Listing, AssignedUser)
 * - Agents list
 * 
 * Total: 2 database queries (but heavy due to relations)
 */
export async function LeadsContent({ tenantId }: LeadsContentProps) {
  let leads: Awaited<ReturnType<typeof db.lead.findMany>> = []
  let agents: { id: string; name: string | null; email: string }[] = []

  try {
    ;[leads, agents] = await Promise.all([
      // Fetch leads with graceful handling for unmigrated DB
      (async () => {
        try {
          return await db.lead.findMany({
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
          })
        } catch (error) {
          // Fallback if AssignedUser relation doesn't exist yet
          console.warn('[LeadsContent] AssignedUser field not available, fetching without assignment')
          return await db.lead.findMany({
            where: { tenantId },
            include: {
              Listing: {
                select: { title: true, slug: true },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
          }) as any
        }
      })(),
      
      // Fetch agents for assignment
      db.user.findMany({
        where: { 
          tenantId,
          role: { in: ['owner', 'admin', 'agent'] }
        },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      }),
    ])
  } catch (error) {
    console.error('[LeadsContent] Error fetching leads:', error)
    // Return empty state on error
    leads = []
    agents = []
  }

  // Note: Metrics are now fetched separately in LeadsMetrics component
  // Pass empty metrics to LeadsClient (it will be refactored to not need them)
  const emptyMetrics = {
    totalLeads: 0,
    statusCounts: { new: 0, contacted: 0, qualified: 0, converted: 0, archived: 0 },
    leadsLast7Days: 0,
    leadsLast30Days: 0,
    sourceCounts: { form: 0, phone: 0, portal: 0, valuation: 0, contact: 0 },
    whatsappClicksTotal: 0,
    whatsappClicksLast7Days: 0,
    whatsappClicksLast30Days: 0,
    uniqueWhatsappUsersCount: 0,
  }

  return (
    <LeadsClient
      initialLeads={leads as any}
      agents={agents as any}
      metrics={emptyMetrics}
    />
  )
}

