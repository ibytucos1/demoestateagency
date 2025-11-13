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
  Check,
  Zap,
  Info,
  Building,
  MapPinned,
  Clock
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
  const contactPhone = tenant.contactPhone || null
  const whatsappMessage = `Hi, I'm interested in ${listing.title}`
  const whatsappLink = whatsappNumber
    ? getWhatsAppTrackingUrl(whatsappNumber, whatsappMessage, listing.id, listing.slug)
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

  return (
    <>
      {/* Breadcrumbs - Sleeker design */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search results
          </Link>
        </div>
      </div>

      {/* Image Gallery - Full Width, Modern Layout */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <PropertyGallery 
            images={media} 
            propertyTitle={listing.title}
            typeLabel={getTypeLabel()}
            typeColor={getTypeColor()}
          />
        </div>
      </div>

      {/* Property Header - Clean, Premium Design */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${getTypeColor()}`}>
                  {getTypeLabel()}
                </span>
                {listing.propertyType && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                    {listing.propertyType}
                  </span>
                )}
                <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {timeIndicator}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {listing.title}
              </h1>

              {/* Address */}
              <div className="flex items-start gap-2 text-gray-600 mb-6">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg">
                  {listing.addressLine1}, {listing.city}
                  {listing.postcode && ` ${listing.postcode}`}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bed className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{listing.bedrooms}</span>
                    <span className="text-sm text-gray-600">Bedrooms</span>
                  </div>
                )}
                {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bath className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{listing.bathrooms}</span>
                    <span className="text-sm text-gray-600">Bathrooms</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price - Prominent Display */}
            <div className="lg:text-right">
              <div className="inline-block lg:block">
                <div className="text-sm text-gray-600 mb-1">Price</div>
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {formatPrice()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Description - Premium Card */}
              <Card className="shadow-md border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
                  <CardTitle className="text-xl font-bold text-gray-900">Property Description</CardTitle>
                </div>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features - Modern Grid */}
              {features.length > 0 && (
                <Card className="shadow-md border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold text-gray-900">Key Features</CardTitle>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800 capitalize">
                            {feature.replace(/-/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Agent Card - Premium Design */}
            <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
                    <Building className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{listing.Tenant.name}</h3>
                    <p className="text-sm text-white/90">Estate Agent</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <AgentCTAButtons
                  whatsappLink={whatsappLink}
                  phoneNumber={contactPhone || whatsappNumber}
                />
              </CardContent>
            </Card>

            {/* Contact Form - Modern Design */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-5 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">Request Information</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Fill out the form and we'll get back to you shortly</p>
              </div>
              <CardContent className="p-6">
                <LeadForm 
                  tenantId={listing.tenantId}
                  listingId={listing.id}
                  listingTitle={listing.title}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Collapsible Sections - Modern Design */}
              <Card className="shadow-md border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
                  <CardTitle className="text-xl font-bold text-gray-900">Additional Information</CardTitle>
                </div>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="location" className="border-b border-gray-100">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPinned className="h-5 w-5 text-primary" />
                          </div>
                          <span>Location & Area</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="text-sm text-gray-700 space-y-3 pl-13">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-900 mb-1">Address</p>
                            <p>{listing.addressLine1}, {listing.city}{listing.postcode && `, ${listing.postcode}`}</p>
                          </div>
                          <p className="leading-relaxed">This property is located in a desirable area with excellent transport links and local amenities.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="details" className="border-b border-gray-100">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Info className="h-5 w-5 text-primary" />
                          </div>
                          <span>Property Details</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm pl-13">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Property Type</span>
                            <p className="font-semibold text-gray-900 capitalize mt-1">{listing.propertyType || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Listing Type</span>
                            <p className="font-semibold text-gray-900 capitalize mt-1">{listing.type}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Bedrooms</span>
                            <p className="font-semibold text-gray-900 mt-1">{listing.bedrooms || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="text-gray-600 text-xs uppercase tracking-wide">Bathrooms</span>
                            <p className="font-semibold text-gray-900 mt-1">{listing.bathrooms || 'N/A'}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="epc" className="border-none">
                      <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <span>Energy Performance</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="text-sm text-gray-700 space-y-2 pl-13">
                          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <p className="font-medium text-amber-900">Energy Performance Certificate (EPC) information will be available soon.</p>
                            <p className="mt-2 text-xs text-amber-700">
                              An EPC gives you an idea of running costs and environmental impact of the property.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Map Section - Modern Design */}
      {listing.lat && listing.lng && (
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
              <p className="text-gray-600">Explore the property location and surrounding area</p>
            </div>
            <div className="h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
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
        </div>
      )}

      {/* Sticky Mobile CTA Bar */}
      <StickyCTABar 
        price={formatPrice()} 
        whatsappLink={whatsappLink} 
        phoneNumber={whatsappNumber}
      />
    </>
  )
}
