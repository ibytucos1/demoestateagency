'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LocationAutocomplete } from '@/components/location-autocomplete'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function HeroSearch() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type && type !== 'all') params.set('type', type)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <LocationAutocomplete
          id="city"
          value={city}
          onChange={setCity}
          placeholder="Enter city or postcode"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Type
        </label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="For sale or rent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">For sale or rent</SelectItem>
            <SelectItem value="sale">For sale</SelectItem>
            <SelectItem value="rent">To rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full h-12 text-lg">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  )
}

