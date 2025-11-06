import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { writeLimiter } from '@/lib/ratelimit'
import { paymentService, isPropertyManagementEnabled } from '@/lib/property-management'

interface RouteParams {
  params: { id: string }
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
    const { amount, paidAt, method, reference } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const payment = await paymentService.markPaid(
      tenant.id,
      params.id,
      amount,
      paidAt ? new Date(paidAt) : new Date(),
      method,
      reference
    )

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('[PaymentAPI.PATCH] failed', { id: params.id, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

