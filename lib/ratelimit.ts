import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Rate limiter for read APIs (search)
export const readLimiter = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
})

// Rate limiter for write APIs (leads)
export const writeLimiter = new Ratelimit({
  redis: redis as any,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
})

