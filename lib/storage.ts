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

// Re-export for convenience (but client components should import from storage-utils.ts)
export { getPublicUrlSync } from './storage-utils'

export class StorageService {
  private bucket = 'media'

  /**
   * Ensure the bucket exists, create if it doesn't
   */
  private async ensureBucket() {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      // Continue anyway - bucket might exist but we can't list it
      return
    }

    const bucketExists = buckets?.some((b) => b.name === this.bucket)
    
    if (!bucketExists) {
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket(this.bucket, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        throw new Error(
          `Storage bucket '${this.bucket}' does not exist and could not be created. ` +
          `Please create it manually in your Supabase dashboard: ` +
          `Storage > New bucket > Name: ${this.bucket} > Public: Yes`
        )
      }
    }
  }

  /**
   * Upload a file to Supabase Storage
   */
  async upload(
    file: Buffer | ArrayBuffer,
    key: string,
    options: UploadOptions = {}
  ): Promise<{ key: string; url: string }> {
    const { contentType = 'image/jpeg', cacheControl = 'public, max-age=31536000' } = options

    // Ensure bucket exists before uploading
    await this.ensureBucket()

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

