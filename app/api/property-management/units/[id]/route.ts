import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { unitService, isPropertyManagementEnabled } from '@/lib/property-management'

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

    const unit = await unitService.getById(tenant.id, params.id)
    if (!unit) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ unit })
  } catch (error) {
    console.error('[UnitAPI.GET] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
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
    const unit = await unitService.update(tenant.id, params.id, body)
    return NextResponse.json({ unit })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('[UnitAPI.PATCH] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
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
    await unitService.delete(tenant.id, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UnitAPI.DELETE] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

