import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { placesService } from '@/lib/places'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface RouteParams {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const tenant = await getTenant()
    const listing = await db.listing.findFirst({
      where: { id: params.id, tenantId: tenant.id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error: unknown) {
    console.error('Listing fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const tenant = await getTenant()
    await requireAuth(tenant.id, ['owner', 'admin', 'agent'])

    const listing = await db.listing.findFirst({
      where: { id: params.id, tenantId: tenant.id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await req.json()
    
    // Auto-geocode address if lat/lng are missing in update
    let updateData = { ...body }
    if (updateData.lat === undefined || updateData.lng === undefined || 
        (updateData.addressLine1 && (!updateData.lat || !updateData.lng))) {
      try {
        const addressParts = [
          updateData.addressLine1 || listing.addressLine1,
          updateData.city || listing.city,
          updateData.postcode || listing.postcode
        ].filter(Boolean)
        const addressString = addressParts.join(', ')
        
        const geocodeResult = await placesService.geocode(addressString)
        if (geocodeResult) {
          updateData.lat = geocodeResult.lat
          updateData.lng = geocodeResult.lng
        }
      } catch (geocodeError) {
        if (env.NODE_ENV !== 'production') {
          console.warn('Geocoding failed during update:', geocodeError)
        }
      }
    }
    
    const updated = await db.listing.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ listing: updated })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Listing update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const tenant = await getTenant()
    await requireAuth(tenant.id, ['owner', 'admin'])

    const listing = await db.listing.findFirst({
      where: { id: params.id, tenantId: tenant.id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await db.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Listing deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

