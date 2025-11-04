import { getTenant, getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { HeroSearch } from '@/components/hero-search'
import { FeaturedPropertiesCarousel } from '@/components/featured-properties-carousel'
import { GoogleReviews } from '@/components/google-reviews'
import Link from 'next/link'
import Image from 'next/image'
import { Home } from 'lucide-react'

export default async function HomePage() {
  const tenantId = await getTenantId()
  const tenant = await getTenant(tenantId)

  // Get featured listings
  let featured = await db.listing.findMany({
    where: {
      tenantId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  // If no listings, use mock data
  if (featured.length === 0) {
    featured = [
      {
        id: 'mock-1',
        slug: 'luxury-3-bedroom-apartment-bristol',
        title: 'Luxury 3 Bedroom Apartment in Bristol',
        status: 'active',
        type: 'sale',
        price: 450000,
        currency: 'GBP',
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'apartment',
        addressLine1: '123 Clifton Hill',
        city: 'Bristol',
        postcode: 'BS8 1AA',
        lat: 51.4545,
        lng: -2.5879,
        description: 'A stunning modern apartment with panoramic city views, located in the heart of Clifton.',
        features: ['parking', 'garden', 'balcony', 'modern'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Modern apartment exterior',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
      {
        id: 'mock-2',
        slug: 'spacious-4-bedroom-family-home-bath',
        title: 'Spacious 4 Bedroom Family Home in Bath',
        status: 'active',
        type: 'sale',
        price: 675000,
        currency: 'GBP',
        bedrooms: 4,
        bathrooms: 3,
        propertyType: 'house',
        addressLine1: '45 Royal Crescent',
        city: 'Bath',
        postcode: 'BA1 2LR',
        lat: 51.3864,
        lng: -2.3608,
        description: 'Beautiful Georgian family home with period features and large garden.',
        features: ['parking', 'garden', 'period-features', 'fireplace'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Georgian house exterior',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
      {
        id: 'mock-3',
        slug: 'modern-2-bedroom-flat-city-center',
        title: 'Modern 2 Bedroom Flat - City Center',
        status: 'active',
        type: 'rent',
        price: 1200,
        currency: 'GBP',
        bedrooms: 2,
        bathrooms: 1,
        propertyType: 'apartment',
        addressLine1: '78 Queen Square',
        city: 'Bristol',
        postcode: 'BS1 4JX',
        lat: 51.4545,
        lng: -2.5974,
        description: 'Bright and airy flat in prime location, perfect for professionals.',
        features: ['parking', 'modern', 'central-heating'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Modern flat interior',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
      {
        id: 'mock-4',
        slug: 'charming-3-bedroom-cottage-countryside',
        title: 'Charming 3 Bedroom Cottage in Countryside',
        status: 'active',
        type: 'sale',
        price: 425000,
        currency: 'GBP',
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'house',
        addressLine1: '12 Village Lane',
        city: 'Bath',
        postcode: 'BA2 7XY',
        lat: 51.3758,
        lng: -2.3599,
        description: 'Idyllic countryside cottage with character features and large garden.',
        features: ['garden', 'parking', 'character', 'countryside'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Countryside cottage',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
      {
        id: 'mock-5',
        slug: 'stylish-1-bedroom-apartment-waterside',
        title: 'Stylish 1 Bedroom Apartment - Waterside',
        status: 'active',
        type: 'rent',
        price: 950,
        currency: 'GBP',
        bedrooms: 1,
        bathrooms: 1,
        propertyType: 'apartment',
        addressLine1: '15 Harbour View',
        city: 'Bristol',
        postcode: 'BS1 5TN',
        lat: 51.4484,
        lng: -2.5984,
        description: 'Contemporary waterside apartment with stunning views and modern amenities.',
        features: ['parking', 'modern', 'waterside', 'balcony'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Waterside apartment',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
      {
        id: 'mock-6',
        slug: 'executive-5-bedroom-detached-house',
        title: 'Executive 5 Bedroom Detached House',
        status: 'active',
        type: 'sale',
        price: 850000,
        currency: 'GBP',
        bedrooms: 5,
        bathrooms: 4,
        propertyType: 'house',
        addressLine1: '88 Oak Tree Drive',
        city: 'Bath',
        postcode: 'BA1 3AB',
        lat: 51.3789,
        lng: -2.3570,
        description: 'Spacious family home with double garage, large garden, and modern finishes.',
        features: ['parking', 'garden', 'garage', 'modern', 'fireplace'],
        media: [
          {
            key: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            width: 800,
            height: 600,
            alt: 'Executive detached house',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        tenantId,
      },
    ] as any[]
  }

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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-image.jpg"
            alt="Beautiful home"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-blue-700/50 to-indigo-800/50"></div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Your next home is just a<br />
            <span className="text-blue-600">Clicksmove</span> away.
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
            From first click to final keys, we make finding home effortless.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <HeroSearch />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.type} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{stat._count.id}</div>
                <div className="text-sm text-blue-100 capitalize">{stat.type} properties</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller/Landlord CTA Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Sell or Let Your Property?
            </h2>
            <p className="text-gray-700 text-base md:text-lg">
              Get a free valuation and expert advice to maximize your property's value. 
              List with confidence and reach qualified buyers and tenants.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white whitespace-nowrap">
              <Link href="/valuation">Get a Free Valuation</Link>
            </Button>
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
          <FeaturedPropertiesCarousel listings={featured} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No listings available. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Looking for a Place to Call Home?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          With Clicksmove, your dream property is only a few clicks away.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300">
            <Link href="/search">Browse All Properties</Link>
          </Button>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />
    </div>
  )
}

