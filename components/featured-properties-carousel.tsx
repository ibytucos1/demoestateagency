'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react'

interface Listing {
  id: string
  slug: string
  title: string
  type: string
  price: number
  bedrooms?: number | null
  bathrooms?: number | null
  propertyType?: string | null
  addressLine1: string
  city: string
  media: any
}

interface FeaturedPropertiesCarouselProps {
  listings: Listing[]
}

export function FeaturedPropertiesCarousel({ listings }: FeaturedPropertiesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 400
    const scrollPosition = scrollContainerRef.current.scrollLeft
    
    scrollContainerRef.current.scrollTo({
      left: scrollPosition + (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 hover:bg-white shadow-lg border-0"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 hover:bg-white shadow-lg border-0"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {listings.map((listing) => {
          const media = listing.media as any[]
          const firstImage = media?.[0]
          return (
            <Link
              key={listing.id}
              href={`/listing/${listing.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex-shrink-0 w-full sm:w-[400px] snap-start"
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
                    £{listing.price.toLocaleString()}
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
    </div>
  )
}

