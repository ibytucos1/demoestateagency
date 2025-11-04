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
        {result.listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {result.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {result.hasMore && (
              <div className="text-center">
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
        </main>
      </div>
    </div>
  )
}

