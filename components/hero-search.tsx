'use client'

import { Button } from '@/components/ui/button'
import { LocationAutocomplete } from '@/components/location-autocomplete'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function HeroSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [city, setCity] = useState('')
  const [selectedTab, setSelectedTab] = useState<'buy' | 'rent' | 'sell'>('buy')

  // Initialize tab and city from URL params
  useEffect(() => {
    const type = searchParams.get('type')
    const cityParam = searchParams.get('city')
    
    if (type === 'rent') {
      setSelectedTab('rent')
    } else if (type === 'sale') {
      setSelectedTab('buy')
    } else {
      setSelectedTab('buy')
    }
    
    if (cityParam) {
      setCity(cityParam)
    }
  }, [searchParams])

  const handleTabClick = (tab: 'buy' | 'rent' | 'sell') => {
    // Only update the selected tab state, don't navigate
    setSelectedTab(tab)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    // Add location if provided
    if (city) {
      params.set('city', city)
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
              ? 'text-gray-600'
              : 'text-gray-900 hover:text-gray-600'
          )}
        >
          Sell My Home
          {selectedTab === 'sell' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('buy')}
          className={cn(
            'pb-3 px-2 sm:px-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            selectedTab === 'buy'
              ? 'text-gray-600'
              : 'text-gray-900 hover:text-gray-600'
          )}
        >
          Buy A Home
          {selectedTab === 'buy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabClick('rent')}
          className={cn(
            'pb-3 px-2 sm:px-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
            selectedTab === 'rent'
              ? 'text-gray-600'
              : 'text-gray-900 hover:text-gray-600'
          )}
        >
          Rent A Home
          {selectedTab === 'rent' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></span>
          )}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1">
            <LocationAutocomplete
              id="city"
              value={city}
              onChange={setCity}
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

