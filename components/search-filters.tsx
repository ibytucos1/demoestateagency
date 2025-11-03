'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 5000000,
    bedrooms: searchParams.get('bedrooms') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice < 5000000) params.set('maxPrice', String(filters.maxPrice))
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
    if (filters.type) params.set('type', filters.type)
    if (filters.city) params.set('city', filters.city)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg">Filters</h3>

      {/* City Search */}
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Search city..."
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
      </div>

      {/* Property Type */}
      <div>
        <Label>Type</Label>
        <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div>
        <Label>Bedrooms</Label>
        <Select value={filters.bedrooms} onValueChange={(v) => handleFilterChange('bedrooms', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label>Price Range</Label>
        <div className="space-y-4 pt-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              handleFilterChange('minPrice', min)
              handleFilterChange('maxPrice', max)
            }}
            min={0}
            max={5000000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.minPrice.toLocaleString()}</span>
            <span>${filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}

