import { getTenantId } from '@/lib/tenant'
import { searchService } from '@/lib/search'
import { ListingCard } from '@/components/listing-card'
import { FilterBar } from '@/components/filter-bar'

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const tenantId = await getTenantId()

  const filters = {
    status: ['active'],
    type: searchParams.type ? [String(searchParams.type)] : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    city: searchParams.city ? String(searchParams.city) : undefined,
  }

  const result = await searchService.search({
    tenantId,
    ...filters,
    limit: 20,
    cursor: searchParams.cursor as string | undefined,
  })

  // Mock data for preview - use if no real listings
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

  // Use mock data if no real listings found
  const displayListings = result.listings.length > 0 ? result.listings : mockListings as any[]

  return (
    <div>
      {/* Filter Bar - Right under nav bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="container mx-auto px-4 py-4">
          <FilterBar />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Properties</h1>
        
        <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Listings */}
          <div className="lg:col-span-2 space-y-4">
            {displayListings.length > 0 ? (
              <>
                {displayListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
                {result.listings.length > 0 && result.hasMore && (
                  <div className="text-center pt-4">
                    <form action="/search" method="get">
                      <input type="hidden" name="cursor" value={result.nextCursor} />
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Our team is here to help you find your perfect property.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

