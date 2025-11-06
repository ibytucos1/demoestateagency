'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectUrl = searchParams.get('redirect_url') || '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign-in error:', error)
        setError(error.message || 'Invalid email or password')
        setLoading(false)
        return
      }

      if (!data.session) {
        console.error('No session created after sign-in')
        setError('Failed to create session. Please try again.')
        setLoading(false)
        return
      }

      console.log('Sign-in successful, session created:', !!data.session)

      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 200))

      // Verify session is set
      const { data: { session: verifySession } } = await supabase.auth.getSession()
      if (!verifySession) {
        console.error('Session not found after sign-in')
        setError('Session not created. Please try again.')
        setLoading(false)
        return
      }

      // Try to create user record if it doesn't exist
      try {
        const createUserResponse = await fetch('/api/users/create', {
          method: 'POST',
          cache: 'no-store',
        })
        const createUserData = await createUserResponse.json()
        if (createUserData.success) {
          console.log('User record created/verified:', createUserData.user)
          // Wait longer to ensure database transaction is committed and server picks it up
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          console.warn('Could not create user record:', createUserData.error)
        }
      } catch (err) {
        console.warn('Error creating user record:', err)
        // Continue anyway - user might already exist
      }

      // Force a full page reload to ensure server components refresh
      window.location.replace(redirectUrl)
    } catch (err: any) {
      console.error('Unexpected sign-in error:', err)
      setError(err?.message || 'An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 p-8">
        <div>
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to access the admin panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <a href="/sign-up" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

