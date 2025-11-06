import { inngest } from './client'
import { db } from '@/lib/db'

const RENT_REMINDER_LOOKAHEAD_DAYS = 3
const MAINTENANCE_SLA_HOURS = 24

/**
 * Nightly sitemap rebuild
 */
export const rebuildSitemap = inngest.createFunction(
  { id: 'rebuild-sitemap' },
  { cron: '0 2 * * *' }, // 2 AM daily
  async ({ event, step }) => {
    // In production, trigger sitemap regeneration
    // This could invalidate Vercel cache or trigger a rebuild
    await step.run('rebuild-sitemap', async () => {
      console.log('Rebuilding sitemap...')
      // Placeholder: trigger sitemap regeneration
      return { success: true }
    })
  }
)

/**
 * Weekly leads digest email
 */
export const weeklyLeadsDigest = inngest.createFunction(
  { id: 'weekly-leads-digest' },
  { cron: '0 9 * * 1' }, // Monday 9 AM
  async ({ event, step }) => {
    // Placeholder: fetch leads from past week and send digest
    await step.run('send-digest', async () => {
      console.log('Sending weekly leads digest...')
      return { success: true }
    })
  }
)

/**
 * Reindex listings (stub for Typesense/Algolia)
 */
export const reindexListings = inngest.createFunction(
  { id: 'reindex-listings' },
  { event: 'listing/reindex' },
  async ({ event, step }) => {
    await step.run('reindex', async () => {
      console.log('Reindexing listings...')
      // Placeholder: sync to search service
      return { success: true }
    })
  }
)

/**
 * Daily rent reminder dispatcher (checks invoices due within the next 3 days)
 */
export const rentReminderDigest = inngest.createFunction(
  { id: 'property-management/rent-reminder' },
  { cron: '0 9 * * *' },
  async ({ step }) => {
    await step.run('scan-upcoming-payments', async () => {
      const today = new Date()
      const lookahead = new Date(today.getTime() + RENT_REMINDER_LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000)

      const upcoming = await db.payment.findMany({
        where: {
          status: { in: ['PENDING', 'PARTIAL'] },
          dueDate: { gte: today, lte: lookahead },
        },
        select: {
          id: true,
          tenantId: true,
          leaseId: true,
          dueDate: true,
          amountDue: true,
        },
        take: 100,
      })

      console.log('[RentReminderDigest] queued reminders', {
        count: upcoming.length,
      })

      return { count: upcoming.length }
    })
  }
)

/**
 * Hourly maintenance SLA watchdog (alerts on tickets older than 24h)
 */
export const maintenanceSlaWatcher = inngest.createFunction(
  { id: 'property-management/maintenance-sla' },
  { cron: '0 * * * *' },
  async ({ step }) => {
    await step.run('scan-stale-maintenance', async () => {
      const threshold = new Date(Date.now() - MAINTENANCE_SLA_HOURS * 60 * 60 * 1000)

      const stale = await db.maintenanceRequest.findMany({
        where: {
          status: { in: ['OPEN', 'IN_PROGRESS'] },
          requestedAt: { lt: threshold },
        },
        select: {
          id: true,
          tenantId: true,
          propertyId: true,
          requestedAt: true,
        },
        take: 50,
      })

      console.log('[MaintenanceSLAWatcher] stale tickets detected', {
        count: stale.length,
      })

      return { count: stale.length }
    })
  }
)

