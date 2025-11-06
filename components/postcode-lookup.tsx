'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { lookupPostcode, formatAddressDisplay, type UKAddress } from '@/lib/postcode-lookup'

interface PostcodeLookupProps {
  onAddressSelect: (address: UKAddress) => void
  initialPostcode?: string
}

export function PostcodeLookup({ onAddressSelect, initialPostcode = '' }: PostcodeLookupProps) {
  const [postcode, setPostcode] = useState(initialPostcode)
  const [addresses, setAddresses] = useState<UKAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleLookup = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode')
      return
    }

    setLoading(true)
    setError(null)
    setAddresses([])
    setSelectedAddress('')
    setHasSearched(true)

    try {
      const results = await lookupPostcode(postcode)
      
      if (results.length === 0) {
        setError('No addresses found for this postcode. Please enter your address manually below.')
      } else {
        setAddresses(results)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup postcode'
      setError(errorMessage)
      console.error('Postcode lookup error:', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (value: string) => {
    setSelectedAddress(value)
    const address = addresses[parseInt(value)]
    if (address) {
      onAddressSelect(address)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLookup()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postcode-lookup">Property Postcode *</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="postcode-lookup"
            type="text"
            value={postcode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostcode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="SW1A 1AA"
            className="flex-1 uppercase text-gray-900"
            disabled={loading}
          />
          <Button
            type="button"
            onClick={handleLookup}
            disabled={loading || !postcode.trim()}
            className="flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Find Address</span>
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>

      {hasSearched && addresses.length > 0 && (
        <div>
          <Label htmlFor="address-select">Select Your Address *</Label>
          <select
            id="address-select"
            value={selectedAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full mt-1 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">-- Select an address --</option>
            {addresses.map((address, index) => (
              <option key={index} value={index.toString()}>
                {formatAddressDisplay(address)}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasSearched && addresses.length === 0 && !loading && !error && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p>Can't find your address? You can enter it manually below.</p>
        </div>
      )}
    </div>
  )
}

