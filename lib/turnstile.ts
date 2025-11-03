import { env } from './env'

/**
 * Verify Cloudflare Turnstile token server-side
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    // If Turnstile is not configured, skip verification (development)
    return true
  }

  if (!token) {
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

