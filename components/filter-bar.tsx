'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LocationAutocomplete } from '@/components/location-autocomplete'
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
import { X, ChevronDown, Filter, Plus, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
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
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (type) params.set('type', type)
    if (city) params.set('city', city)
    if (radius) params.set('radius', radius)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minBeds) params.set('bedrooms', minBeds) // Use bedrooms for search service compatibility
    if (propertyType) params.set('propertyType', propertyType)
    if (keywords) params.set('keywords', keywords)
    
    router.push(`/search?${params.toString()}`)
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
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (minBeds) params.set('bedrooms', minBeds)
      if (propertyType) params.set('propertyType', propertyType)
      if (keywords) params.set('keywords', keywords)
      
      router.push(`/search?${params.toString()}`)
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
    <div className="w-full">
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide pb-2">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Property Type Dropdown */}
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 text-sm font-medium shadow-sm">
              <SelectValue>{getTypeLabel(type)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For sale</SelectItem>
              <SelectItem value="rent">To rent</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Input */}
        <div className="flex-1 min-w-[220px] relative">
          <div className="relative flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:border-gray-400 transition-colors">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter location or postcode"
              className="flex-1 h-10 pl-10 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {city && (
              <button
                type="button"
                onClick={clearLocation}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Radius Dropdown */}
        <Select value={radius || 'any'} onValueChange={(v) => setRadius(v === 'any' ? '' : v)}>
          <SelectTrigger className="h-10 w-[120px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
            <SelectValue placeholder="Radius">
              {radius ? `${radius}mi` : 'Radius'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any radius</SelectItem>
            <SelectItem value="0.5">0.5 miles</SelectItem>
            <SelectItem value="1">1 mile</SelectItem>
            <SelectItem value="2">2 miles</SelectItem>
            <SelectItem value="5">5 miles</SelectItem>
            <SelectItem value="10">10 miles</SelectItem>
            <SelectItem value="20">20 miles</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 flex-shrink-0"></div>

        {/* Price Range - Dynamic based on type */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={minPrice || 'no-min'} onValueChange={(v) => setMinPrice(v === 'no-min' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
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
          <span className="text-gray-500 text-sm font-medium">to</span>
          <Select value={maxPrice || 'no-max'} onValueChange={(v) => setMaxPrice(v === 'no-max' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
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
        <div className="h-6 w-px bg-gray-300 flex-shrink-0"></div>

        {/* Bedrooms Range */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={minBeds || 'any'} onValueChange={(v) => setMinBeds(v === 'any' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
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
          <span className="text-gray-500 text-sm font-medium">to</span>
          <Select value={maxBeds || 'any'} onValueChange={(v) => setMaxBeds(v === 'any' ? '' : v)}>
            <SelectTrigger className="h-10 w-[110px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
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
        <div className="h-6 w-px bg-gray-300 flex-shrink-0"></div>

        {/* Property Type */}
        <Select value={propertyType || 'all'} onValueChange={(v) => setPropertyType(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-10 w-[130px] bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm shadow-sm">
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
              variant="outline"
              className="h-10 px-4 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm font-medium shadow-sm flex-shrink-0"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              More Filters
              <ChevronDown className="h-4 w-4 ml-1" />
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

