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
}

export function PropertyGallery({ images, propertyTitle }: PropertyGalleryProps) {
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
      {/* Gallery Grid */}
      <div className="space-y-2">
        {/* Main Image */}
        <div 
          className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={getImageUrl(images[0]) || ''}
            alt={images[0].alt || propertyTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg">
            <Maximize2 className="h-4 w-4" />
            <span>{images.length} Photos</span>
          </div>
          
          {/* View Gallery Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100">
              <Maximize2 className="h-4 w-4 mr-2" />
              View Gallery
            </Button>
          </div>
        </div>
        
        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <div
                key={`${img.key}-${idx}`}
                className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity group"
                onClick={() => openLightbox(idx + 1)}
              >
                <Image
                  src={getImageUrl(img) || ''}
                  alt={img.alt || propertyTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 15vw"
                />
                {idx === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">+{images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

