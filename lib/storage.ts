import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

export interface UploadOptions {
  contentType?: string
  cacheControl?: string
}

export interface MediaItem {
  key: string
  width?: number
  height?: number
  alt?: string
}

export class StorageService {
  private bucket = 'media'

  /**
   * Upload a file to Supabase Storage
   */
  async upload(
    file: Buffer | ArrayBuffer,
    key: string,
    options: UploadOptions = {}
  ): Promise<{ key: string; url: string }> {
    const { contentType = 'image/jpeg', cacheControl = 'public, max-age=31536000' } = options

    const { error } = await supabase.storage
      .from(this.bucket)
      .upload(key, file, {
        contentType,
        cacheControl,
        upsert: true,
      })

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`)
    }

    const url = await this.publicUrl(key)
    return { key, url }
  }

  /**
   * Get public URL for a file (can be swapped to S3/CDN later)
   */
  async publicUrl(key: string, options?: { width?: number; height?: number }): Promise<string> {
    const { data } = supabase.storage.from(this.bucket).getPublicUrl(key)

    // In production, you might want to transform this URL through a CDN
    // or image optimization service
    let url = data.publicUrl

    // If dimensions are provided, you could append query params for resizing
    // (requires Supabase Storage transforms or external service)
    if (options?.width || options?.height) {
      // For now, return as-is; implement transformation service later
    }

    return url
  }

  /**
   * Delete a file
   */
  async delete(key: string): Promise<void> {
    const { error } = await supabase.storage.from(this.bucket).remove([key])
    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`)
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return
    const { error } = await supabase.storage.from(this.bucket).remove(keys)
    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`)
    }
  }
}

export const storage = new StorageService()

