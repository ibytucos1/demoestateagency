import { getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LeadForm } from '@/components/lead-form'

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const tenantId = await getTenantId()
  const listing = await db.listing.findUnique({
    where: {
      tenantId_slug: {
        tenantId,
        slug: params.slug,
      },
    },
    include: {
      Tenant: true,
    },
  })

  if (!listing || listing.status !== 'active') {
    notFound()
  }

  const media = listing.media as any[]
  const features = listing.features || []

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.addressLine1,
      addressLocality: listing.city,
      postalCode: listing.postcode || '',
    },
    geo: listing.lat && listing.lng ? {
      '@type': 'GeoCoordinates',
      latitude: listing.lat,
      longitude: listing.lng,
    } : undefined,
    numberOfRooms: listing.bedrooms || undefined,
    numberOfBathroomsTotal: listing.bathrooms || undefined,
    price: listing.price,
    priceCurrency: listing.currency,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {media.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-video bg-muted ${idx === 0 ? 'col-span-2' : ''}`}
                  >
                    {img?.key ? (
                      <Image
                        src={img.key}
                        alt={img.alt || listing.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            {/* Key Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">${listing.price.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {listing.bedrooms && (
                    <div>
                      <span className="text-muted-foreground">Bedrooms</span>
                      <p className="font-semibold">{listing.bedrooms}</p>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div>
                      <span className="text-muted-foreground">Bathrooms</span>
                      <p className="font-semibold">{listing.bathrooms}</p>
                    </div>
                  )}
                  {listing.propertyType && (
                    <div>
                      <span className="text-muted-foreground">Type</span>
                      <p className="font-semibold capitalize">{listing.propertyType}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Listing Type</span>
                    <p className="font-semibold capitalize">{listing.type}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {listing.addressLine1}
                    <br />
                    {listing.city}
                    {listing.postcode && `, ${listing.postcode}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lead Form */}
            <LeadForm listingId={listing.id} listingTitle={listing.title} />
          </aside>
        </div>
      </div>
    </>
  )
}

