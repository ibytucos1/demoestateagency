import { NextRequest, NextResponse } from 'next/server'
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client'
import { ZodError } from 'zod'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { maintenanceService, isPropertyManagementEnabled } from '@/lib/property-management'

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

    const searchParams = req.nextUrl.searchParams
    const statusParam = searchParams.get('status')
    const priorityParam = searchParams.get('priority')

    const status = statusParam
      ? statusParam
          .split(',')
          .map((value) => value.toUpperCase())
          .filter((value): value is MaintenanceStatus => (Object.values(MaintenanceStatus) as string[]).includes(value))
      : undefined

    const priority = priorityParam
      ? priorityParam
          .split(',')
          .map((value) => value.toUpperCase())
          .filter((value): value is MaintenancePriority => (Object.values(MaintenancePriority) as string[]).includes(value))
      : undefined

    const maintenanceRequests = await maintenanceService.list(tenant.id, { status, priority })
    return NextResponse.json({ maintenanceRequests })
  } catch (error) {
    console.error('[MaintenanceAPI.GET] failed', { message: error instanceof Error ? error.message : 'unknown error' })
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
    const maintenanceRequest = await maintenanceService.create(tenant.id, body)
    return NextResponse.json({ maintenanceRequest }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('[MaintenanceAPI.POST] failed', { message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

