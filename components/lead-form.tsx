'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'

interface LeadFormProps {
  listingId: string
  listingTitle: string
  tenantId?: string
}

export function LeadForm({ listingId, listingTitle }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      listingId,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      turnstileToken,
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit enquiry')
      }

      setSuccess(true)
      e.currentTarget.reset()
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      turnstileRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          We've received your enquiry and will get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form id="enquiry-form" onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2">Name *</Label>
        <Input 
          id="name" 
          name="name" 
          required 
          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
          placeholder="John Smith"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2">Email *</Label>
        <Input 
          id="email" 
          type="email" 
          name="email" 
          required 
          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2">Phone</Label>
        <Input 
          id="phone" 
          type="tel" 
          name="phone" 
          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
          placeholder="+44 20 1234 5678"
        />
      </div>
      <div>
        <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-2">Message *</Label>
        <Textarea 
          id="message" 
          name="message" 
          required 
          rows={4} 
          className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
          placeholder="I'm interested in this property..."
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" 
        disabled={loading || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Enquiry'
        )}
      </Button>
      <p className="text-xs text-center text-gray-500 mt-3">
        By submitting this form, you agree to be contacted about this property
      </p>
    </form>
  )
}

