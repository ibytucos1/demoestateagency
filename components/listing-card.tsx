'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Heart, Eye, ChevronLeft, ChevronRight, Maximize2, MessageCircle, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPublicUrlSync } from '@/lib/storage-utils'
import { getWhatsAppTrackingUrl } from '@/lib/whatsapp-utils'

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
    squareFeet?: number | null
    createdAt?: Date
  }
  whatsappNumber?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  tenantName?: string | null
}

export function ListingCard({ listing, whatsappNumber, contactPhone, contactEmail, tenantName }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const media = listing.media as any[]
  const imageCount = media?.length || 0
  const currentImage = media?.[currentImageIndex]
  
  // Get image URL - use url if available, otherwise construct from key
  const getImageUrl = (image: any) => {
    if (image?.url) return image.url
    if (image?.key) return getPublicUrlSync(image.key)
    return null
  }
  
  const imageUrl = currentImage ? getImageUrl(currentImage) : null
  
  // Navigate to next image
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev: number) => (prev + 1) % imageCount)
  }
  
  // Navigate to previous image
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev: number) => (prev - 1 + imageCount) % imageCount)
  }
  
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
      <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary/50 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section - Left */}
          <div className="relative w-full sm:w-1/2 h-56 sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group/image">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={currentImage.alt || listing.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Image Navigation Arrows - Only show if multiple images */}
                {imageCount > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover/image:opacity-100 hover:scale-110 z-20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover/image:opacity-100 hover:scale-110 z-20"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                    
                    {/* Image Indicators (Dots) */}
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {media.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setCurrentImageIndex(index)
                          }}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-300',
                            index === currentImageIndex
                              ? 'w-6 bg-white'
                              : 'w-1.5 bg-white/50 hover:bg-white/75'
                          )}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Image Counter Overlay - Top Left */}
                {imageCount > 1 && (
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg">
                    <Eye className="h-4 w-4" />
                    <span>{currentImageIndex + 1} / {imageCount}</span>
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
          <div className="flex-1 p-4 sm:p-6 flex flex-col min-w-0">
            {/* Top Section */}
            <div className="flex-1">
              {/* Price & Property Type */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {formatPrice()}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {listing.propertyType && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize whitespace-nowrap">
                      {listing.propertyType}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                {listing.title}
              </h3>

              {/* Description */}
              {listing.description && (
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                  {listing.description}
                </p>
              )}

              {/* Features - Bedrooms, Bathrooms & Square Feet */}
              <div className="flex items-center gap-3 sm:gap-4 text-gray-700 mb-3 sm:mb-5">
                {listing.bedrooms !== undefined && listing.bedrooms !== null && (
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{listing.bedrooms} bd</span>
                  </div>
                )}
                {listing.bathrooms !== undefined && listing.bathrooms !== null && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{listing.bathrooms} bt</span>
                  </div>
                )}
                {listing.squareFeet !== undefined && listing.squareFeet !== null && (
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{listing.squareFeet.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Contact Buttons */}
            {(whatsappNumber || contactPhone || contactEmail) && (
              <div className="mt-3 sm:mt-6 pt-3 sm:pt-5 border-t-2 border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp Button */}
                  {whatsappNumber && (
                    <a
                      href={getWhatsAppTrackingUrl(whatsappNumber, `Hi, I'm interested in ${listing.title}`, listing.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-xs font-semibold">WhatsApp</span>
                    </a>
                  )}
                  
                  {/* Email Button */}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}?subject=Inquiry about ${listing.title}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-xs font-semibold">Email</span>
                    </a>
                  )}
                  
                  {/* Call Button */}
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="text-xs font-semibold">Call</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
