import { getTenant, getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { HeroSearch } from '@/components/hero-search'
import Link from 'next/link'
import Image from 'next/image'
import { Home, MapPin, Bed, Bath, Square } from 'lucide-react'

export default async function HomePage() {
  const tenantId = await getTenantId()
  const tenant = await getTenant(tenantId)

  // Get featured listings
  const featured = await db.listing.findMany({
    where: {
      tenantId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  // Get stats
  const stats = await db.listing.groupBy({
    by: ['type'],
    where: {
      tenantId,
      status: 'active',
    },
    _count: {
      id: true,
    },
  })

  const totalListings = stats.reduce((sum, stat) => sum + stat._count.id, 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Discover {totalListings} properties for sale and rent across the UK
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <HeroSearch />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.type} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{stat._count.id}</div>
                <div className="text-sm text-blue-100 capitalize">{stat.type} properties</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Hand-picked selections just for you</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/search">View All Properties</Link>
          </Button>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => {
              const media = listing.media as any[]
              const firstImage = media?.[0]
              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {firstImage?.key ? (
                      <Image
                        src={firstImage.key}
                        alt={firstImage.alt || listing.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800 capitalize shadow-md">
                        {listing.type}
                      </span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                        ${listing.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.addressLine1}, {listing.city}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {listing.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span className="font-medium">{listing.bedrooms}</span>
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span className="font-medium">{listing.bathrooms}</span>
                        </div>
                      )}
                      {listing.propertyType && (
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span className="font-medium capitalize">{listing.propertyType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No listings available. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our full collection of properties and find the perfect place to call home
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/search">Browse All Properties</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

