'use client'

import { Button } from '@/components/ui/button'
import { LocationAutocomplete, type LocationSelection } from '@/components/location-autocomplete'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_RADIUS_KM = 25

export function HeroSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [city, setCity] = useState('')
  const [selectedTab, setSelectedTab] = useState<'buy' | 'rent' | 'sell'>('buy')
  const [selectedLocation, setSelectedLocation] = useState<LocationSelection | undefined>(undefined)

  // Initialize tab and city from URL params
  useEffect(() => {
    const type = searchParams.get('type')
    const cityParam = searchParams.get('city')
    const latParam = searchParams.get('lat')
    const lngParam = searchParams.get('lng')
    const radiusParam = searchParams.get('radius')
    
    if (type === 'rent') {
      setSelectedTab('rent')
    } else if (type === 'sale') {
      setSelectedTab('buy')
    } else {
      setSelectedTab('buy')
    }
    
    if (cityParam) {
      setCity(cityParam)
    } else {
      setCity('')
    }

    const parsedLat = latParam ? Number(latParam) : undefined
    const parsedLng = lngParam ? Number(lngParam) : undefined

    const parsedRadius = radiusParam ? Number(radiusParam) : undefined
    const sanitizedRadius =
      parsedRadius !== undefined && !Number.isNaN(parsedRadius)
        ? parsedRadius
        : undefined

    if (
      parsedLat !== undefined &&
      !Number.isNaN(parsedLat) &&
      parsedLng !== undefined &&
      !Number.isNaN(parsedLng)
    ) {
      setSelectedLocation((prev: LocationSelection | undefined) => {
        if (
          prev &&
          prev.lat === parsedLat &&
          prev.lng === parsedLng &&
          prev.mainText === (cityParam ?? '')
        ) {
          return prev
        }

        return {
          placeId: searchParams.get('placeId') ?? prev?.placeId,
          mainText: cityParam ?? '',
          description: cityParam ?? '',
          lat: parsedLat,
          lng: parsedLng,
          radiusKm: sanitizedRadius ?? prev?.radiusKm,
        }
      })
    } else {
      setSelectedLocation(undefined)
    }
  }, [searchParams])

  const handleTabClick = (tab: 'buy' | 'rent' | 'sell') => {
    // Only update the selected tab state, don't navigate
    setSelectedTab(tab)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    const trimmedCity = city.trim()
    
    // Add location if provided
    if (trimmedCity) {
      params.set('city', trimmedCity)
    }
    
    let lat = selectedLocation?.lat
    let lng = selectedLocation?.lng
    let radiusKm = selectedLocation?.radiusKm

    if (trimmedCity && (lat === undefined || lng === undefined)) {
      try {
        const geocodeResponse = await fetch(
          `/api/places?action=geocode&address=${encodeURIComponent(
            trimmedCity
          )}`
        )

        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json()
          const result = geocodeData?.result
          if (result?.lat && result?.lng) {
            lat = result.lat
            lng = result.lng
            radiusKm = radiusKm ?? DEFAULT_RADIUS_KM
          }
        }
      } catch (error) {
        console.error('Geocode error:', error)
      }
    }

    if (
      lat !== undefined &&
      !Number.isNaN(lat) &&
      lng !== undefined &&
      !Number.isNaN(lng)
    ) {
      params.set('lat', String(lat))
      params.set('lng', String(lng))
      params.set(
        'radius',
        String(radiusKm && radiusKm > 0 ? radiusKm : DEFAULT_RADIUS_KM)
      )
    }

    // Add type based on selected tab
    if (selectedTab === 'buy') {
      params.set('type', 'sale')
    } else if (selectedTab === 'rent') {
      params.set('type', 'rent')
    }
    // 'sell' tab doesn't add a type parameter
    
    // Navigate to search page with both location and type
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => handleTabClick('sell')}
          className={cn(
            'pb-3 px-2 sm:px-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            selectedTab === 'sell'
              ? 'text-primary font-semibold'
              : 'text-gray-700 hover:text-primary'
          )}
        >
          Sell My Home
          {selectedTab === 'sell' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('buy')}
          className={cn(
            'pb-3 px-2 sm:px-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            selectedTab === 'buy'
              ? 'text-primary font-semibold'
              : 'text-gray-700 hover:text-primary'
          )}
        >
          Buy A Home
          {selectedTab === 'buy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('rent')}
          className={cn(
            'pb-3 px-2 sm:px-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            selectedTab === 'rent'
              ? 'text-primary font-semibold'
              : 'text-gray-700 hover:text-primary'
          )}
        >
          Rent A Home
          {selectedTab === 'rent' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          )}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1">
            <LocationAutocomplete
              id="city"
              value={city}
              onChange={setCity}
              onLocationSelect={setSelectedLocation}
              placeholder="Enter city or postcode"
              className="rounded-md sm:rounded-r-none sm:rounded-l-md"
            />
          </div>
          <Button 
            type="submit" 
            className="h-12 px-6 sm:px-4 rounded-md sm:rounded-l-none sm:rounded-r-md flex-shrink-0 w-full sm:w-auto"
          >
            <Search className="h-5 w-5 mr-2 sm:mr-0" />
            <span className="sm:hidden">Search</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

