import { Redis } from '@upstash/redis'
import { env } from './env'

// Fallback to in-memory cache if Upstash not configured
// This implements a minimal Redis-like interface for rate limiting
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>()
  private scripts = new Map<string, string>()

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

  async scriptLoad(script: string): Promise<string> {
    // Generate a simple hash-like ID for the script
    const scriptId = `script_${Buffer.from(script).toString('base64').slice(0, 16)}`
    this.scripts.set(scriptId, script)
    return scriptId
  }

  async evalsha(scriptId: string, keys: string[], args: any[]): Promise<any> {
    // For rate limiting, we'll use a simple in-memory counter approach
    // This is a simplified implementation - for production, use real Redis
    const key = keys[0] || `ratelimit:${scriptId}`
    const limit = args[0] || 100
    const window = args[1] || 60
    
    const current = await this.get<number>(key) || 0
    if (current >= limit) {
      return [0, 0, 0] // blocked
    }
    
    await this.setex(key, window, current + 1)
    return [1, limit - current - 1, window] // allowed, remaining, reset
  }

  async eval(script: string, keys: string[], args: any[]): Promise<any> {
    const scriptId = await this.scriptLoad(script)
    return this.evalsha(scriptId, keys, args)
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    return Promise.all(keys.map(key => this.get<string>(key)))
  }

  async psetex(key: string, milliseconds: number, value: any): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + milliseconds,
    })
  }
}

export const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : (new MemoryCache() as any)

