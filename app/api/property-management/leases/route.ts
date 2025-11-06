import { NextRequest, NextResponse } from 'next/server'
import { LeaseStatus } from '@prisma/client'
import { ZodError } from 'zod'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { leaseService, paymentService, isPropertyManagementEnabled } from '@/lib/property-management'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface ListQuery {
  status?: LeaseStatus[]
  tenantProfileId?: string
  unitId?: string
}

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

    const searchParams = req.nextUrl.searchParams
    const statusParam = searchParams.get('status')
    const tenantProfileId = searchParams.get('tenantProfileId') ?? undefined
    const unitId = searchParams.get('unitId') ?? undefined

    const status = statusParam
      ? statusParam
          .split(',')
          .map((value) => value.toUpperCase())
          .filter((value): value is LeaseStatus => (Object.values(LeaseStatus) as string[]).includes(value))
      : undefined

    const leases = await leaseService.list(tenant.id, { status, tenantProfileId, unitId })
    return NextResponse.json({ leases })
  } catch (error) {
    console.error('[LeasesAPI.GET] failed', { message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await writeLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    if (!isPropertyManagementEnabled(tenant.theme)) {
      return NextResponse.json({ error: 'Property management not enabled' }, { status: 403 })
    }

    await requireAuth(tenant.id, ['admin', 'agent'])

    const body = await req.json()
    const months = Number(req.nextUrl.searchParams.get('generateMonths') ?? '0')
    const lease = await leaseService.create(tenant.id, body, {
      generateMonths: Number.isNaN(months) ? 0 : months,
    })

    return NextResponse.json({ lease }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('[LeasesAPI.POST] failed', { message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

