import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { readLimiter } from '@/lib/ratelimit'
import { env } from '@/lib/env'
import { placesService } from '@/lib/places'

export async function GET(req: NextRequest) {
  try {
    // Rate limiting for read operations
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await readLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    const tenantId = tenant.id
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
  } catch (error: unknown) {
    console.error('Listings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id
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

    const existing = await db.listing.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A listing with this slug already exists. Please choose a unique slug.' },
        { status: 409 }
      )
    }

    // Auto-geocode address if lat/lng are missing
    let finalLat = lat ? Number(lat) : null
    let finalLng = lng ? Number(lng) : null
    
    if (!finalLat || !finalLng) {
      try {
        // Build address string for geocoding
        const addressParts = [addressLine1, city, postcode].filter(Boolean)
        const addressString = addressParts.join(', ')
        
        const geocodeResult = await placesService.geocode(addressString)
        if (geocodeResult) {
          finalLat = geocodeResult.lat
          finalLng = geocodeResult.lng
        }
      } catch (geocodeError) {
        // Don't fail listing creation if geocoding fails, just log it
        console.warn('Geocoding failed for address:', addressLine1, city, geocodeError)
      }
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
        lat: finalLat,
        lng: finalLng,
        description,
        features: Array.isArray(features) ? features : [],
        media: Array.isArray(media) ? media : [],
      },
    })

    return NextResponse.json({ listing })
  } catch (error: unknown) {
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message?: string }
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A listing with this slug already exists. Please choose a unique slug.' },
          { status: 409 }
        )
      }
      // Catch P2003 for foreign key constraint violations
      if (prismaError.code === 'P2003') {
        console.error('Foreign key constraint error:', error)
        return NextResponse.json(
          { error: 'Foreign key constraint violated. Ensure tenant and other related entities exist.' },
          { status: 400 }
        )
      }
    }
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Redirecting to sign-in') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // In development, return the actual error message for debugging
      console.error('Listing creation error:', error)
      const isDev = env.NODE_ENV === 'development'
      return NextResponse.json(
        { error: isDev ? error.message : 'Internal server error' },
        { status: 500 }
      )
    }
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

