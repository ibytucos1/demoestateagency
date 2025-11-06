import { MaintenancePriority, MaintenanceStatus } from '@prisma/client'
import { db } from '@/lib/db'
import {
  maintenanceAssignSchema,
  maintenanceCreateSchema,
  maintenanceUpdateSchema,
  type AssignMaintenanceInput,
  type CreateMaintenanceInput,
  type UpdateMaintenanceInput,
} from './schemas'

interface ListMaintenanceOptions {
  status?: MaintenanceStatus[]
  priority?: MaintenancePriority[]
}

class MaintenanceService {
  async list(tenantId: string, options: ListMaintenanceOptions = {}) {
    const { status, priority } = options
    return db.maintenanceRequest.findMany({
      where: {
        tenantId,
        ...(status?.length ? { status: { in: status } } : {}),
        ...(priority?.length ? { priority: { in: priority } } : {}),
      },
      include: {
        Property: { select: { id: true, name: true, city: true } },
        Unit: { select: { id: true, label: true } },
        TenantProfile: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { requestedAt: 'desc' },
      take: 100,
    })
  }

  async getById(tenantId: string, requestId: string) {
    return db.maintenanceRequest.findFirst({
      where: { tenantId, id: requestId },
      include: {
        Property: true,
        Unit: true,
        TenantProfile: true,
      },
    })
  }

  async create(tenantId: string, rawInput: CreateMaintenanceInput) {
    const data = maintenanceCreateSchema.parse(rawInput)
    await this.ensurePropertyOwnership(tenantId, data.propertyId)
    if (data.unitId) {
      await this.ensureUnitOwnership(tenantId, data.unitId)
    }
    if (data.tenantProfileId) {
      await this.ensureTenantProfileOwnership(tenantId, data.tenantProfileId)
    }

    return db.maintenanceRequest.create({
      data: {
        tenantId,
        propertyId: data.propertyId,
        unitId: data.unitId ?? null,
        tenantProfileId: data.tenantProfileId ?? null,
        summary: data.summary,
        description: data.description ?? null,
        priority: data.priority ?? MaintenancePriority.MEDIUM,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        attachments: data.attachments ?? null,
        externalId: data.externalId ?? null,
      },
    })
  }

  async update(tenantId: string, requestId: string, rawInput: UpdateMaintenanceInput) {
    const data = maintenanceUpdateSchema.parse(rawInput)
    await this.ensureOwnership(tenantId, requestId)
    if (data.propertyId) {
      await this.ensurePropertyOwnership(tenantId, data.propertyId)
    }
    if (data.unitId) {
      await this.ensureUnitOwnership(tenantId, data.unitId)
    }
    if (data.tenantProfileId) {
      await this.ensureTenantProfileOwnership(tenantId, data.tenantProfileId)
    }

    return db.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        ...(data.propertyId ? { propertyId: data.propertyId } : {}),
        ...(data.unitId ? { unitId: data.unitId } : {}),
        ...(data.tenantProfileId ? { tenantProfileId: data.tenantProfileId } : {}),
        summary: data.summary ?? undefined,
        description: data.description ?? undefined,
        priority: data.priority ?? undefined,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        status: data.status ?? undefined,
        attachments: data.attachments ?? undefined,
        externalId: data.externalId ?? undefined,
      },
      select: { id: true, status: true, updatedAt: true },
    })
  }

  async assign(tenantId: string, requestId: string, rawInput: AssignMaintenanceInput) {
    const data = maintenanceAssignSchema.parse(rawInput)
    await this.ensureOwnership(tenantId, requestId)
    return db.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        assignedAgentId: data.assignedAgentId,
        status: MaintenanceStatus.IN_PROGRESS,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
      select: { id: true, status: true, assignedAgentId: true },
    })
  }

  async updateStatus(tenantId: string, requestId: string, status: MaintenanceStatus) {
    await this.ensureOwnership(tenantId, requestId)
    const completedAt = [MaintenanceStatus.RESOLVED, MaintenanceStatus.CLOSED].includes(status)
      ? new Date()
      : null

    return db.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        status,
        resolvedAt: completedAt,
      },
      select: { id: true, status: true, resolvedAt: true },
    })
  }

  private async ensureOwnership(tenantId: string, requestId: string) {
    const request = await db.maintenanceRequest.findFirst({
      where: { tenantId, id: requestId },
      select: { id: true },
    })
    if (!request) {
      throw new Error('Maintenance request not found')
    }
  }

  private async ensurePropertyOwnership(tenantId: string, propertyId: string) {
    const property = await db.property.findFirst({
      where: { tenantId, id: propertyId },
      select: { id: true },
    })
    if (!property) {
      throw new Error('Property not found')
    }
  }

  private async ensureUnitOwnership(tenantId: string, unitId: string) {
    const unit = await db.unit.findFirst({
      where: { tenantId, id: unitId },
      select: { id: true },
    })
    if (!unit) {
      throw new Error('Unit not found')
    }
  }

  private async ensureTenantProfileOwnership(tenantId: string, tenantProfileId: string) {
    const tenantProfile = await db.tenantProfile.findFirst({
      where: { tenantId, id: tenantProfileId },
      select: { id: true },
    })
    if (!tenantProfile) {
      throw new Error('Tenant profile not found')
    }
  }
}

export const maintenanceService = new MaintenanceService()


