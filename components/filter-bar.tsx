'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { X, ChevronDown, Filter, Plus, MapPin, Loader2, Home, DollarSign, Bed, Building2, Search, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [type, setType] = useState<string>(searchParams.get('type') || '')
  const [city, setCity] = useState<string>(searchParams.get('city') || '')
  const [radius, setRadius] = useState<string>(searchParams.get('radius') || '')
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '')
  const [minBeds, setMinBeds] = useState<string>(searchParams.get('bedrooms') || searchParams.get('minBeds') || '')
  const [maxBeds, setMaxBeds] = useState<string>(searchParams.get('maxBeds') || '')
  const [propertyType, setPropertyType] = useState<string>(searchParams.get('propertyType') || '')
  const [keywords, setKeywords] = useState<string>(searchParams.get('keywords') || '')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [lat, setLat] = useState<string>(searchParams.get('lat') || '')
  const [lng, setLng] = useState<string>(searchParams.get('lng') || '')
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (type) params.set('type', type)
    if (city) params.set('city', city)
    if (radius) params.set('radius', radius)
    if (lat && lng) {
      params.set('lat', lat)
      params.set('lng', lng)
    }
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minBeds) params.set('bedrooms', minBeds) // Use bedrooms for search service compatibility
    if (propertyType) params.set('propertyType', propertyType)
    if (keywords) params.set('keywords', keywords)
    
    startTransition(() => {
    router.push(`/search?${params.toString()}`)
    })
  }

  // Auto-apply filters with debounce (except for initial load)
  useEffect(() => {
    // Skip on initial mount
    if (debounceTimerRef.current === undefined) {
      debounceTimerRef.current = null as any
      return
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce filter changes
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      
      // Only add type if it's explicitly set (not default)
      if (type && type !== 'sale') {
        params.set('type', type)
      } else if (searchParams.get('type')) {
        params.set('type', type)
      }
      if (city) params.set('city', city)
      if (radius) params.set('radius', radius)
      if (lat && lng) {
        params.set('lat', lat)
        params.set('lng', lng)
      }
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (minBeds) params.set('bedrooms', minBeds)
      if (propertyType) params.set('propertyType', propertyType)
      if (keywords) params.set('keywords', keywords)
      
      startTransition(() => {
      router.push(`/search?${params.toString()}`)
      })
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, city, radius, minPrice, maxPrice, minBeds, maxBeds, propertyType, keywords])

  // Reset price filters when type changes
  useEffect(() => {
    setMinPrice('')
    setMaxPrice('')
  }, [type])

  const clearLocation = () => {
    setCity('')
    setLat('')
    setLng('')
  }

  const clearAllFilters = () => {
    setType('')
    setCity('')
    setRadius('')
    setMinPrice('')
    setMaxPrice('')
    setMinBeds('')
    setMaxBeds('')
    setPropertyType('')
    setKeywords('')
    setLat('')
    setLng('')
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (type && type !== 'sale') count++
    if (city) count++
    if (radius) count++
    if (minPrice) count++
    if (maxPrice) count++
    if (minBeds) count++
    if (maxBeds) count++
    if (propertyType) count++
    if (keywords) count++
    return count
  }

  const getTypeLabel = (value: string) => {
    switch (value) {
      case 'sale': return 'For sale'
      case 'rent': return 'To rent'
      case 'commercial': return 'Commercial'
      default: return 'For sale'
    }
  }

  return (
    <div className="w-full relative">
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Updating results...</span>
          </div>
        </div>
      )}
      
      {/* Mobile Layout - Location + Filters Dropdown */}
      <div className="flex md:hidden items-center gap-2 py-2 px-0.5">
        {/* Location Input - Mobile */}
        <div className="flex-1 min-w-0 relative">
          <div className="relative flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-colors">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 z-10" />
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setLat('')
                setLng('')
              }}
              placeholder="Enter location"
              className="flex-1 h-10 pl-10 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            {city && (
              <button
                type="button"
                onClick={clearLocation}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-blue-600" />
              </button>
            )}
          </div>
        </div>

        {/* All Filters Dropdown - Mobile Only */}
        <Popover open={showMobileFilters} onOpenChange={setShowMobileFilters}>
          <PopoverTrigger asChild>
            <Button
              className="h-10 px-4 bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-sm font-medium shadow-sm flex-shrink-0 relative"
            >
              <Filter className="h-4 w-4 mr-1.5 text-white" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-screen max-w-md p-0" align="end" sideOffset={8}>
            <div className="flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-gray-900">Filters</h4>
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-5 py-4 space-y-5">
                {/* Property Status */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Property Status
                  </label>
                  <Select value={type || 'sale'} onValueChange={setType}>
                    <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                      <SelectValue>{getTypeLabel(type || 'sale')}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For sale</SelectItem>
                      <SelectItem value="rent">To rent</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Radius */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Search Radius
                  </label>
                  <Select value={radius || 'any'} onValueChange={(v: string) => setRadius(v === 'any' ? '' : v)}>
                    <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                      <SelectValue>
                        {radius ? `Within ${radius}km` : 'Any distance'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any distance</SelectItem>
                      <SelectItem value="1">Within 1 km</SelectItem>
                      <SelectItem value="5">Within 5 km</SelectItem>
                      <SelectItem value="10">Within 10 km</SelectItem>
                      <SelectItem value="25">Within 25 km</SelectItem>
                      <SelectItem value="50">Within 50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Min</p>
                      <Select value={minPrice || 'no-min'} onValueChange={(v: string) => setMinPrice(v === 'no-min' ? '' : v)}>
                        <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                          <SelectValue placeholder="No min">
                            {minPrice ? `£${Number(minPrice).toLocaleString()}` : 'No min'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-min">No min</SelectItem>
                          {type === 'rent' ? (
                            <>
                              <SelectItem value="500">£500</SelectItem>
                              <SelectItem value="750">£750</SelectItem>
                              <SelectItem value="1000">£1,000</SelectItem>
                              <SelectItem value="1500">£1,500</SelectItem>
                              <SelectItem value="2000">£2,000</SelectItem>
                              <SelectItem value="3000">£3,000</SelectItem>
                              <SelectItem value="5000">£5,000</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="50000">£50,000</SelectItem>
                              <SelectItem value="100000">£100,000</SelectItem>
                              <SelectItem value="200000">£200,000</SelectItem>
                              <SelectItem value="300000">£300,000</SelectItem>
                              <SelectItem value="500000">£500,000</SelectItem>
                              <SelectItem value="750000">£750,000</SelectItem>
                              <SelectItem value="1000000">£1,000,000</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Max</p>
                      <Select value={maxPrice || 'no-max'} onValueChange={(v: string) => setMaxPrice(v === 'no-max' ? '' : v)}>
                        <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                          <SelectValue placeholder="No max">
                            {maxPrice ? `£${Number(maxPrice).toLocaleString()}` : 'No max'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-max">No max</SelectItem>
                          {type === 'rent' ? (
                            <>
                              <SelectItem value="1000">£1,000</SelectItem>
                              <SelectItem value="1500">£1,500</SelectItem>
                              <SelectItem value="2000">£2,000</SelectItem>
                              <SelectItem value="3000">£3,000</SelectItem>
                              <SelectItem value="5000">£5,000</SelectItem>
                              <SelectItem value="7500">£7,500</SelectItem>
                              <SelectItem value="10000">£10,000</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="200000">£200,000</SelectItem>
                              <SelectItem value="300000">£300,000</SelectItem>
                              <SelectItem value="500000">£500,000</SelectItem>
                              <SelectItem value="750000">£750,000</SelectItem>
                              <SelectItem value="1000000">£1,000,000</SelectItem>
                              <SelectItem value="2000000">£2,000,000</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Min</p>
                      <Select value={minBeds || 'any'} onValueChange={(v: string) => setMinBeds(v === 'any' ? '' : v)}>
                        <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                          <SelectValue placeholder="Any">
                            {minBeds ? `${minBeds}+` : 'Any'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Max</p>
                      <Select value={maxBeds || 'any'} onValueChange={(v: string) => setMaxBeds(v === 'any' ? '' : v)}>
                        <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                          <SelectValue placeholder="Any">
                            {maxBeds ? maxBeds : 'Any'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Property Type
                  </label>
                  <Select value={propertyType || 'all'} onValueChange={(v: string) => setPropertyType(v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-full h-11 bg-white border-gray-300">
                      <SelectValue placeholder="All types">
                        {propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : 'All types'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="bungalow">Bungalow</SelectItem>
                      <SelectItem value="cottage">Cottage</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Keywords */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-gray-700">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., garden, parking, garage"
                    className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
                  />
                </div>
              </div>

              {/* Footer - Sticky Apply Button */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4">
                <Button
                  onClick={() => {
                    setShowMobileFilters(false)
                    applyFilters()
                  }}
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm"
                >
                  Show Results{getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop Layout - Full Filter Bar */}
      <div className="hidden md:flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide py-2 px-0.5">
        {/* Property Type Dropdown - Desktop */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-10 w-[110px] bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 text-sm font-medium shadow-sm transition-all rounded-lg">
              <SelectValue>{getTypeLabel(type)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For sale</SelectItem>
              <SelectItem value="rent">To rent</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Input - Desktop */}
        <div className="flex-1 min-w-[220px] relative">
          <div className="relative flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-colors">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 z-10" />
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setLat('')
                setLng('')
              }}
              placeholder="Enter location or postcode"
              className="flex-1 h-10 pl-10 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            {city && (
              <button
                type="button"
                onClick={clearLocation}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-50 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-blue-600" />
              </button>
            )}
          </div>
        </div>

        {/* Radius Dropdown */}
        <Select value={radius || 'any'} onValueChange={(v: string) => setRadius(v === 'any' ? '' : v)}>
          <SelectTrigger className="h-10 w-[120px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
            <SelectValue placeholder="Radius">
              {radius ? `${radius}km` : 'Radius'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any radius</SelectItem>
            <SelectItem value="1">1 km</SelectItem>
            <SelectItem value="5">5 km</SelectItem>
            <SelectItem value="10">10 km</SelectItem>
            <SelectItem value="25">25 km</SelectItem>
            <SelectItem value="50">50 km</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="h-6 w-px bg-blue-200 flex-shrink-0"></div>

        {/* Price Range - Dynamic based on type */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={minPrice || 'no-min'} onValueChange={(v: string) => setMinPrice(v === 'no-min' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
              <SelectValue placeholder="Min Price">Min Price</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-min">No min</SelectItem>
              {type === 'rent' ? (
                <>
                  <SelectItem value="500">£500</SelectItem>
                  <SelectItem value="750">£750</SelectItem>
                  <SelectItem value="1000">£1,000</SelectItem>
                  <SelectItem value="1500">£1,500</SelectItem>
                  <SelectItem value="2000">£2,000</SelectItem>
                  <SelectItem value="3000">£3,000</SelectItem>
                  <SelectItem value="5000">£5,000</SelectItem>
                  <SelectItem value="7500">£7,500</SelectItem>
                  <SelectItem value="10000">£10,000</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="50000">£50k</SelectItem>
                  <SelectItem value="100000">£100k</SelectItem>
                  <SelectItem value="200000">£200k</SelectItem>
                  <SelectItem value="300000">£300k</SelectItem>
                  <SelectItem value="500000">£500k</SelectItem>
                  <SelectItem value="750000">£750k</SelectItem>
                  <SelectItem value="1000000">£1M</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <span className="text-blue-600 text-sm font-medium">to</span>
          <Select value={maxPrice || 'no-max'} onValueChange={(v: string) => setMaxPrice(v === 'no-max' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
              <SelectValue placeholder="Max Price">Max Price</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-max">No max</SelectItem>
              {type === 'rent' ? (
                <>
                  <SelectItem value="1000">£1,000</SelectItem>
                  <SelectItem value="1500">£1,500</SelectItem>
                  <SelectItem value="2000">£2,000</SelectItem>
                  <SelectItem value="3000">£3,000</SelectItem>
                  <SelectItem value="5000">£5,000</SelectItem>
                  <SelectItem value="7500">£7,500</SelectItem>
                  <SelectItem value="10000">£10,000</SelectItem>
                  <SelectItem value="15000">£15,000</SelectItem>
                  <SelectItem value="20000">£20,000+</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="200000">£200k</SelectItem>
                  <SelectItem value="300000">£300k</SelectItem>
                  <SelectItem value="500000">£500k</SelectItem>
                  <SelectItem value="750000">£750k</SelectItem>
                  <SelectItem value="1000000">£1M</SelectItem>
                  <SelectItem value="2000000">£2M</SelectItem>
                  <SelectItem value="5000000">£5M+</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-blue-200 flex-shrink-0"></div>

        {/* Bedrooms Range */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={minBeds || 'any'} onValueChange={(v: string) => setMinBeds(v === 'any' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
              <SelectValue placeholder="Min Beds">Min Beds</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-blue-600 text-sm font-medium">to</span>
          <Select value={maxBeds || 'any'} onValueChange={(v: string) => setMaxBeds(v === 'any' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
              <SelectValue placeholder="Max Beds">Max Beds</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-blue-200 flex-shrink-0"></div>

        {/* Property Type */}
        <Select value={propertyType || 'all'} onValueChange={(v: string) => setPropertyType(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-10 w-[130px] bg-white text-gray-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm shadow-sm">
            <SelectValue placeholder="Type">Type</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="bungalow">Bungalow</SelectItem>
            <SelectItem value="cottage">Cottage</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>

        {/* More Filters Button */}
        <Popover open={showMoreFilters} onOpenChange={setShowMoreFilters}>
          <PopoverTrigger asChild>
            <Button
              className="h-10 px-4 bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-sm font-medium shadow-sm flex-shrink-0"
            >
              <Filter className="h-4 w-4 mr-1.5 text-blue-600" />
              More Filters
              <ChevronDown className="h-4 w-4 ml-1 text-blue-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Additional Filters</h4>
              
              {/* Keywords */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., garden, parking, garage"
                  className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Additional filters can go here */}
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    setShowMoreFilters(false)
                    applyFilters()
                  }}
                  className="flex-1"
                  size="sm"
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setKeywords('')
                    setShowMoreFilters(false)
                  }}
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Keywords Button (if keywords are set) */}
        {keywords && (
          <Button
            variant="outline"
            className="h-10 px-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-sm font-medium flex-shrink-0"
            onClick={() => setShowMoreFilters(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Keywords ({keywords.split(',').length})
          </Button>
        )}
      </div>
    </div>
  )
}

