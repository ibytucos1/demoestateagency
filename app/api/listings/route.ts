import { NextRequest, NextResponse } from 'next/server'
import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { readLimiter } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  try {
    // Rate limiting for read operations
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await readLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenantId = await getTenantId()
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')?.split(',') || ['active']

    const listings = await db.listing.findMany({
      where: {
        tenantId,
        status: { in: status },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Listings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await getTenantId()
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const body = await req.json()
    const {
      title,
      slug,
      status = 'draft',
      type,
      price,
      currency = 'USD',
      bedrooms,
      bathrooms,
      propertyType,
      addressLine1,
      city,
      postcode,
      lat,
      lng,
      description,
      features = [],
      media = [],
    } = body

    if (!title || !slug || !type || !price || !addressLine1 || !city || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const listing = await db.listing.create({
      data: {
        tenantId,
        title,
        slug,
        status,
        type,
        price: Number(price),
        currency,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        propertyType: propertyType || null,
        addressLine1,
        city,
        postcode: postcode || null,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        description,
        features: Array.isArray(features) ? features : [],
        media: Array.isArray(media) ? media : [],
      },
    })

    return NextResponse.json({ listing })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

