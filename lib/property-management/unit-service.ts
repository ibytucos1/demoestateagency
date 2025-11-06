import { Prisma, UnitStatus } from '@prisma/client'
import { db } from '@/lib/db'
import {
  unitCreateSchema,
  unitUpdateSchema,
  type CreateUnitInput,
  type UpdateUnitInput,
} from './schemas'

class UnitService {
  async listByProperty(tenantId: string, propertyId: string) {
    return db.unit.findMany({
      where: { tenantId, propertyId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getById(tenantId: string, unitId: string) {
    return db.unit.findFirst({
      where: { tenantId, id: unitId },
    })
  }

  async create(tenantId: string, rawInput: CreateUnitInput) {
    const data = unitCreateSchema.parse(rawInput)
    return db.unit.create({
      data: {
        tenantId,
        propertyId: data.propertyId,
        label: data.label,
        floor: data.floor,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        squareFeet: data.squareFeet ?? null,
        status: data.status ?? UnitStatus.VACANT,
        rentAmount: data.rentAmount !== undefined ? new Prisma.Decimal(data.rentAmount) : null,
        deposit: data.deposit !== undefined ? new Prisma.Decimal(data.deposit) : null,
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
        notes: data.notes ?? null,
        externalId: data.externalId ?? null,
      },
    })
  }

  async update(tenantId: string, unitId: string, rawInput: UpdateUnitInput) {
    const data = unitUpdateSchema.parse(rawInput)
    await this.ensureOwnership(tenantId, unitId)
    return db.unit.update({
      where: { id: unitId },
      data: {
        ...(data.propertyId ? { propertyId: data.propertyId } : {}),
        ...(data.label ? { label: data.label } : {}),
        floor: data.floor ?? undefined,
        bedrooms: data.bedrooms ?? undefined,
        bathrooms: data.bathrooms ?? undefined,
        squareFeet: data.squareFeet ?? undefined,
        status: data.status ?? undefined,
        rentAmount: data.rentAmount !== undefined ? new Prisma.Decimal(data.rentAmount) : undefined,
        deposit: data.deposit !== undefined ? new Prisma.Decimal(data.deposit) : undefined,
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
        notes: data.notes ?? undefined,
        externalId: data.externalId ?? undefined,
      },
      select: { id: true, label: true, status: true, updatedAt: true },
    })
  }

  async setStatus(tenantId: string, unitId: string, status: UnitStatus) {
    await this.ensureOwnership(tenantId, unitId)
    return db.unit.update({
      where: { id: unitId },
      data: { status },
      select: { id: true, status: true },
    })
  }

  async delete(tenantId: string, unitId: string) {
    await this.ensureOwnership(tenantId, unitId)
    await db.unit.delete({
      where: { id: unitId },
    })
  }

  private async ensureOwnership(tenantId: string, unitId: string) {
    const unit = await db.unit.findFirst({
      where: { tenantId, id: unitId },
      select: { id: true },
    })
    if (!unit) {
      throw new Error('Unit not found')
    }
  }
}

export const unitService = new UnitService()


