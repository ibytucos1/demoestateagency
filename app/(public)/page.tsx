import { getTenant, getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { storage } from '@/lib/storage'

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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Find Your Dream Property</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Browse our curated selection of premium properties
        </p>
        <Button asChild size="lg">
          <Link href="/search">Start Searching</Link>
        </Button>
      </section>

      {/* Featured Listings */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((listing) => {
            const media = listing.media as any[]
            const firstImage = media?.[0]
            return (
              <Card key={listing.id} className="overflow-hidden">
                <Link href={`/listing/${listing.slug}`}>
                  <div className="aspect-video relative bg-muted">
                    {firstImage?.key && (
                      <Image
                        src={firstImage.key}
                        alt={firstImage.alt || listing.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription>
                      {listing.addressLine1}, {listing.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ${listing.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {listing.type}
                      </span>
                    </div>
                    {listing.bedrooms && listing.bathrooms && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {listing.bedrooms} bed • {listing.bathrooms} bath
                      </p>
                    )}
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
        {featured.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No listings available. Check back soon!
          </p>
        )}
      </section>
    </div>
  )
}

