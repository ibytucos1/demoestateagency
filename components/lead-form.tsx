'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'

interface LeadFormProps {
  listingId: string
  listingTitle: string
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
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-green-600">
            Thank you! We'll get back to you soon.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquire About This Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" name="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" name="phone" />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" name="message" required rows={4} />
          </div>
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div>
              <Turnstile
                ref={turnstileRef}
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}>
            {loading ? 'Sending...' : 'Send Enquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

