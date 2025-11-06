import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { storage } from '@/lib/storage'
import { writeLimiter } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    // Rate limiting (with fallback for compatibility)
    try {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      if (writeLimiter && typeof writeLimiter.limit === 'function') {
        const result = await writeLimiter.limit(ip)
        if (!result.success) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }
      }
    } catch (rateLimitError) {
      // Rate limiting failed, but continue with upload (graceful degradation)
      console.warn('Rate limiting error:', rateLimitError)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'jpg'
    const key = `listings/${tenantId}/${timestamp}-${random}.${extension}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const result = await storage.upload(
      arrayBuffer,
      key,
      {
        contentType: file.type,
      }
    )

    // Get image dimensions (optional, can be done client-side)
    // For now, we'll return a basic media item structure
    const mediaItem = {
      key: result.key,
      url: result.url,
      width: null,
      height: null,
      alt: file.name,
    }

    return NextResponse.json({ media: mediaItem })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Redirecting to sign-in') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Return the actual error message for storage/bucket issues
      if (error.message.includes('Bucket') || error.message.includes('Storage')) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
    }
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

