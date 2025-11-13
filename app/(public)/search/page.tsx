import { getTenant, getTenantId } from '@/lib/tenant'
import { searchService } from '@/lib/search'
import { ListingCard } from '@/components/listing-card'
import { FilterBar } from '@/components/filter-bar'
import { PropertyMap } from '@/components/property-map'
import { normalizeCityName } from '@/lib/utils'
import { env } from '@/lib/env'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const tenantIdentifier = await getTenantId()
  const tenant = await getTenant(tenantIdentifier)
  
  // Get all tenants for showing all listings
  const allTenants = await db.tenant.findMany({
    select: { 
      id: true, 
      slug: true, 
      whatsappNumber: true,
      contactPhone: true,
      contactEmail: true,
    },
  })
  const tenantIds = allTenants.map((t: { id: string }) => t.id)

  const rawCity = searchParams.city
  const rawLat = searchParams.lat
  const rawLng = searchParams.lng
  const rawRadius = searchParams.radius
  const normalizedCity = rawCity ? normalizeCityName(String(rawCity)) : undefined
  const parsedLat =
    typeof rawLat === 'string' ? Number(rawLat) : undefined
  const parsedLng =
    typeof rawLng === 'string' ? Number(rawLng) : undefined
  const parsedRadius =
    typeof rawRadius === 'string' ? Number(rawRadius) : undefined
  const hasGeoFilter =
    parsedLat !== undefined &&
    !Number.isNaN(parsedLat) &&
    parsedLng !== undefined &&
    !Number.isNaN(parsedLng) &&
    parsedRadius !== undefined &&
    !Number.isNaN(parsedRadius)

  // Parse search parameters
  const filters = {
    status: ['active'],
    // Only filter by type if explicitly provided in URL params
    // Don't filter if type param is missing (show all types)
    type: searchParams.type && searchParams.type !== '' ? [String(searchParams.type)] : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    // Normalize city name to handle "London, UK" -> "London"
    city: hasGeoFilter ? undefined : normalizedCity,
    propertyType: searchParams.propertyType ? [String(searchParams.propertyType)] : undefined,
    // Keywords can be used for text search (title/description/address)
    keywords: searchParams.keywords ? String(searchParams.keywords) : undefined,
    // Features are comma-separated keywords for feature matching
    features: searchParams.keywords ? String(searchParams.keywords).split(',').map(k => k.trim()).filter(Boolean) : undefined,
    radius: hasGeoFilter ? parsedRadius : undefined,
    lat: hasGeoFilter ? parsedLat : undefined,
    lng: hasGeoFilter ? parsedLng : undefined,
    // Note: lat/lng would come from geocoding the city if needed
  }

  // Query listings from both tenants
  // Build where clause for all tenants
  const where: Prisma.ListingWhereInput = {
    tenantId: { in: tenantIds }, // Show listings from both tenants
    ...(filters.status && filters.status.length > 0 && { status: { in: filters.status } }),
    ...(filters.type && filters.type.length > 0 && { type: { in: filters.type } }),
    ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
    ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
    ...(filters.bedrooms !== undefined && { bedrooms: { gte: filters.bedrooms } }),
    ...(filters.propertyType && filters.propertyType.length > 0 && { propertyType: { in: filters.propertyType } }),
    ...(filters.city && { city: { contains: filters.city, mode: 'insensitive' } }),
    ...(filters.features && filters.features.length > 0 && { features: { hasSome: filters.features } }),
    ...(filters.keywords && {
      OR: [
        { title: { contains: filters.keywords, mode: 'insensitive' } },
        { description: { contains: filters.keywords, mode: 'insensitive' } },
        { addressLine1: { contains: filters.keywords, mode: 'insensitive' } },
      ],
    }),
  }

  // Handle geo filter if present
  const andConditions: Prisma.ListingWhereInput[] = []
  if (hasGeoFilter && filters.lat !== undefined && filters.lng !== undefined && filters.radius !== undefined) {
    const latDelta = filters.radius / 111
    const lngDenominator = Math.cos((filters.lat * Math.PI) / 180)
    const lngDelta = filters.radius / (111 * (Math.abs(lngDenominator) < 1e-6 ? 1 : lngDenominator))

    andConditions.push({
      lat: {
        gte: filters.lat - latDelta,
        lte: filters.lat + latDelta,
      },
      lng: {
        gte: filters.lng - lngDelta,
        lte: filters.lng + lngDelta,
      },
    })
  }

  if (andConditions.length > 0) {
    where.AND = andConditions
  }

  // Fetch listings
  const limit = 20
  const listings = await db.listing.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1, // Fetch one extra to check if there's more
  })

  // Apply radius filter in memory if geo filter is active
  let filteredListings = listings
  if (hasGeoFilter && filters.lat !== undefined && filters.lng !== undefined && filters.radius !== undefined) {
    filteredListings = listings.filter((listing: any) => {
      if (!listing.lat || !listing.lng) return false
      // Haversine distance calculation
      const R = 6371 // Earth's radius in km
      const dLat = ((listing.lat - filters.lat!) * Math.PI) / 180
      const dLon = ((listing.lng - filters.lng!) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((filters.lat! * Math.PI) / 180) *
          Math.cos((listing.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c
      return distance <= filters.radius!
    })
  }

  const hasMore = filteredListings.length > limit
  const results = hasMore ? filteredListings.slice(0, limit) : filteredListings

  // Generate next cursor for pagination
  let nextCursor: string | undefined
  if (hasMore && results.length > 0) {
    const last = results[results.length - 1]
    nextCursor = `${last.createdAt.toISOString()},${last.id}`
  }

  const result = {
    listings: results,
    nextCursor,
    hasMore,
  }
  
  // Get WhatsApp number from first tenant (or use current tenant's)
  const whatsappNumber = allTenants[0]?.whatsappNumber || tenant.whatsappNumber

  // Debug: Log search results
  if (env.NODE_ENV === 'development') {
    console.log('Search query:', {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      filters,
      resultCount: result.listings.length,
      listingIds: result.listings.map((l: any) => ({ id: l.id, title: l.title, city: l.city, status: l.status })),
      geo: {
        lat: filters.lat,
        lng: filters.lng,
        radius: filters.radius,
      },
    })
    
    // Also check if the specific listing exists
    const specificListing = result.listings.find((l: any) => l.id === 'cmhmfgz52000diwkf23if6m2j')
    if (specificListing) {
      console.log('✅ Found the listing!', specificListing.title)
    } else {
      console.log('❌ Listing not found in results')
    }
  }

  // Mock data for preview - use if no real listings (for development/demo)
  const mockListings = [
    {
      id: 'mock-1',
      slug: 'modern-family-home-southampton',
      title: 'Modern Family Home with Stunning Garden',
      addressLine1: '123 Oak Avenue',
      city: 'Southampton',
      postcode: 'SO14 2AB',
      price: 425000,
      currency: 'GBP',
      type: 'sale',
      bedrooms: 4,
      bathrooms: 2,
      propertyType: 'house',
      description: 'A beautifully presented four-bedroom family home located in a sought-after residential area. This stunning property features a spacious open-plan kitchen/dining area, modern bathroom, and a large rear garden perfect for entertaining. Close to excellent schools and local amenities.',
      features: ['parking', 'garden', 'garage', 'double-glazing'],
      media: [
        { key: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop', alt: 'Modern family home exterior' },
        { key: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', alt: 'Living room' },
        { key: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Kitchen' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'mock-2',
      slug: 'luxury-apartment-city-center',
      title: 'Luxury City Centre Apartment',
      addressLine1: '45 High Street',
      city: 'Bristol',
      postcode: 'BS1 2CD',
      price: 1850,
      currency: 'GBP',
      type: 'rent',
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'apartment',
      description: 'Stunning two-bedroom apartment in the heart of the city centre. Features include modern fitted kitchen, spacious living area, and two double bedrooms. Located within walking distance of shops, restaurants, and transport links.',
      features: ['parking', 'balcony', 'elevator', 'modern'],
      media: [
        { key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', alt: 'Modern apartment exterior' },
        { key: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', alt: 'Living room' },
        { key: 'https://images.unsplash.com/photo-1556912173-6719e5e7d328?w=800&h=600&fit=crop', alt: 'Bedroom' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'mock-3',
      slug: 'detached-victorian-villa',
      title: 'Stunning Victorian Detached Villa',
      addressLine1: '78 Victoria Road',
      city: 'Manchester',
      postcode: 'M14 3EF',
      price: 650000,
      currency: 'GBP',
      type: 'sale',
      bedrooms: 5,
      bathrooms: 3,
      propertyType: 'house',
      description: 'A magnificent Victorian detached villa offering spacious family accommodation over three floors. This period property has been sympathetically restored and modernised, retaining many original features including high ceilings, bay windows, and original fireplaces.',
      features: ['parking', 'garden', 'period-features', 'fireplace', 'garage'],
      media: [
        { key: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', alt: 'Victorian villa exterior' },
        { key: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', alt: 'Elegant living room' },
        { key: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', alt: 'Master bedroom' },
        { key: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Kitchen' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'mock-4',
      slug: 'studio-apartment-brighton',
      title: 'Bright & Modern Studio Apartment',
      addressLine1: '12 Marine Parade',
      city: 'Brighton',
      postcode: 'BN2 1GH',
      price: 950,
      currency: 'GBP',
      type: 'rent',
      bedrooms: 0,
      bathrooms: 1,
      propertyType: 'studio',
      description: 'Beautifully designed studio apartment with sea views. Modern open-plan living space, fully fitted kitchen, and contemporary bathroom. Perfect for professionals or students. Close to beach and city centre.',
      features: ['sea-view', 'modern', 'furnished', 'parking'],
      media: [
        { key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', alt: 'Studio apartment' },
        { key: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Living area' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'mock-5',
      slug: 'contemporary-penthouse-london',
      title: 'Contemporary Penthouse with Panoramic Views',
      addressLine1: '1 Skyline Tower',
      city: 'London',
      postcode: 'SW1A 1AA',
      price: 1200000,
      currency: 'GBP',
      type: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'penthouse',
      description: 'Exceptional penthouse apartment offering breathtaking panoramic views across the city. Features include floor-to-ceiling windows, private terrace, high-spec kitchen, and luxury bathroom. Residents have access to concierge, gym, and rooftop garden.',
      features: ['parking', 'balcony', 'concierge', 'gym', 'elevator', 'modern'],
      media: [
        { key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', alt: 'Penthouse exterior' },
        { key: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', alt: 'Living room with views' },
        { key: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Kitchen' },
        { key: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', alt: 'Master bedroom' },
        { key: 'https://images.unsplash.com/photo-1556912173-6719e5e7d328?w=800&h=600&fit=crop', alt: 'Terrace' },
      ],
      createdAt: new Date(),
    },
    {
      id: 'mock-6',
      slug: 'cottage-countryside',
      title: 'Charming Countryside Cottage',
      addressLine1: 'The Old Forge',
      city: 'Cotswolds',
      postcode: 'GL54 2JK',
      price: 575000,
      currency: 'GBP',
      type: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'cottage',
      description: 'Delightful stone-built cottage set in beautiful countryside surroundings. Character features throughout including exposed beams, inglenook fireplace, and original flagstone floors. Large garden with outbuildings and stunning rural views.',
      features: ['garden', 'parking', 'character', 'fireplace', 'rural'],
      media: [
        { key: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', alt: 'Cottage exterior' },
        { key: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', alt: 'Living room with fireplace' },
        { key: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', alt: 'Kitchen' },
        { key: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', alt: 'Garden' },
      ],
      createdAt: new Date(),
    },
  ]

  // Use backend results (only fallback to mock in development if needed)
  const displayListings = result.listings.length > 0 ? result.listings : []

  // Debug: Log what we found
  if (env.NODE_ENV === 'development') {
    console.log('Search results debug:', {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      filtersApplied: filters,
      totalResults: result.listings.length,
      hasMore: result.hasMore,
      listings: result.listings.map((l: any) => ({
        id: l.id,
        title: l.title,
        city: l.city,
        status: l.status,
        type: l.type,
      })),
    })
  }

  // Build search summary
  const searchSummary = []
  if (normalizedCity) searchSummary.push(`in ${normalizedCity}`)
  if (hasGeoFilter && filters.radius) {
    searchSummary.push(`within ${filters.radius}km`)
  }
  if (filters.type) searchSummary.push(`for ${filters.type[0]}`)
  if (filters.bedrooms) searchSummary.push(`with ${filters.bedrooms}+ bedrooms`)
  if (filters.minPrice || filters.maxPrice) {
    const priceRange = []
    if (filters.minPrice) priceRange.push(`£${filters.minPrice.toLocaleString()}`)
    if (filters.maxPrice) priceRange.push(`£${filters.maxPrice.toLocaleString()}`)
    searchSummary.push(`priced ${priceRange.join(' - ')}`)
  }

  return (
    <div>
      {/* Filter Bar - Right under nav bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <FilterBar />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {displayListings.length > 0 
              ? `${displayListings.length} Property${displayListings.length !== 1 ? 'ies' : ''} Found`
              : 'Search Properties'}
          </h1>
          {searchSummary.length > 0 && (
            <p className="text-muted-foreground">
              {searchSummary.join(' • ')}
            </p>
          )}
        </div>
        
        <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Listings */}
            <div className="lg:col-span-2 space-y-10">
              {displayListings.length > 0 ? (
                <>
                  {displayListings.map((listing: any) => {
                    // Find the tenant for this listing to get the correct WhatsApp number and name
                    const listingTenant = allTenants.find((t: { id: string; slug: string }) => t.id === listing.tenantId)
                    return (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        whatsappNumber={listingTenant?.whatsappNumber || whatsappNumber}
                        contactPhone={listingTenant?.contactPhone || null}
                        contactEmail={listingTenant?.contactEmail || null}
                        tenantName={listingTenant?.slug || null}
                      />
                    )
                  })}
                  {result.listings.length > 0 && result.hasMore && (
                  <div className="text-center pt-4">
                      <form action="/search" method="get">
                        {/* Preserve all search parameters */}
                        {searchParams.type && <input type="hidden" name="type" value={String(searchParams.type)} />}
                        {searchParams.city && <input type="hidden" name="city" value={String(searchParams.city)} />}
                        {searchParams.minPrice && <input type="hidden" name="minPrice" value={String(searchParams.minPrice)} />}
                        {searchParams.maxPrice && <input type="hidden" name="maxPrice" value={String(searchParams.maxPrice)} />}
                        {searchParams.bedrooms && <input type="hidden" name="bedrooms" value={String(searchParams.bedrooms)} />}
                        {searchParams.propertyType && <input type="hidden" name="propertyType" value={String(searchParams.propertyType)} />}
                        {searchParams.keywords && <input type="hidden" name="keywords" value={String(searchParams.keywords)} />}
                        {searchParams.radius && <input type="hidden" name="radius" value={String(searchParams.radius)} />}
                        <input type="hidden" name="cursor" value={result.nextCursor || ''} />
                        <button
                          type="submit"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                        Load More
                        </button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No listings found. Try adjusting your filters.</p>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Map - Desktop Only */}
              {displayListings.length > 0 && (
                <div className="hidden lg:block sticky top-24">
                  <PropertyMap 
                    listings={displayListings.map((l: any) => ({
                      id: l.id,
                      title: l.title,
                      lat: l.lat,
                      lng: l.lng,
                      price: l.price,
                      currency: l.currency,
                      type: l.type,
                      slug: l.slug,
                    }))}
                    apiKey={env.NEXT_PUBLIC_MAPS_BROWSER_KEY}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

