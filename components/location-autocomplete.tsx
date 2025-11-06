'use client'

import { useState, useEffect, useRef } from 'react'
import type { MouseEvent, FocusEvent } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutocompleteResult {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface LocationSelection {
  placeId?: string
  mainText: string
  secondaryText?: string
  description: string
  lat?: number
  lng?: number
  radiusKm?: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onLocationSelect?: (selection: LocationSelection | undefined) => void
  placeholder?: string
  className?: string
  id?: string
  rightButton?: React.ReactNode
}

export function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Enter city or postcode',
  className,
  id = 'location',
  rightButton,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isResolvingSelection, setIsResolvingSelection] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    // Use click instead of mousedown to allow button clicks to register first
    if (showSuggestions) {
      // Delay to allow click events to process first
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [showSuggestions])

  const fetchSuggestions = async (input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      // For short queries, use more permissive types to get more results
      // For longer queries, use geocode to get more specific results
      const queryLength = input.trim().length
      const types = queryLength <= 3 ? undefined : 'geocode' // Remove type restriction for short queries to get more results
      
      const params = new URLSearchParams({
        action: 'autocomplete',
        input,
        components: 'country:gb', // Restrict to United Kingdom
      })
      
      if (types) {
        params.set('types', types)
      }

      const response = await fetch(`/api/places?${params}`)
      if (!response.ok) throw new Error('Failed to fetch suggestions')

      const data = await response.json()
      const results = data.results || []
      
      // Display all results (Google API naturally returns fewer as query narrows)
      // Minimum target: 10 for short queries, fewer as it narrows
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Autocomplete error:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    onLocationSelect?.(undefined)

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const estimateRadiusFromViewport = (viewport: {
    northeast?: { lat: number; lng: number }
    southwest?: { lat: number; lng: number }
  }) => {
    if (!viewport?.northeast || !viewport?.southwest) return undefined

    const toRadians = (deg: number) => (deg * Math.PI) / 180
    const { northeast, southwest } = viewport
    const earthRadiusKm = 6371

    const dLat = toRadians(northeast.lat - southwest.lat)
    const dLng = toRadians(northeast.lng - southwest.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(southwest.lat)) *
        Math.cos(toRadians(northeast.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const diagonal = earthRadiusKm * c

    // Approximate radius as half the diagonal of the viewport
    if (!Number.isFinite(diagonal) || isNaN(diagonal)) return undefined
    return Math.max(1, Math.round((diagonal / 2) * 10) / 10)
  }

  const handleSelectSuggestion = async (
    suggestion: AutocompleteResult,
    e?: React.MouseEvent
  ) => {
    e?.preventDefault()
    e?.stopPropagation()
    const mainText = suggestion.structured_formatting.main_text
    onChange(mainText)
    onLocationSelect?.({
      placeId: suggestion.place_id,
      mainText,
      secondaryText: suggestion.structured_formatting.secondary_text,
      description: suggestion.description,
    })
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.blur()
    if (onLocationSelect) {
      setIsResolvingSelection(true)
      try {
        const response = await fetch(
          `/api/places?action=details&placeId=${encodeURIComponent(
            suggestion.place_id
          )}`
        )

        if (response.ok) {
          const data = await response.json()
          const location = data?.result?.geometry?.location
          const viewport = data?.result?.geometry?.viewport
          const lat =
            typeof location?.lat === 'number' ? location.lat : undefined
          const lng =
            typeof location?.lng === 'number' ? location.lng : undefined
          const radiusKm = estimateRadiusFromViewport(viewport ?? {})

          onLocationSelect({
            placeId: suggestion.place_id,
            mainText,
            secondaryText: suggestion.structured_formatting.secondary_text,
            description: suggestion.description,
            lat,
            lng,
            radiusKm,
          })
        } else {
          console.error('Failed to fetch place details')
        }
      } catch (error) {
        console.error('Place details error:', error)
      } finally {
        setIsResolvingSelection(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev: number) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev: number) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={cn("relative flex items-center border border-input overflow-hidden", className)}>
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            // Delay to allow click events on suggestions to register
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setShowSuggestions(false)
              }
            }, 200)
          }}
          placeholder={placeholder}
          className={cn('pl-10 h-12 text-gray-900 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0', rightButton ? '' : 'pr-3')}
          autoComplete="off"
        />
        {(isLoading || isResolvingSelection) && (
          <Loader2 className="absolute right-14 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin z-20" />
        )}
        {rightButton && (
          <div className="flex-shrink-0">
            {rightButton}
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((suggestion: AutocompleteResult, index: number) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={(e: MouseEvent<HTMLButtonElement>) => handleSelectSuggestion(suggestion, e)}
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()} // Prevent input blur
              className={cn(
                'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                index === selectedIndex && 'bg-gray-50'
              )}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  {suggestion.structured_formatting.secondary_text && (
                    <div className="text-sm text-gray-500 truncate">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

