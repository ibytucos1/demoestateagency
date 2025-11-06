import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { writeLimiter } from '@/lib/ratelimit'
import { env } from '@/lib/env'
import { parse } from 'csv-parse/sync'
import { placesService } from '@/lib/places'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface CSVRow {
  title: string
  slug: string
  status?: string
  type: string
  price: string
  currency?: string
  bedrooms?: string
  bathrooms?: string
  propertyType?: string
  addressLine1: string
  city: string
  postcode?: string
  lat?: string
  lng?: string
  description: string
  features?: string
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    try {
      const { success } = await writeLimiter.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    } catch (rateLimitError) {
      console.warn('Rate limiting error (continuing):', rateLimitError)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV file' }, { status: 400 })
    }

    // Read and parse CSV
    const text = await file.text()
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: (value, context) => {
        // Trim whitespace from all values
        if (typeof value === 'string') {
          return value.trim()
        }
        return value
      },
    }) as CSVRow[]

    if (records.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Validate required columns
    const requiredColumns = ['title', 'slug', 'type', 'price', 'addressLine1', 'city', 'description']
    const headers = Object.keys(records[0])
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required columns: ${missingColumns.join(', ')}`,
          requiredColumns,
          foundColumns: headers,
        },
        { status: 400 }
      )
    }

    // Process rows and create listings
    const results = {
      success: 0,
      errors: [] as Array<{ row: number; error: string; data: Partial<CSVRow> }>,
      skipped: 0,
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNumber = i + 2 // +2 because CSV has header row and arrays are 0-indexed

      try {
        // Validate required fields
        if (!row.title || !row.slug || !row.type || !row.price || !row.addressLine1 || !row.city || !row.description) {
          results.errors.push({
            row: rowNumber,
            error: 'Missing required fields',
            data: row,
          })
          results.skipped++
          continue
        }

        // Check if slug already exists
        const existing = await db.listing.findUnique({
          where: {
            tenantId_slug: {
              tenantId,
              slug: row.slug,
            },
          },
          select: { id: true },
        })

        if (existing) {
          results.errors.push({
            row: rowNumber,
            error: `Slug "${row.slug}" already exists`,
            data: row,
          })
          results.skipped++
          continue
        }

        // Parse and validate data
        const price = Number(row.price)
        if (isNaN(price) || price <= 0) {
          results.errors.push({
            row: rowNumber,
            error: `Invalid price: ${row.price}`,
            data: row,
          })
          results.skipped++
          continue
        }

        // Parse optional fields
        const bedrooms = row.bedrooms ? Number(row.bedrooms) : null
        const bathrooms = row.bathrooms ? Number(row.bathrooms) : null
        let lat = row.lat ? Number(row.lat) : null
        let lng = row.lng ? Number(row.lng) : null

        // Auto-geocode address if lat/lng are missing
        if (!lat || !lng) {
          try {
            const addressParts = [row.addressLine1, row.city, row.postcode].filter(Boolean)
            const addressString = addressParts.join(', ')
            
            const geocodeResult = await placesService.geocode(addressString)
            if (geocodeResult) {
              lat = geocodeResult.lat
              lng = geocodeResult.lng
            }
          } catch (geocodeError) {
            // Don't fail listing creation if geocoding fails, just log it
            console.warn(`Geocoding failed for row ${rowNumber}:`, geocodeError)
          }
        }

        if (bedrooms !== null && (isNaN(bedrooms) || bedrooms < 0)) {
          results.errors.push({
            row: rowNumber,
            error: `Invalid bedrooms: ${row.bedrooms}`,
            data: row,
          })
          results.skipped++
          continue
        }

        if (bathrooms !== null && (isNaN(bathrooms) || bathrooms < 0)) {
          results.errors.push({
            row: rowNumber,
            error: `Invalid bathrooms: ${row.bathrooms}`,
            data: row,
          })
          results.skipped++
          continue
        }

        // Parse features (comma-separated string)
        const features = row.features
          ? row.features.split(',').map(f => f.trim()).filter(Boolean)
          : []

        // Validate status
        const status = row.status || 'draft'
        const validStatuses = ['draft', 'active', 'sold', 'let']
        if (!validStatuses.includes(status)) {
          results.errors.push({
            row: rowNumber,
            error: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`,
            data: row,
          })
          results.skipped++
          continue
        }

        // Validate type
        const validTypes = ['sale', 'rent', 'commercial']
        if (!validTypes.includes(row.type)) {
          results.errors.push({
            row: rowNumber,
            error: `Invalid type: ${row.type}. Must be one of: ${validTypes.join(', ')}`,
            data: row,
          })
          results.skipped++
          continue
        }

        // Create listing
        await db.listing.create({
          data: {
            tenantId,
            title: row.title,
            slug: row.slug,
            status,
            type: row.type,
            price,
            currency: row.currency || 'GBP',
            bedrooms,
            bathrooms,
            propertyType: row.propertyType || null,
            addressLine1: row.addressLine1,
            city: row.city,
            postcode: row.postcode || null,
            lat,
            lng,
            description: row.description,
            features,
            media: [], // CSV doesn't include images - can be added manually later
          },
        })

        results.success++
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push({
          row: rowNumber,
          error: errorMessage,
          data: row,
        })
        results.skipped++
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} successful, ${results.skipped} skipped`,
      results,
    })
  } catch (error: unknown) {
    console.error('CSV import error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message === 'Redirecting to sign-in') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const isDev = env.NODE_ENV === 'development'
      return NextResponse.json(
        { error: isDev ? error.message : 'Failed to import CSV file' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to import CSV file' },
      { status: 500 }
    )
  }
}

