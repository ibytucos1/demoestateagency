'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface PropertyMapProps {
  listings: Array<{
    id: string
    title: string
    lat?: number | null
    lng?: number | null
    price: number
    currency: string
    type: string
    slug: string
  }>
  apiKey: string
}

// Global flag to track if Google Maps is loading
let isGoogleMapsLoading = false
let googleMapsLoadPromise: Promise<void> | null = null

export function PropertyMap({ listings, apiKey }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // Filter listings with valid coordinates
  const validListings = useMemo(
    () => listings.filter((listing) => typeof listing.lat === 'number' && typeof listing.lng === 'number'),
    [listings],
  )

  useEffect(() => {
    if (!mapRef.current || validListings.length === 0) {
      setIsLoading(false)
      return
    }

    // Load Google Maps script only once
    const loadGoogleMaps = async (): Promise<void> => {
      // If already loaded, resolve immediately
      if (window.google?.maps?.marker) {
        return Promise.resolve()
      }

      // If currently loading, return existing promise
      if (isGoogleMapsLoading && googleMapsLoadPromise) {
        return googleMapsLoadPromise
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        // Wait for it to load
        return new Promise((resolve, reject) => {
          const checkLoaded = setInterval(() => {
            if (window.google?.maps?.marker) {
              clearInterval(checkLoaded)
              resolve()
            }
          }, 100)
          
          setTimeout(() => {
            clearInterval(checkLoaded)
            if (!window.google?.maps?.marker) {
              reject(new Error('Google Maps failed to load'))
            }
          }, 10000) // 10 second timeout
        })
      }

      // Start loading
      isGoogleMapsLoading = true
      googleMapsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`
        script.async = true
        script.defer = true
        script.onload = () => {
          isGoogleMapsLoading = false
          resolve()
        }
        script.onerror = () => {
          isGoogleMapsLoading = false
          googleMapsLoadPromise = null
          reject(new Error('Failed to load Google Maps'))
        }
        document.head.appendChild(script)
      })

      return googleMapsLoadPromise
    }

    const initializeMap = async () => {
      if (!mapRef.current) return

      try {
        // Wait for Google Maps to load
        await loadGoogleMaps()

        // Calculate center and bounds
        const bounds = new google.maps.LatLngBounds()
        validListings.forEach((listing) => {
          bounds.extend(new google.maps.LatLng(Number(listing.lat), Number(listing.lng)))
        })

        // Create map
        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: bounds.getCenter(),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapId: 'PROPERTY_MAP', // Required for AdvancedMarkerElement (styles controlled via Cloud Console)
        })

        // Fit bounds if multiple listings
        if (validListings.length > 1) {
          mapInstance.fitBounds(bounds)
        }

        setMap(mapInstance)

        // Create info window
        infoWindowRef.current = new google.maps.InfoWindow()

        // Add markers using AdvancedMarkerElement
        validListings.forEach((listing) => {
          if (typeof listing.lat !== 'number' || typeof listing.lng !== 'number') return

          // Create marker content (pin)
          const pinElement = new google.maps.marker.PinElement({
            background: '#2563eb',
            borderColor: '#1e40af',
            glyphColor: '#ffffff',
          })

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: listing.lat, lng: listing.lng },
            map: mapInstance,
            title: listing.title,
            content: pinElement.element,
          })

          // Add click listener
          marker.addListener('click', () => {
            const formattedPrice = new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: listing.currency,
              maximumFractionDigits: 0,
            }).format(listing.price)

            const content = `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #111;">
                  ${listing.title}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #2563eb;">
                  ${formattedPrice} ${listing.type === 'rent' ? '/ month' : ''}
                </p>
                <a 
                  href="/listing/${listing.slug}" 
                  style="display: inline-block; padding: 6px 12px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;"
                >
                  View Details
                </a>
              </div>
            `

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(content)
              infoWindowRef.current.open(mapInstance, marker)
            }
          })

          markersRef.current.push(marker)
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing map:', error)
        setIsLoading(false)
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null
      })
      markersRef.current = []
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
      }
    }
  }, [validListings, apiKey])

  if (validListings.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-6">
        <p className="text-sm text-gray-600 text-center">
          No properties with location data to display on map
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

