'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'
import { PostcodeLookup } from '@/components/postcode-lookup'
import type { UKAddress } from '@/lib/postcode-lookup'

interface ValuationFormProps {
  initialPostcode?: string
}

export function ValuationForm({ initialPostcode = '' }: ValuationFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)
  const [postcode, setPostcode] = useState(initialPostcode)
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')

  const handleAddressSelect = (address: UKAddress) => {
    setPostcode(address.postcode)
    setAddressLine1(address.line_1)
    setAddressLine2([address.line_2, address.line_3].filter(Boolean).join(', '))
    setCity(address.town_or_city)
    setCounty(address.county)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Build full address string
    const addressParts = [
      addressLine1,
      addressLine2,
      city,
      county,
      postcode
    ].filter(Boolean)
    const fullAddress = addressParts.join(', ')
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      postcode: postcode,
      address: fullAddress,
      message: formData.get('message') as string,
      turnstileToken: turnstileToken || '',
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSuccess(true)
      e.currentTarget.reset()
      if (turnstileRef.current) {
        turnstileRef.current.reset()
      }
      setTurnstileToken(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          We've received your valuation request. Our team will contact you within 24 hours to arrange a convenient time for your free property valuation.
        </p>
        <Button
          onClick={() => {
            setSuccess(false)
            setError(null)
          }}
          variant="outline"
        >
          Request Another Valuation
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Request Your Free Valuation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="John Smith"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            placeholder="john@example.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            placeholder="+44 7700 900000"
            className="mt-1"
          />
        </div>
        {/* Postcode Lookup */}
        <PostcodeLookup 
          onAddressSelect={handleAddressSelect}
          initialPostcode={initialPostcode}
        />

        {/* Address Fields (auto-filled from lookup) */}
        <div>
          <Label htmlFor="address-line-1">Address Line 1 *</Label>
          <Input
            id="address-line-1"
            name="addressLine1"
            required
            value={addressLine1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressLine1(e.target.value)}
            placeholder="House number and street"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="address-line-2">Address Line 2</Label>
          <Input
            id="address-line-2"
            name="addressLine2"
            value={addressLine2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressLine2(e.target.value)}
            placeholder="Area or district"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Town/City *</Label>
            <Input
              id="city"
              name="city"
              required
              value={city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              placeholder="London"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              name="county"
              value={county}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCounty(e.target.value)}
              placeholder="Greater London"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Property Details</Label>
          <Textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Any additional details (e.g., number of bedrooms, property type, parking, garden)..."
            className="mt-1"
          />
        </div>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div>
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
        >
          {loading ? 'Submitting...' : 'Get My Free Valuation'}
        </Button>
        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to be contacted by our team regarding your property valuation.
        </p>
      </form>
    </div>
  )
}

