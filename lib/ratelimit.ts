import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'
import { env } from './env'

// Simple in-memory rate limiter fallback
class SimpleRateLimiter {
  private counts = new Map<string, { count: number; resetTime: number }>()
  private limit: number
  private windowMs: number

  constructor(limit: number, window: string) {
    this.limit = limit
    // Parse window string like "1 m" to milliseconds
    const [num, unit] = window.split(' ')
    const multiplier = unit === 's' ? 1000 : unit === 'm' ? 60000 : unit === 'h' ? 3600000 : 1000
    this.windowMs = parseInt(num) * multiplier
  }

  async limit(identifier: string) {
    const now = Date.now()
    const record = this.counts.get(identifier)

    if (!record || now > record.resetTime) {
      this.counts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: now + this.windowMs }
    }

    if (record.count >= this.limit) {
      return { success: false, limit: this.limit, remaining: 0, reset: record.resetTime }
    }

    record.count++
    return { success: true, limit: this.limit, remaining: this.limit - record.count, reset: record.resetTime }
  }
}

// Create rate limiters - use Upstash if available, otherwise use simple in-memory
const useUpstash = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN

// Rate limiter for read APIs (search)
export const readLimiter = useUpstash
  ? new Ratelimit({
      redis: redis as any,
      limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
      analytics: true,
    })
  : (new SimpleRateLimiter(100, '1 m') as any)

// Rate limiter for write APIs (leads)
export const writeLimiter = useUpstash
  ? new Ratelimit({
      redis: redis as any,
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
      analytics: true,
    })
  : (new SimpleRateLimiter(10, '1 m') as any)

