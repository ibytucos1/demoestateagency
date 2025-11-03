import { Redis } from '@upstash/redis'
import { env } from './env'

// Fallback to in-memory cache if Upstash not configured
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)
    if (!item) return null
    if (item.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }
    return item.value as T
  }

  async setex(key: string, seconds: number, value: any): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + seconds * 1000,
    })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }
}

export const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : (new MemoryCache() as any)

