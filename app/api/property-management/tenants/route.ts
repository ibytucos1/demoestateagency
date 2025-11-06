import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { isPropertyManagementEnabled } from '@/lib/property-management'
import { tenantProfileCreateSchema } from '@/lib/property-management/schemas'
import { db } from '@/lib/db'

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
    const search = searchParams.get('search')

    const tenantProfiles = await db.tenantProfile.findMany({
      where: {
        tenantId: tenant.id,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ tenantProfiles })
  } catch (error) {
    console.error('[TenantsAPI.GET] failed', { message: error instanceof Error ? error.message : 'unknown error' })
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
    const data = tenantProfileCreateSchema.parse(body)

    const tenantProfile = await db.tenantProfile.create({
      data: {
        tenantId: tenant.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? null,
        phone: data.phone ?? null,
        alternateContact: data.alternateContact ?? undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        notes: data.notes ?? null,
        externalId: data.externalId ?? null,
      },
    })

    return NextResponse.json({ tenantProfile }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0]
      const message = firstError ? `${firstError.path.join('.')}: ${firstError.message}` : 'Validation failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }
    console.error('[TenantsAPI.POST] failed', { message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

