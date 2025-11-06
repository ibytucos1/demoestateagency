/**
 * UK Postcode Lookup Service
 * Uses getaddress.io API for address lookup
 * Fallback to manual entry if API key not configured
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
 * Lookup addresses for a UK postcode
 * Using getaddress.io API (free tier: 10 lookups/day)
 * Alternative: postcodes.io (free but doesn't give full addresses)
 */
export async function lookupPostcode(postcode: string): Promise<UKAddress[]> {
  const apiKey = process.env.NEXT_PUBLIC_GETADDRESS_API_KEY || process.env.GETADDRESS_API_KEY
  
  if (!apiKey) {
    console.warn('No getaddress.io API key configured')
    return []
  }

  try {
    // Clean postcode (remove spaces, uppercase)
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase()
    
    const response = await fetch(
      `https://api.getaddress.io/find/${cleanPostcode}?api-key=${apiKey}&expand=true`
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Postcode not found')
      }
      throw new Error('Failed to lookup postcode')
    }

    const data = await response.json()
    
    // Parse addresses from getaddress.io format
    const addresses: UKAddress[] = data.addresses.map((addr: any) => ({
      line_1: addr.line_1 || '',
      line_2: addr.line_2 || '',
      line_3: addr.line_3 || '',
      town_or_city: addr.town_or_city || '',
      county: addr.county || '',
      postcode: addr.postcode || cleanPostcode,
      formatted_address: addr.formatted_address || [],
    }))

    return addresses
  } catch (error) {
    console.error('Postcode lookup error:', error)
    throw error
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

