import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function exportLeadsCSV(tenantId: string) {
  'use server'
  const leads = await db.lead.findMany({
    where: { tenantId },
    include: { Listing: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const headers = ['Name', 'Email', 'Phone', 'Listing', 'Message', 'Source', 'Date']
  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.phone || '',
    lead.Listing?.title || 'General',
    lead.message.replace(/"/g, '""'),
    lead.source,
    lead.createdAt.toISOString(),
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}

export default async function LeadsPage() {
  const tenantId = await getTenantId()
  await requireAuth(tenantId, ['owner', 'admin', 'agent'])

  const leads = await db.lead.findMany({
    where: { tenantId },
    include: {
      Listing: {
        select: { title: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <form action={async () => {
          'use server'
          const csv = await exportLeadsCSV(tenantId)
          return new Response(csv, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="leads.csv"',
            },
          })
        }}>
          <Button type="submit">Export CSV</Button>
        </form>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => (
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
  )
}

