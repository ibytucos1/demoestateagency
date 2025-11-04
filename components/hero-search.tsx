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
  const [selectedTab, setSelectedTab] = useState<'buy' | 'rent' | 'sell' | 'commercial'>('buy')

  // Initialize tab and city from URL params
  useEffect(() => {
    const type = searchParams.get('type')
    const cityParam = searchParams.get('city')
    
    if (type === 'rent') {
      setSelectedTab('rent')
    } else if (type === 'sale') {
      setSelectedTab('buy')
    } else if (type === 'commercial') {
      setSelectedTab('commercial')
    } else {
      setSelectedTab('buy')
    }
    
    if (cityParam) {
      setCity(cityParam)
    }
  }, [searchParams])

  const handleTabClick = (tab: 'buy' | 'rent' | 'sell' | 'commercial') => {
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
    } else if (selectedTab === 'commercial') {
      params.set('type', 'commercial')
    }
    // 'sell' tab doesn't add a type parameter
    
    // Navigate to search page with both location and type
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabClick('sell')}
          className={cn(
            'pb-3 px-1 text-base font-medium transition-colors relative',
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
            'pb-3 px-1 text-base font-medium transition-colors relative',
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
            'pb-3 px-1 text-base font-medium transition-colors relative',
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
        <button
          type="button"
          onClick={() => handleTabClick('commercial')}
          className={cn(
            'pb-3 px-1 text-base font-medium transition-colors relative',
            selectedTab === 'commercial'
              ? 'text-gray-600'
              : 'text-gray-900 hover:text-gray-600'
          )}
        >
          Commercial Properties
          {selectedTab === 'commercial' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></span>
          )}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <LocationAutocomplete
          id="city"
          value={city}
          onChange={setCity}
          placeholder="Enter city or postcode"
          className="pr-0"
          rightButton={
            <Button 
              type="submit" 
              className="h-12 px-4 rounded-r-md rounded-l-none flex-shrink-0"
            >
              <Search className="h-5 w-5" />
            </Button>
          }
        />
      </form>
    </div>
  )
}

