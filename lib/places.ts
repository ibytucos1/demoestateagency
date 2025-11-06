import { env } from './env'
import { redis } from './redis'

export interface PlaceAutocompleteResult {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface GeocodeResult {
  lat: number
  lng: number
  formatted_address: string
  place_id?: string
}

export interface PlaceDetails {
  place_id: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
}

export class PlacesService {
  private baseUrl = 'https://maps.googleapis.com/maps/api'
  private serverKey = env.PLACES_SERVER_KEY

  /**
   * Autocomplete places (with session token support)
   */
  async autocomplete(
    input: string,
    sessionToken?: string,
    options?: { types?: string; location?: string; radius?: number; components?: string }
  ): Promise<PlaceAutocompleteResult[]> {
    const cacheKey = `places:autocomplete:${input}:${JSON.stringify(options)}`
    const cached = (await redis.get(cacheKey)) as PlaceAutocompleteResult[] | null
    if (cached) return cached

    const params = new URLSearchParams({
      input,
      key: this.serverKey,
      ...(sessionToken && { sessiontoken: sessionToken }),
      ...(options?.types && { types: options.types }),
      ...(options?.location && { location: options.location }),
      ...(options?.radius && { radius: String(options.radius) }),
      ...(options?.components && { components: options.components }),
    })

    const response = await fetch(`${this.baseUrl}/place/autocomplete/json?${params}`)
    if (!response.ok) {
      throw new Error(`Places API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('🌍 Google Places API response status:', data.status)
    console.log('🌍 Google Places API predictions:', data.predictions?.length || 0)
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API error:', data.status, data.error_message)
      throw new Error(`Places API error: ${data.status}`)
    }

    const results = (data.predictions || []) as PlaceAutocompleteResult[]
    await redis.setex(cacheKey, 300, results) // Cache for 5 minutes
    return results
  }

  /**
   * Geocode an address
   */
  async geocode(address: string): Promise<GeocodeResult | null> {
    const cacheKey = `places:geocode:${address}`
    const cached = (await redis.get(cacheKey)) as GeocodeResult | null
    if (cached) return cached

    const params = new URLSearchParams({
      address,
      key: this.serverKey,
    })

    const response = await fetch(`${this.baseUrl}/geocode/json?${params}`)
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.status !== 'OK') {
      return null
    }

    const result = data.results[0]
    const geocodeResult: GeocodeResult = {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address,
      place_id: result.place_id,
    }

    await redis.setex(cacheKey, 3600, geocodeResult) // Cache for 1 hour
    return geocodeResult
  }

  /**
   * Get place details by place_id
   */
  async getPlaceDetails(placeId: string, sessionToken?: string): Promise<PlaceDetails | null> {
    const cacheKey = `places:details:${placeId}`
    const cached = (await redis.get(cacheKey)) as PlaceDetails | null
    if (cached) return cached

    const params = new URLSearchParams({
      place_id: placeId,
      key: this.serverKey,
      fields: 'place_id,formatted_address,geometry,address_components',
      ...(sessionToken && { sessiontoken: sessionToken }),
    })

    const response = await fetch(`${this.baseUrl}/place/details/json?${params}`)
    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.status !== 'OK') {
      return null
    }

    await redis.setex(cacheKey, 3600, data.result) // Cache for 1 hour
    return data.result as PlaceDetails
  }
}

export const placesService = new PlacesService()

