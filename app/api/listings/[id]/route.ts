import { NextRequest, NextResponse } from 'next/server'
import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { placesService } from '@/lib/places'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
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
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
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
        console.warn('Geocoding failed during update:', geocodeError)
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
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    await requireAuth(tenantId, ['owner', 'admin'])

    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
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

