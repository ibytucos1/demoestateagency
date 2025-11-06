import { db } from '@/lib/db'
import { LeaseStatus } from '@prisma/client'
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from './schemas'

interface ListPropertiesOptions {
  search?: string
  city?: string
}

class PropertyService {
  private async ensureOwnership(tenantId: string, propertyId: string) {
    const property = await db.property.findFirst({
      where: { tenantId, id: propertyId },
      select: { id: true },
    })

    if (!property) {
      throw new Error('Property not found')
    }
  }

  async list(tenantId: string, options: ListPropertiesOptions = {}) {
    const { search, city } = options
    return db.property.findMany({
      where: {
        tenantId,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            Units: true,
            Listings: true,
          },
        },
      },
      take: 100,
    })
  }

  async getById(tenantId: string, propertyId: string) {
    return db.property.findFirst({
      where: { tenantId, id: propertyId },
      include: {
        Units: true,
      },
    })
  }

  async create(tenantId: string, rawInput: CreatePropertyInput) {
    const data = propertyCreateSchema.parse(rawInput)
    return db.property.create({
      data: {
        tenantId,
        ...data,
      },
    })
  }

  async update(tenantId: string, propertyId: string, rawInput: UpdatePropertyInput) {
    const data = propertyUpdateSchema.parse(rawInput)
    await this.ensureOwnership(tenantId, propertyId)
    return db.property.update({
      where: { id: propertyId },
      data: {
        ...data,
      },
      select: { id: true, name: true, city: true, updatedAt: true },
    })
  }

  async delete(tenantId: string, propertyId: string) {
    await this.ensureOwnership(tenantId, propertyId)
    await db.property.delete({
      where: { id: propertyId },
    })
  }

  async syncListingStatus(listingId: string) {
    try {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
        select: {
          id: true,
          tenantId: true,
          propertyId: true,
          status: true,
        },
      })

      if (!listing?.propertyId) {
        return null
      }

      const hasActiveLease = await db.lease.findFirst({
        where: {
          tenantId: listing.tenantId,
          Unit: { propertyId: listing.propertyId },
          status: { in: [LeaseStatus.ACTIVE] },
        },
        select: { id: true },
      })

      const nextStatus = hasActiveLease ? 'let' : 'active'

      if (nextStatus === listing.status) {
        return listing
      }

      return db.listing.update({
        where: { id: listingId },
        data: { status: nextStatus },
        select: { id: true, status: true },
      })
    } catch (error) {
      console.error('[PropertyService.syncListingStatus] failed', {
        listingId,
        message: error instanceof Error ? error.message : 'unknown error',
      })
      throw error
    }
  }

  async upsertLocationMetadata(tenantId: string, propertyId: string, lat?: number, lng?: number) {
    return db.property.update({
      where: { id: propertyId },
      data: {
        lat: lat ?? null,
        lng: lng ?? null,
      },
      select: { id: true, lat: true, lng: true },
    })
  }
}

export const propertyService = new PropertyService()


