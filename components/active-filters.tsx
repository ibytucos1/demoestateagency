'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActiveFiltersProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function ActiveFilters({ searchParams }: ActiveFiltersProps) {
  const router = useRouter()
  const activeFilters: Array<{ key: string; label: string; value: string }> = []

  // Build active filters array
  if (searchParams.city) {
    activeFilters.push({
      key: 'city',
      label: 'Location',
      value: String(searchParams.city),
    })
  }

  if (searchParams.type) {
    const typeLabels: Record<string, string> = {
      sale: 'For Sale',
      rent: 'To Rent',
      commercial: 'Commercial',
    }
    activeFilters.push({
      key: 'type',
      label: 'Type',
      value: typeLabels[String(searchParams.type)] || String(searchParams.type),
    })
  }

  if (searchParams.minPrice) {
    const minPrice = Number(searchParams.minPrice)
    activeFilters.push({
      key: 'minPrice',
      label: 'Min Price',
      value: `£${minPrice >= 1000 ? (minPrice / 1000).toFixed(0) + 'k' : minPrice.toLocaleString()}`,
    })
  }

  if (searchParams.maxPrice) {
    const maxPrice = Number(searchParams.maxPrice)
    activeFilters.push({
      key: 'maxPrice',
      label: 'Max Price',
      value: `£${maxPrice >= 1000 ? (maxPrice / 1000).toFixed(0) + 'k' : maxPrice.toLocaleString()}`,
    })
  }

  if (searchParams.bedrooms) {
    activeFilters.push({
      key: 'bedrooms',
      label: 'Bedrooms',
      value: `${searchParams.bedrooms}+`,
    })
  }

  if (searchParams.propertyType) {
    activeFilters.push({
      key: 'propertyType',
      label: 'Property Type',
      value: String(searchParams.propertyType).charAt(0).toUpperCase() + String(searchParams.propertyType).slice(1),
    })
  }

  if (activeFilters.length === 0) {
    return null
  }

  const removeFilter = (keyToRemove: string) => {
    const params = new URLSearchParams()
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== keyToRemove && key !== 'cursor') {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)))
        } else {
          params.set(key, String(value))
        }
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push('/search')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => removeFilter(filter.key)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5',
            'bg-primary/10 text-primary rounded-full text-sm font-medium',
            'hover:bg-primary/20 transition-colors',
            'border border-primary/20'
          )}
        >
          <span>{filter.label}: {filter.value}</span>
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-600 hover:text-primary font-medium transition-colors underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

