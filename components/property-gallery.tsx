'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPublicUrlSync } from '@/lib/storage-utils'

interface PropertyGalleryProps {
  images: Array<{
    key: string
    url?: string
    alt?: string
  }>
  propertyTitle: string
  typeLabel?: string
  typeColor?: string
}

export function PropertyGallery({ images, propertyTitle, typeLabel, typeColor }: PropertyGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get image URL helper
  const getImageUrl = (image: any) => {
    if (image?.url) return image.url
    if (image?.key) return getPublicUrlSync(image.key)
    return null
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-muted-foreground">
        Images coming soon
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Full-Width Horizontal Scrollable Carousel - Rightmove Style */}
      <div className="lg:hidden -mx-4">
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {images.map((img, idx) => (
              <div 
                key={`mobile-img-${idx}`}
                className="relative flex-shrink-0 w-screen aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 snap-start"
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={getImageUrl(img) || ''}
                  alt={img.alt || propertyTitle}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="100vw"
                />
                {/* Type Badge - First image only */}
                {idx === 0 && typeLabel && typeColor && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${typeColor}`}>
                      {typeLabel}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Image Counter Badge - Bottom Right (Rightmove Style) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                1/{images.length}
              </span>
            </div>
          )}
          
          {/* Dot indicators - Bottom Center */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div 
                  key={`dot-${idx}`}
                  className="w-1.5 h-1.5 rounded-full bg-white/70"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Gallery Grid - Rightmove Style */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3 lg:h-[600px]">
        {/* Main Large Image - Left Side */}
        <div className="lg:col-span-7">
          <div 
            className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={getImageUrl(images[0]) || ''}
              alt={images[0].alt || propertyTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="58vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {/* Image Counter Badge */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                {images.length} Photos
              </div>
            )}
            
            {/* Type Badge */}
            {typeLabel && typeColor && (
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg ${typeColor}`}>
                  {typeLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Two Smaller Images - Right Side (Stacked vertically) */}
        <div className="lg:col-span-5 flex flex-col gap-3 h-full">
          {images.length > 1 ? (
            <>
              {/* First smaller image - Takes half the height */}
              <div 
                className="relative flex-1 min-h-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(1)}
              >
                <Image
                  src={getImageUrl(images[1]) || ''}
                  alt={images[1].alt || propertyTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="38vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              
              {/* Second smaller image - Takes half the height */}
              {images.length > 2 ? (
                <div 
                  className="relative flex-1 min-h-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(2)}
                >
                  <Image
                    src={getImageUrl(images[2]) || ''}
                    alt={images[2].alt || propertyTitle}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="38vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Show "+X more" overlay if there are more than 3 images */}
                  {images.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">+{images.length - 3} more</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative flex-1 min-h-0 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No additional images</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Placeholders when only 1 image */}
              <div className="relative flex-1 min-h-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No additional images</span>
              </div>
              <div className="relative flex-1 min-h-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No additional images</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={getImageUrl(images[currentImageIndex]) || ''}
                alt={images[currentImageIndex].alt || propertyTitle}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center max-w-7xl mx-auto">
              {images.map((img, idx) => (
                <button
                  key={`thumb-${idx}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === idx
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={getImageUrl(img) || ''}
                    alt={img.alt || propertyTitle}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

