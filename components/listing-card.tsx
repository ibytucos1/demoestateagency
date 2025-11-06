'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Heart, Eye } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getPublicUrlSync } from '@/lib/storage-utils'

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
    lat?: number | null
    lng?: number | null
    createdAt?: Date
  }
  whatsappNumber?: string | null
  tenantName?: string | null
}

export function ListingCard({ listing, whatsappNumber, tenantName }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const media = listing.media as any[]
  const firstImage = media?.[0]
  const imageCount = media?.length || 0
  
  // Get image URL - use url if available, otherwise construct from key
  const getImageUrl = (image: any) => {
    if (image?.url) return image.url
    if (image?.key) return getPublicUrlSync(image.key)
    return null
  }
  
  const imageUrl = firstImage ? getImageUrl(firstImage) : null
  
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
      case 'rent': return 'bg-emerald-600'
      case 'sale': return 'bg-primary'
      case 'commercial': return 'bg-amber-600'
      default: return 'bg-primary'
    }
  }


  return (
    <Link href={`/listing/${listing.slug}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary/50 mb-6">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section - Left */}
          <div className="relative w-full sm:w-1/2 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={firstImage.alt || listing.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Image Counter Overlay - Top Left */}
                {imageCount > 1 && (
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Eye className="h-4 w-4" />
                    <span>{imageCount} photos</span>
                  </div>
                )}
                
                {/* Favorite Button - Top Right */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsFavorite(!isFavorite)
                  }}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:scale-110 z-10"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-all duration-300',
                      isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700 hover:text-red-500'
                    )}
                  />
                </button>
                
                {/* Type Badge - Bottom Left */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm',
                      getTypeColor()
                    )}
                  >
                    {getTypeLabel()}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-5xl mb-2">🏠</div>
                  <p className="text-sm font-medium">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section - Right */}
          <div className="flex-1 p-6 flex flex-col min-w-0">
            {/* Top Section */}
            <div className="flex-1">
              {/* Price & Property Type */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {formatPrice()}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {tenantName && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide">
                      {tenantName.toUpperCase()}
                    </span>
                  )}
                  {listing.propertyType && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize whitespace-nowrap">
                      {listing.propertyType}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                {listing.title}
              </h3>

              {/* Description */}
              {listing.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {listing.description}
                </p>
              )}

              {/* Location */}
              <div className="flex items-start gap-2 text-gray-600 mb-5">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium line-clamp-2">
                  {listing.addressLine1}, {listing.city}
                </span>
              </div>

              {/* Features - Bedrooms & Bathrooms */}
              <div className="flex items-center gap-6">
                {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <Bed className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">{listing.bedrooms}</span>
                      <span className="text-xs text-gray-500">Beds</span>
                    </div>
                  </div>
                )}
                {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <Bath className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">{listing.bathrooms}</span>
                      <span className="text-xs text-gray-500">Baths</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Action Button */}
            <div className="mt-6 pt-5 border-t-2 border-gray-100">
              <div className="flex items-center justify-between group/button cursor-pointer">
                <span className="text-sm font-bold text-primary group-hover/button:text-blue-700 transition-colors">
                  View full details
                </span>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white group-hover/button:bg-blue-700 transition-all duration-300 group-hover/button:scale-110 shadow-md group-hover/button:shadow-lg">
                  <svg
                    className="w-5 h-5 group-hover/button:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
