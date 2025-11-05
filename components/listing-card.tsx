'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Square, Heart, Share2, Eye } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: {
    id: string
    slug: string
    title: string
    addressLine1: string
    city: string
    postcode?: string | null
    price: number
    currency?: string
    type: string // 'rent' | 'sale' | 'commercial'
    bedrooms?: number | null
    bathrooms?: number | null
    propertyType?: string | null
    description?: string | null
    features?: string[] | null
    media: any
    createdAt?: Date
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const media = listing.media as any[]
  const firstImage = media?.[0]
  const imageCount = media?.length || 0
  
  const formatPrice = () => {
    const formatted = listing.price.toLocaleString()
    if (listing.type === 'rent') {
      return `£${formatted}/mo`
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
      case 'rent': return 'bg-blue-600'
      case 'sale': return 'bg-indigo-700'
      case 'commercial': return 'bg-blue-700'
      default: return 'bg-indigo-700'
    }
  }

  const description = listing.description ? listing.description.substring(0, 120) + '...' : ''

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl">
      <Link href={`/listing/${listing.slug}`}>
        <div className="flex flex-row">
          {/* Image Section - Left */}
          <div className="relative w-64 h-52 flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300">
            {firstImage?.key ? (
              <>
                <Image
                  src={firstImage.key}
                  alt={firstImage.alt || listing.title}
                  fill
                  className="object-cover"
                />
                {/* Image Counter Overlay */}
                {imageCount > 1 && (
                  <div className="absolute top-1 left-1 bg-blue-600/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5" />
                    {imageCount}
                  </div>
                )}
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsFavorite(!isFavorite)
                  }}
                  className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <Heart
                    className={cn(
                      'h-3 w-3 transition-colors',
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
                    )}
                  />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="text-sm">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section - Right */}
          <div className="flex-1 p-4 flex flex-col min-w-0">
            {/* Top Section */}
            <div className="flex-1">
              {/* Type Badges */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold text-white',
                    getTypeColor()
                  )}
                >
                  {getTypeLabel()}
                </span>
                {listing.propertyType && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                    {listing.propertyType}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-xl font-bold text-gray-900 mb-1">
                {formatPrice()}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">
                {listing.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
                <span className="text-xs line-clamp-1">
                  {listing.addressLine1}, {listing.city}
                </span>
              </div>

              {/* Features */}
              <div className="flex items-center gap-3 mb-2 text-gray-700">
                {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">{listing.bedrooms}</span>
                  </div>
                )}
                {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">{listing.bathrooms}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Action Button */}
            <div className="mt-auto pt-2">
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 h-8"
              >
                <span>View Details</span>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
