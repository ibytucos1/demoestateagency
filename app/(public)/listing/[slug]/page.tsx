import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { getTenant, getTenantId } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { db } from '@/lib/db'
import { env } from '@/lib/env'
import { getWhatsAppTrackingUrl } from '@/lib/whatsapp-utils'
import { getPublicUrlSync } from '@/lib/storage-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LeadForm } from '@/components/lead-form'
import { PropertyGallery } from '@/components/property-gallery'
import { StickyCTABar } from '@/components/sticky-cta-bar'
import { AgentCTAButtons } from '@/components/agent-cta-buttons'
import { PropertyMap } from '@/components/property-map'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MapPin,
  Bed,
  Bath,
  Home as HomeIcon,
  Share2,
  Heart,
  Calendar,
  Check,
  Zap,
  Info,
  Building,
  MapPinned,
  Clock,
  MessageCircle
} from 'lucide-react'

type ListingMedia = {
  key: string
  width?: number
  height?: number
  alt?: string
}

// Generate metadata for Open Graph / WhatsApp rich previews
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const listing = await db.listing.findFirst({
    where: {
      slug: params.slug,
      status: 'active',
    },
    include: {
      Tenant: true,
    },
  })

  if (!listing) {
    return {
      title: 'Listing Not Found',
    }
  }

  const media = Array.isArray(listing.media) ? (listing.media as ListingMedia[]) : []
  const firstImage = media[0]
  const imageUrl = firstImage ? getPublicUrlSync(firstImage.key) : null
  const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'
  
  const formatPrice = () => {
    const formatted = listing.price.toLocaleString()
    if (listing.type === 'rent') {
      return `£${formatted}/month`
    }
    return `£${formatted}`
  }

  const description = `${formatPrice()} - ${listing.bedrooms || 0} bed, ${listing.bathrooms || 0} bath ${listing.propertyType || 'property'} in ${listing.city}. ${listing.description.substring(0, 150)}...`

  return {
    title: `${listing.title} | ${listing.Tenant.name}`,
    description,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: listing.title,
      description,
      url: `${appUrl}/listing/${listing.slug}`,
      siteName: listing.Tenant.name,
      locale: 'en_GB',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
          type: 'image/webp',
        },
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  // For public pages, search across ALL tenants to find the listing
  const listing = await db.listing.findFirst({
    where: {
      slug: params.slug,
      status: 'active', // Only show active listings
    },
    include: {
      Tenant: true,
    },
    orderBy: {
      createdAt: 'desc', // If multiple tenants have same slug, show most recent
    },
  })

  if (!listing) {
    notFound()
  }

  // Use the tenant from the listing itself (not from logged-in user)
  const tenant = listing.Tenant

  const media = Array.isArray(listing.media) ? (listing.media as ListingMedia[]) : []
  const features = Array.isArray(listing.features) ? (listing.features as string[]) : []
  const appUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const whatsappNumber = tenant.whatsappNumber || null
  const whatsappMessage = `Hi, I'm interested in ${listing.title}`
  const whatsappLink = whatsappNumber
    ? getWhatsAppTrackingUrl(whatsappNumber, whatsappMessage, listing.id)
    : null
  
  const formatPrice = () => {
    const formatted = listing.price.toLocaleString()
    if (listing.type === 'rent') {
      return `£${formatted} pcm`
    }
    return `£${formatted}`
  }
  
  const getTypeLabel = () => {
    switch (listing.type) {
      case 'rent': return 'TO RENT'
      case 'sale': return 'FOR SALE'
      case 'commercial': return 'COMMERCIAL'
      default: return 'FOR SALE'
    }
  }
  
  const getTypeColor = () => {
    switch (listing.type) {
      case 'rent': return 'bg-emerald-600'
      case 'sale': return 'bg-primary'
      case 'commercial': return 'bg-amber-600'
      default: return 'bg-primary'
    }
  }
  
  // Calculate days since added
  const daysSinceAdded = Math.floor(
    (new Date().getTime() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const timeIndicator = daysSinceAdded === 0 
    ? 'Added today' 
    : daysSinceAdded === 1 
    ? 'Added yesterday' 
    : `Added ${daysSinceAdded} days ago`

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `${appUrl}/listing/${listing.slug}`,
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
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/search" className="hover:text-primary transition-colors">
                Back to search results
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Hero Section - Center of Attention */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <PropertyGallery 
            images={media} 
            propertyTitle={listing.title}
            typeLabel={getTypeLabel()}
            typeColor={getTypeColor()}
          />
        </div>
      </div>

      {/* Property Details Below Images */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {listing.propertyType && (
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                    {listing.propertyType}
                  </span>
                )}
                <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {timeIndicator}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                {listing.title}
              </h1>
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-base sm:text-lg">
                  {listing.addressLine1}, {listing.city}
                  {listing.postcode && `, ${listing.postcode}`}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatPrice()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Key Features Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
              {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{listing.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
              )}
              {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <Bath className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{listing.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              )}
              {listing.propertyType && (
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm col-span-2 sm:col-span-1">
                  <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <HomeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">{listing.propertyType}</div>
                  <div className="text-sm text-gray-600">Property Type</div>
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-gray-700 capitalize">
                          {feature.replace(/-/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collapsible Sections */}
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="location">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <MapPinned className="h-5 w-5 text-primary" />
                        Location & Area
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Google Map - Full Width */}
                        {listing.lat && listing.lng && (
                          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="h-[450px] w-full">
                              <PropertyMap 
                                listings={[{
                                  id: listing.id,
                                  title: listing.title,
                                  price: listing.price,
                                  currency: listing.currency,
                                  type: listing.type,
                                  lat: listing.lat,
                                  lng: listing.lng,
                                  slug: listing.slug,
                                  bedrooms: listing.bedrooms,
                                  bathrooms: listing.bathrooms,
                                  propertyType: listing.propertyType,
                                }]} 
                                apiKey={env.NEXT_PUBLIC_MAPS_BROWSER_KEY}
                              />
                            </div>
                          </div>
                        )}
                        <div className="text-sm text-gray-600 pt-2">
                          <p className="mb-2">
                            <strong>Address:</strong> {listing.addressLine1}, {listing.city}
                            {listing.postcode && `, ${listing.postcode}`}
                          </p>
                          <p>This property is located in a desirable area with excellent transport links and local amenities.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="details">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Property Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Property Type</span>
                          <p className="font-semibold capitalize">{listing.propertyType || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Listing Type</span>
                          <p className="font-semibold capitalize">{listing.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bedrooms</span>
                          <p className="font-semibold">{listing.bedrooms || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bathrooms</span>
                          <p className="font-semibold">{listing.bathrooms || 'N/A'}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="epc">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Energy Performance
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-gray-600">
                        <p>Energy Performance Certificate (EPC) information will be available soon.</p>
                        <p className="mt-2 text-xs text-gray-500">
                          An EPC gives you an idea of running costs and environmental impact of the property.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2 scrollbar-hide">
            {/* Agent Card */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{BRAND_NAME}</CardTitle>
                    <p className="text-sm text-gray-600">Estate Agent</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <AgentCTAButtons 
                  whatsappLink={whatsappLink} 
                  phoneNumber={whatsappNumber}
                />
              </CardContent>
            </Card>

            {/* Lead Form */}
            <LeadForm listingId={listing.id} listingTitle={listing.title} />
          </aside>
        </div>
      </div>

      {/* Sticky Mobile CTA Bar */}
      <StickyCTABar 
        price={formatPrice()} 
        whatsappLink={whatsappLink} 
        phoneNumber={whatsappNumber}
      />
    </>
  )
}
