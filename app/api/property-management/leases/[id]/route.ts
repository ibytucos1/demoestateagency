import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { leaseService, isPropertyManagementEnabled } from '@/lib/property-management'

interface RouteParams {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
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

    const lease = await leaseService.getById(tenant.id, params.id)
    if (!lease) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ lease })
  } catch (error) {
    console.error('[LeaseAPI.GET] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
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
    const lease = await leaseService.update(tenant.id, params.id, body)
    return NextResponse.json({ lease })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('[LeaseAPI.PATCH] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const terminatedAtParam = req.nextUrl.searchParams.get('terminatedAt')
    const terminatedAt = terminatedAtParam ? new Date(terminatedAtParam) : new Date()
    const lease = await leaseService.terminate(tenant.id, params.id, terminatedAt)
    return NextResponse.json({ lease })
  } catch (error) {
    console.error('[LeaseAPI.DELETE] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

