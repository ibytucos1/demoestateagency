import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { writeLimiter } from '@/lib/ratelimit'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

interface RouteParams {
  params: { id: string }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await writeLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    await requireAuth(tenant.id, ['admin', 'agent'])

    // Get the listing
    const listing = await db.listing.findFirst({
      where: {
        tenantId: tenant.id,
        id: params.id,
      },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check if already linked to a property
    if (listing.propertyId) {
      const existingProperty = await db.property.findFirst({
        where: {
          tenantId: tenant.id,
          id: listing.propertyId,
        },
      })

      if (existingProperty) {
        return NextResponse.json(
          { error: 'This listing is already linked to a managed property', property: existingProperty },
          { status: 400 }
        )
      }
    }

    // Parse body for options
    const body = await req.json().catch(() => ({}))
    const { createUnit = true } = body

    // Create the Property from listing data
    const property = await db.property.create({
      data: {
        tenantId: tenant.id,
        name: listing.title,
        addressLine1: listing.addressLine1,
        city: listing.city,
        postcode: listing.postcode || null,
        lat: listing.lat,
        lng: listing.lng,
        description: listing.description,
      },
    })

    // Create a Unit if requested (for apartment/flat listings)
    let unit = null
    if (createUnit) {
      unit = await db.unit.create({
        data: {
          tenantId: tenant.id,
          propertyId: property.id,
          label: listing.propertyType === 'apartment' || listing.propertyType === 'flat' ? 'Unit 1' : 'Main',
          bedrooms: listing.bedrooms || null,
          bathrooms: listing.bathrooms || null,
          status: listing.status === 'let' || listing.status === 'sold' ? 'OCCUPIED' : 'VACANT',
          rentAmount: listing.type === 'rent' ? new Prisma.Decimal(listing.price) : null,
        },
      })
    }

    // Link the listing to the property
    await db.listing.update({
      where: { id: listing.id },
      data: { propertyId: property.id },
    })

    return NextResponse.json(
      {
        success: true,
        property,
        unit,
        message: 'Listing successfully converted to managed property',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ConvertListingAPI.POST] failed', {
      listingId: params.id,
      message: error instanceof Error ? error.message : 'unknown error',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

