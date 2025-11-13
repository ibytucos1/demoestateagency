'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'
import { Send } from 'lucide-react'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      source: 'contact',
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
          We've received your message. Our team will get back to you within 24 hours.
        </p>
        <Button
          onClick={() => {
            setSuccess(false)
            setError(null)
          }}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-semibold">Name *</Label>
        <Input 
          id="name" 
          name="name"
          type="text" 
          placeholder="Your name" 
          required 
          className="mt-2 h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-base font-semibold">Email *</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="your.email@example.com" 
          required 
          className="mt-2 h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-base font-semibold">Phone</Label>
        <Input 
          id="phone" 
          name="phone"
          type="tel" 
          placeholder="Your phone number" 
          className="mt-2 h-12"
        />
      </div>
      
      <div>
        <Label htmlFor="message" className="text-base font-semibold">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help..."
          rows={6}
          required
          className="mt-2"
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
        className="w-full h-12 text-lg" 
        size="lg"
        loading={loading}
        disabled={!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken}
      >
        {!loading && <Send className="mr-2 h-5 w-5" />}
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}

