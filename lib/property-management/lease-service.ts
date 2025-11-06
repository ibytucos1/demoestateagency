import { Prisma, LeaseStatus, LeaseBillingInterval, UnitStatus } from '@prisma/client'
import { db } from '@/lib/db'
import {
  leaseCreateSchema,
  leaseUpdateSchema,
  type CreateLeaseInput,
  type UpdateLeaseInput,
} from './schemas'
import { paymentService } from './payment-service'
import { unitService } from './unit-service'

interface ListLeaseOptions {
  status?: LeaseStatus[]
  tenantProfileId?: string
  unitId?: string
}

class LeaseService {
  async list(tenantId: string, options: ListLeaseOptions = {}) {
    const { status, tenantProfileId, unitId } = options
    return db.lease.findMany({
      where: {
        tenantId,
        ...(status?.length ? { status: { in: status } } : {}),
        ...(tenantProfileId ? { tenantProfileId } : {}),
        ...(unitId ? { unitId } : {}),
      },
      include: {
        TenantProfile: true,
        Unit: true,
        Payments: {
          orderBy: { dueDate: 'asc' },
          take: 12,
        },
      },
      orderBy: { startDate: 'desc' },
    })
  }

  async getById(tenantId: string, leaseId: string) {
    return db.lease.findFirst({
      where: { tenantId, id: leaseId },
      include: {
        TenantProfile: true,
        Unit: true,
        Payments: true,
        Revisions: {
          orderBy: { changedAt: 'desc' },
        },
      },
    })
  }

  async create(tenantId: string, rawInput: CreateLeaseInput, options?: { generateMonths?: number }) {
    const data = leaseCreateSchema.parse(rawInput)
    await this.ensureUnitOwnership(tenantId, data.unitId)
    await this.ensureTenantProfileOwnership(tenantId, data.tenantProfileId)

    const leaseStatus = data.status ?? LeaseStatus.DRAFT

    const lease = await db.lease.create({
      data: {
        tenantId,
        unitId: data.unitId,
        tenantProfileId: data.tenantProfileId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        rentAmount: new Prisma.Decimal(data.rentAmount),
        depositAmount: data.depositAmount !== undefined ? new Prisma.Decimal(data.depositAmount) : null,
        status: leaseStatus,
        billingInterval: data.billingInterval ?? LeaseBillingInterval.MONTHLY,
        autoRentIncrease: data.autoRentIncrease ?? false,
        noticePeriodDays: data.noticePeriodDays ?? 30,
        metadata: data.metadata ?? null,
        externalId: data.externalId ?? null,
      },
    })

    // Automatically update unit status when lease is active
    if (leaseStatus === LeaseStatus.ACTIVE) {
      await unitService.setStatus(tenantId, data.unitId, UnitStatus.OCCUPIED)
    }

    const generateMonths = options?.generateMonths ?? 0
    if (generateMonths > 0) {
      await paymentService.bulkScheduleMonthly(
        tenantId,
        lease.id,
        new Date(data.startDate),
        generateMonths,
        data.rentAmount,
      )
    }

    return lease
  }

  async update(tenantId: string, leaseId: string, rawInput: UpdateLeaseInput) {
    const data = leaseUpdateSchema.parse(rawInput)
    const lease = await this.ensureLeaseOwnership(tenantId, leaseId)
    if (data.unitId) {
      await this.ensureUnitOwnership(tenantId, data.unitId)
    }
    if (data.tenantProfileId) {
      await this.ensureTenantProfileOwnership(tenantId, data.tenantProfileId)
    }

    const updated = await db.lease.update({
      where: { id: leaseId },
      data: {
        ...(data.unitId ? { unitId: data.unitId } : {}),
        ...(data.tenantProfileId ? { tenantProfileId: data.tenantProfileId } : {}),
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        rentAmount: data.rentAmount !== undefined ? new Prisma.Decimal(data.rentAmount) : undefined,
        depositAmount: data.depositAmount !== undefined ? new Prisma.Decimal(data.depositAmount) : undefined,
        status: data.status ?? undefined,
        billingInterval: data.billingInterval ?? undefined,
        autoRentIncrease: data.autoRentIncrease ?? undefined,
        noticePeriodDays: data.noticePeriodDays ?? undefined,
        metadata: data.metadata ?? undefined,
        externalId: data.externalId ?? undefined,
      },
      select: { id: true, status: true, updatedAt: true, unitId: true },
    })

    // Automatically update unit status when lease status changes to ACTIVE
    if (data.status === LeaseStatus.ACTIVE && lease.status !== LeaseStatus.ACTIVE) {
      await unitService.setStatus(tenantId, updated.unitId, UnitStatus.OCCUPIED)
    }
    // If lease is terminated/expired, set unit back to VACANT
    else if (data.status && [LeaseStatus.TERMINATED, LeaseStatus.EXPIRED].includes(data.status)) {
      await unitService.setStatus(tenantId, updated.unitId, UnitStatus.VACANT)
    }

    return updated
  }

  async terminate(tenantId: string, leaseId: string, terminatedAt: Date = new Date()) {
    const lease = await this.ensureLeaseOwnership(tenantId, leaseId)
    
    const updated = await db.lease.update({
      where: { id: leaseId },
      data: {
        status: LeaseStatus.TERMINATED,
        metadata: {
          terminatedAt: terminatedAt.toISOString(),
        },
      },
      select: { id: true, status: true, unitId: true },
    })

    // Set unit back to VACANT when lease is terminated
    await unitService.setStatus(tenantId, lease.unitId, UnitStatus.VACANT)

    return updated
  }

  async recordRevision(tenantId: string, leaseId: string, change: Record<string, unknown>, userId?: string, reason?: string) {
    await this.ensureLeaseOwnership(tenantId, leaseId)
    return db.leaseRevision.create({
      data: {
        tenantId,
        leaseId,
        change,
        createdBy: userId ?? null,
        reason: reason ?? null,
      },
    })
  }

  async getActiveLeaseForUnit(tenantId: string, unitId: string) {
    return db.lease.findFirst({
      where: {
        tenantId,
        unitId,
        status: { in: [LeaseStatus.ACTIVE, LeaseStatus.PENDING] },
      },
      orderBy: { startDate: 'desc' },
    })
  }

  private async ensureLeaseOwnership(tenantId: string, leaseId: string) {
    const lease = await db.lease.findFirst({
      where: { tenantId, id: leaseId },
      select: { id: true, unitId: true, status: true },
    })
    if (!lease) {
      throw new Error('Lease not found')
    }
    return lease
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

export const leaseService = new LeaseService()


