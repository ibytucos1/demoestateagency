import { NextRequest, NextResponse } from 'next/server'
import { placesService } from '@/lib/places'
import { readLimiter } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    try {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      const { success } = await readLimiter.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    } catch (rateLimitError) {
      // Gracefully degrade if rate limiting fails
      console.warn('Rate limiting error (continuing):', rateLimitError)
    }

    const searchParams = req.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'autocomplete') {
      const input = searchParams.get('input')
      const sessionToken = searchParams.get('sessionToken') || undefined
      const types = searchParams.get('types') || undefined
      const location = searchParams.get('location') || undefined
      const radius = searchParams.get('radius') ? Number(searchParams.get('radius')) : undefined
      const components = searchParams.get('components') || undefined

      if (!input) {
        return NextResponse.json({ error: 'Missing input' }, { status: 400 })
      }

      const results = await placesService.autocomplete(input, sessionToken, {
        types,
        location,
        radius,
        components,
      })

      return NextResponse.json({ results })
    }

    if (action === 'geocode') {
      const address = searchParams.get('address')
      if (!address) {
        return NextResponse.json({ error: 'Missing address' }, { status: 400 })
      }

      const result = await placesService.geocode(address)
      return NextResponse.json({ result })
    }

    if (action === 'details') {
      const placeId = searchParams.get('placeId')
      const sessionToken = searchParams.get('sessionToken') || undefined

      if (!placeId) {
        return NextResponse.json({ error: 'Missing placeId' }, { status: 400 })
      }

      const result = await placesService.getPlaceDetails(placeId, sessionToken)
      return NextResponse.json({ result })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Places API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

