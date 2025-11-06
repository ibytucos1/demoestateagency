import { db } from './db'
import { env } from './env'
import type { Prisma } from '@prisma/client'

export interface SearchFilters {
  status?: string[]
  type?: string[]
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  propertyType?: string[]
  city?: string
  radius?: number // in km
  lat?: number
  lng?: number
  features?: string[]
  keywords?: string // Text search for title/description
}

export interface SearchParams extends SearchFilters {
  tenantId: string
  limit?: number
  cursor?: string // createdAt,id
}

export interface SearchResult {
  listings: any[]
  nextCursor?: string
  hasMore: boolean
}

/**
 * SearchService interface - can be swapped for Typesense/Algolia later
 */
export interface ISearchService {
  search(params: SearchParams): Promise<SearchResult>
  index(listing: any): Promise<void>
  delete(id: string): Promise<void>
  reindex(): Promise<void>
}

/**
 * Database adapter for search (Postgres with indexed queries)
 */
export class DBSearchService implements ISearchService {
  async search(params: SearchParams): Promise<SearchResult> {
    const {
      tenantId,
      status = ['active'],
      type,
      minPrice,
      maxPrice,
      bedrooms,
      propertyType,
      city,
      radius,
      lat,
      lng,
      features,
      keywords,
      limit = 20,
      cursor,
    } = params

    // Parse cursor for keyset pagination
    let cursorCreatedAt: Date | undefined
    let cursorId: string | undefined
    if (cursor) {
      const [createdAt, id] = cursor.split(',')
      cursorCreatedAt = new Date(createdAt)
      cursorId = id
    }

    // Build where clause
    const where: Prisma.ListingWhereInput = {
      tenantId,
      ...(status && status.length > 0 && { status: { in: status } }),
      ...(type && type.length > 0 && { type: { in: type } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(bedrooms !== undefined && { bedrooms: { gte: bedrooms } }),
      ...(propertyType && propertyType.length > 0 && { propertyType: { in: propertyType } }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(features && features.length > 0 && { features: { hasSome: features } }),
      ...(keywords && {
        OR: [
          { title: { contains: keywords, mode: 'insensitive' } },
          { description: { contains: keywords, mode: 'insensitive' } },
          { addressLine1: { contains: keywords, mode: 'insensitive' } },
        ],
      }),
    }

    const andConditions: Prisma.ListingWhereInput[] = []
    if (where.AND) {
      if (Array.isArray(where.AND)) {
        andConditions.push(...where.AND)
      } else {
        andConditions.push(where.AND)
      }
      delete where.AND
    }

    const geoFilterActive =
      radius !== undefined &&
      radius > 0 &&
      lat !== undefined &&
      lng !== undefined

    if (geoFilterActive) {
      const latDelta = radius / 111
      const cosLat = Math.cos((lat * Math.PI) / 180)
      const lngScale = Math.max(Math.abs(cosLat), 0.01)
      const lngDelta = radius / (111 * lngScale)

      andConditions.push({
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      })
    }

    // Handle cursor pagination - combine with existing where clause
    if (cursorCreatedAt) {
      const cursorCondition: Prisma.ListingWhereInput = {
        OR: [
          { createdAt: { lt: cursorCreatedAt } },
          { createdAt: cursorCreatedAt, id: { lt: cursorId } },
        ],
      }
      andConditions.push(cursorCondition)
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // If radius search, add haversine filter
    if (radius && lat !== undefined && lng !== undefined) {
      // Using approximate distance (in production, use PostGIS)
      // For now, we'll filter in memory after fetching
      // In production: add PostGIS extension and use ST_Distance
    }

    const listings = await db.listing.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1, // Fetch one extra to check if there's more
    })

    // Debug logging in development
    if (env.NODE_ENV === 'development') {
      console.log('Search query debug:', {
        tenantId,
        whereClause: JSON.stringify(where, null, 2),
        foundCount: listings.length,
      listingIds: listings.map((l: any) => ({ id: l.id, title: l.title, status: l.status, city: l.city })),
      })
    }

    // Apply radius filter if needed (in-memory for now)
    let filteredListings = listings
    if (geoFilterActive) {
      filteredListings = listings.filter((listing: any) => {
        if (!listing.lat || !listing.lng) return false
        const distance = this.haversineDistance(lat, lng, listing.lat, listing.lng)
        return distance <= radius
      })
    }

    const hasMore = filteredListings.length > limit
    const results = hasMore ? filteredListings.slice(0, limit) : filteredListings

    // Generate next cursor
    let nextCursor: string | undefined
    if (hasMore && results.length > 0) {
      const last = results[results.length - 1]
      nextCursor = `${last.createdAt.toISOString()},${last.id}`
    }

    return {
      listings: results,
      nextCursor,
      hasMore,
    }
  }

  /**
   * Haversine distance calculation (in km)
   */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  async index(listing: any): Promise<void> {
    // No-op for DB adapter (already indexed in Postgres)
    // In Typesense/Algolia, this would push to search index
  }

  async delete(id: string): Promise<void> {
    // No-op for DB adapter
    // In Typesense/Algolia, this would delete from search index
  }

  async reindex(): Promise<void> {
    // No-op for DB adapter
    // In Typesense/Algolia, this would rebuild the index
  }
}

/**
 * Typesense adapter stub (for future implementation)
 */
export class TypesenseAdapter implements ISearchService {
  async search(params: SearchParams): Promise<SearchResult> {
    throw new Error('Typesense adapter not yet implemented')
  }

  async index(listing: any): Promise<void> {
    throw new Error('Typesense adapter not yet implemented')
  }

  async delete(id: string): Promise<void> {
    throw new Error('Typesense adapter not yet implemented')
  }

  async reindex(): Promise<void> {
    throw new Error('Typesense adapter not yet implemented')
  }
}

export const searchService = new DBSearchService()

