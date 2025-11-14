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
  const [sellPostcode, setSellPostcode] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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
    setIsSearching(true)
    
    try {
      // If "Sell My Home" tab is selected, redirect to valuation page
      if (selectedTab === 'sell') {
        const trimmedPostcode = sellPostcode.trim()
        if (trimmedPostcode) {
          router.push(`/valuation?postcode=${encodeURIComponent(trimmedPostcode)}`)
        } else {
          router.push('/valuation')
        }
        return
      }
      
      // Otherwise, handle regular property search
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
      
      // Navigate to search page with both location and type
      router.push(`/search?${params.toString()}`)
    } finally {
      // Reset searching state after a delay to allow navigation to complete
      setTimeout(() => setIsSearching(false), 1000)
    }
  }

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between w-full mb-4 sm:mb-6 border-b border-white/30">
        <button
          type="button"
          onClick={() => handleTabClick('sell')}
          className={cn(
            'pb-3 px-2 text-xs sm:text-base font-medium transition-colors relative flex-1 text-center',
            selectedTab === 'sell'
              ? 'text-primary font-semibold'
              : 'text-white hover:text-primary'
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
            'pb-3 px-2 text-xs sm:text-base font-medium transition-colors relative flex-1 text-center',
            selectedTab === 'buy'
              ? 'text-primary font-semibold'
              : 'text-white hover:text-primary'
          )}
        >
          Buy
          {selectedTab === 'buy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('rent')}
          className={cn(
            'pb-3 px-2 text-xs sm:text-base font-medium transition-colors relative flex-1 text-center',
            selectedTab === 'rent'
              ? 'text-primary font-semibold'
              : 'text-white hover:text-primary'
          )}
        >
          Rent
          {selectedTab === 'rent' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
          )}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full">
        {selectedTab === 'sell' ? (
          <>
            {/* Sell My Home - Postcode Input */}
            {/* Mobile: Pill Design */}
            <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden sm:hidden">
              <input
                type="text"
                value={sellPostcode}
                onChange={(e) => setSellPostcode(e.target.value)}
                placeholder="What is the postcode of your home?"
                className="flex-1 h-12 px-5 bg-transparent border-0 focus:outline-none text-sm text-gray-900 placeholder:text-gray-500"
              />
              <Button 
                type="submit" 
                size="icon"
                className="h-9 w-9 rounded-full mr-1.5 flex-shrink-0"
                loading={isSearching}
              >
                {!isSearching && <Search className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Desktop: Original Side-by-Side */}
            <div className="hidden sm:flex sm:flex-row gap-0">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={sellPostcode}
                    onChange={(e) => setSellPostcode(e.target.value)}
                    placeholder="What is the postcode of your home?"
                    className="w-full h-12 px-4 border border-white/20 bg-white/80 backdrop-blur-sm rounded-r-none rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white text-base text-gray-900 placeholder:text-gray-500 transition-all"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="h-12 px-4 rounded-l-none rounded-r-md flex-shrink-0"
                loading={isSearching}
              >
                <span>Get Free Valuation</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Buy/Rent - Location Search */}
            {/* Mobile: Pill Design */}
            <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden sm:hidden">
              <LocationAutocomplete
                id="city"
                value={city}
                onChange={setCity}
                onLocationSelect={setSelectedLocation}
                placeholder="Enter city or postcode"
                className="flex-1 rounded-full border-0 bg-transparent"
                rightButton={
                  <Button 
                    type="submit" 
                    size="icon"
                    className="h-9 w-9 rounded-full mr-1.5 flex-shrink-0"
                    loading={isSearching}
                  >
                    {!isSearching && <Search className="h-4 w-4" />}
                  </Button>
                }
              />
            </div>
            
            {/* Desktop: Original Side-by-Side */}
            <div className="hidden sm:flex sm:flex-row gap-0">
              <div className="flex-1">
                <LocationAutocomplete
                  id="city"
                  value={city}
                  onChange={setCity}
                  onLocationSelect={setSelectedLocation}
                  placeholder="Enter city or postcode"
                  className="rounded-r-none rounded-l-md bg-white/80 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-4 rounded-l-none rounded-r-md flex-shrink-0"
                loading={isSearching}
              >
                {!isSearching && <Search className="h-5 w-5 mr-0" />}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

