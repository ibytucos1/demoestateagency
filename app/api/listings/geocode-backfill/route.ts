import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { placesService } from '@/lib/places'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API endpoint to backfill missing lat/lng for existing listings
 * POST /api/listings/geocode-backfill
 */
export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin'])

    // Find all listings with NULL lat or lng
    const listingsWithoutCoords = await db.listing.findMany({
      where: {
        tenantId,
        OR: [
          { lat: null },
          { lng: null },
        ],
      },
      select: {
        id: true,
        addressLine1: true,
        city: true,
        postcode: true,
      },
    })

    const results = {
      total: listingsWithoutCoords.length,
      success: 0,
      failed: 0,
      errors: [] as Array<{ id: string; error: string }>,
    }

    for (const listing of listingsWithoutCoords) {
      try {
        const addressParts = [
          listing.addressLine1,
          listing.city,
          listing.postcode,
        ].filter(Boolean)
        const addressString = addressParts.join(', ')

        const geocodeResult = await placesService.geocode(addressString)
        if (geocodeResult) {
          await db.listing.update({
            where: { id: listing.id },
            data: {
              lat: geocodeResult.lat,
              lng: geocodeResult.lng,
            },
          })
          results.success++
        } else {
          results.failed++
          results.errors.push({
            id: listing.id,
            error: 'Geocoding returned no results',
          })
        }
      } catch (error: unknown) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push({
          id: listing.id,
          error: errorMessage,
        })
      }
    }

    return NextResponse.json({
      message: `Geocoding complete: ${results.success} successful, ${results.failed} failed`,
      results,
    })
  } catch (error: unknown) {
    console.error('Geocode backfill error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Redirecting to sign-in') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json(
      { error: 'Failed to geocode listings' },
      { status: 500 }
    )
  }
}

