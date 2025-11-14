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
    bedrooms?: number | null
    bathrooms?: number | null
    propertyType?: string | null
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
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  // Filter listings with valid coordinates
  const validListings = useMemo(
    () => listings.filter((listing) => typeof listing.lat === 'number' && typeof listing.lng === 'number'),
    [listings],
  )

  // Check for API key
  useEffect(() => {
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ Google Maps API key is missing!')
      setError('Maps configuration error: API key not found')
      setIsLoading(false)
    }
    
    // Listen for Google Maps API errors
    const handleGoogleMapsError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || ''
      if (message.includes('referernotallowedmaperror')) {
        console.error('❌ Google Maps RefererNotAllowedMapError detected')
        setError('API key not authorized for this domain')
        setIsLoading(false)
      } else if (message.includes('invalidkeymaperror')) {
        console.error('❌ Google Maps InvalidKeyMapError detected')
        setError('Invalid Google Maps API key')
        setIsLoading(false)
      } else if (message.includes('apinotactivatedmaperror')) {
        console.error('❌ Google Maps ApiNotActivatedMapError detected')
        setError('Google Maps API not activated')
        setIsLoading(false)
      }
    }
    
    window.addEventListener('error', handleGoogleMapsError)
    return () => window.removeEventListener('error', handleGoogleMapsError)
  }, [apiKey])

  useEffect(() => {
    if (!mapRef.current || validListings.length === 0 || !apiKey) {
      setIsLoading(false)
      return
    }

    console.log('🗺️ Initializing map with', validListings.length, 'properties')

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
        script.onerror = (e) => {
          isGoogleMapsLoading = false
          googleMapsLoadPromise = null
          console.error('❌ Failed to load Google Maps script:', e)
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
        console.log('✅ Map initialized successfully')
      } catch (error) {
        console.error('❌ Error initializing map:', error)
        
        // Detect specific error types
        if (error instanceof Error) {
          if (error.message.includes('RefererNotAllowedMapError')) {
            setError('API key not authorized for this domain')
          } else if (error.message.includes('ApiNotActivatedMapError')) {
            setError('Google Maps API not activated')
          } else if (error.message.includes('InvalidKeyMapError')) {
            setError('Invalid Google Maps API key')
          } else {
            setError('Failed to load map')
          }
        }
        
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

  // Show error state
  if (error) {
    return (
      <div className="w-full h-[400px] rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-red-700 mb-2">
            {error}
          </p>
          <p className="text-xs text-red-600 mb-4">
            Please check the Google Maps API key configuration in Google Cloud Console
          </p>
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Configure API Key →
          </a>
        </div>
      </div>
    )
  }

  if (validListings.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">
            No location data available
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Properties need latitude and longitude coordinates
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="absolute inset-0 h-12 w-12 animate-ping text-primary/20">
                <Loader2 className="h-12 w-12" />
              </div>
            </div>
            <p className="text-base font-medium text-gray-700">Loading map...</p>
            <p className="text-xs text-gray-500">Preparing {validListings.length} location{validListings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

