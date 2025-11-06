import { NextRequest, NextResponse } from 'next/server'
import { PaymentStatus } from '@prisma/client'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter } from '@/lib/ratelimit'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await readLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    if (!isPropertyManagementEnabled(tenant.theme)) {
      return NextResponse.json({ error: 'Property management not enabled' }, { status: 403 })
    }

    await requireAuth(tenant.id, ['admin', 'agent'])

    const statusParam = req.nextUrl.searchParams.get('status')
    const status = statusParam
      ? statusParam
          .split(',')
          .map((value) => value.toUpperCase())
          .filter((value): value is PaymentStatus => (Object.values(PaymentStatus) as string[]).includes(value))
      : undefined

    // Get all payments with lease, tenant, unit, and property information
    const payments = await db.payment.findMany({
      where: {
        tenantId: tenant.id,
        ...(status?.length ? { status: { in: status } } : {}),
        Lease: {
          status: { in: ['ACTIVE', 'DRAFT'] }, // Only show payments for active leases
        },
      },
      include: {
        Lease: {
          include: {
            TenantProfile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            Unit: {
              select: {
                id: true,
                label: true,
                Property: {
                  select: {
                    id: true,
                    name: true,
                    addressLine1: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 200, // Limit to 200 most recent payments
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('[PaymentsAPI.GET] failed', { message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

