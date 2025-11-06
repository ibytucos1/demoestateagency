/**
 * UK Postcode Lookup Service
 * Uses Google Places API for address lookup
 */

export interface UKAddress {
  line_1: string
  line_2?: string
  line_3?: string
  town_or_city: string
  county: string
  postcode: string
  formatted_address: string[]
}

/**
 * Lookup addresses for a UK postcode using Google Places API
 */
export async function lookupPostcode(postcode: string): Promise<UKAddress[]> {
  try {
    // Clean and format postcode
    const cleanPostcode = postcode.trim().toUpperCase()
    
    // Use Google Places Autocomplete via our API proxy
    const response = await fetch(
      `/api/places?action=autocomplete&input=${encodeURIComponent(cleanPostcode)}&types=address&components=country:uk`
    )

    if (!response.ok) {
      throw new Error('Failed to lookup postcode')
    }

    const data = await response.json()
    
    console.log('🔍 Postcode lookup response:', JSON.stringify(data, null, 2))
    
    // API returns { results } which is the array of predictions
    const predictions = data.results || []
    
    console.log('📍 Predictions found:', predictions.length)
    
    if (predictions.length === 0) {
      console.log('❌ No predictions returned from API')
      return []
    }

    // Get place details for each prediction to extract address components
    const addresses: UKAddress[] = []
    
    // Limit to first 10 results for performance
    const limitedPredictions = predictions.slice(0, 10)
    
    for (const prediction of limitedPredictions) {
      try {
        console.log('📌 Fetching details for place_id:', prediction.place_id)
        
        const detailsResponse = await fetch(
          `/api/places?action=details&placeId=${encodeURIComponent(prediction.place_id)}`
        )
        
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json()
          const result = detailsData.result
          
          console.log('📝 Place details:', result?.formatted_address)
          
          if (result && result.address_components) {
            const address = parseGoogleAddress(result.address_components, cleanPostcode)
            console.log('🏠 Parsed address:', address)
            if (address) {
              addresses.push(address)
            } else {
              console.log('⚠️ Address parsing returned null')
            }
          }
        } else {
          console.log('❌ Details response not OK:', detailsResponse.status)
        }
      } catch (err) {
        console.error('Error fetching place details:', err)
      }
    }
    
    console.log('✅ Total addresses parsed:', addresses.length)

    return addresses
  } catch (error) {
    console.error('Postcode lookup error:', error)
    throw error
  }
}

/**
 * Parse Google Places address components into our UKAddress format
 */
function parseGoogleAddress(components: any[], postcode: string): UKAddress | null {
  const addressMap: Record<string, string> = {}
  
  components.forEach((component: any) => {
    const type = component.types[0]
    addressMap[type] = component.long_name
  })

  const streetNumber = addressMap['street_number'] || ''
  const route = addressMap['route'] || ''
  const locality = addressMap['locality'] || addressMap['postal_town'] || ''
  const adminArea = addressMap['administrative_area_level_2'] || ''
  const postalCode = addressMap['postal_code'] || postcode

  // Only return if we have at least a route (street name)
  if (!route) {
    return null
  }

  const line1 = [streetNumber, route].filter(Boolean).join(' ')
  
  return {
    line_1: line1,
    line_2: addressMap['sublocality'] || '',
    line_3: '',
    town_or_city: locality,
    county: adminArea,
    postcode: postalCode,
    formatted_address: [line1, locality, postalCode].filter(Boolean),
  }
}

/**
 * Format address for display in dropdown
 */
export function formatAddressDisplay(address: UKAddress): string {
  const parts = [
    address.line_1,
    address.line_2,
    address.line_3,
    address.town_or_city,
  ].filter(Boolean)
  
  return parts.join(', ')
}

