import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const leads = await db.lead.findMany({
      where: { tenantId },
      include: { Listing: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const headers = ['Name', 'Email', 'Phone', 'Listing', 'Message', 'Source', 'Date']
    const rows = leads.map((lead: any) => [
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
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 })
  }
}

