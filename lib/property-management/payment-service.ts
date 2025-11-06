import { Prisma, PaymentStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { paymentCreateSchema, type CreatePaymentInput } from './schemas'

interface ListPaymentsOptions {
  leaseId?: string
  status?: PaymentStatus[]
}

class PaymentService {
  async list(tenantId: string, options: ListPaymentsOptions = {}) {
    const { leaseId, status } = options
    return db.payment.findMany({
      where: {
        tenantId,
        ...(leaseId ? { leaseId } : {}),
        ...(status?.length ? { status: { in: status } } : {}),
      },
      orderBy: { dueDate: 'asc' },
    })
  }

  async create(tenantId: string, rawInput: CreatePaymentInput) {
    const data = paymentCreateSchema.parse(rawInput)
    await this.ensureLeaseOwnership(tenantId, data.leaseId)
    return db.payment.create({
      data: {
        tenantId,
        leaseId: data.leaseId,
        dueDate: new Date(data.dueDate),
        amountDue: new Prisma.Decimal(data.amountDue),
        amountPaid: data.amountPaid !== undefined ? new Prisma.Decimal(data.amountPaid) : null,
        paidAt: data.paidAt ? new Date(data.paidAt) : null,
        status: data.status ?? PaymentStatus.PENDING,
        method: data.method ?? null,
        reference: data.reference ?? null,
        notes: data.notes ?? null,
        externalId: data.externalId ?? null,
      },
    })
  }

  async markPaid(tenantId: string, paymentId: string, amount: number, paidAt = new Date(), method?: string, reference?: string) {
    await this.ensurePaymentOwnership(tenantId, paymentId)
    return db.payment.update({
      where: { id: paymentId },
      data: {
        amountPaid: new Prisma.Decimal(amount),
        paidAt,
        status: PaymentStatus.PAID,
        method: method ?? undefined,
        reference: reference ?? undefined,
      },
      select: { id: true, status: true, paidAt: true },
    })
  }

  async bulkScheduleMonthly(tenantId: string, leaseId: string, startDate: Date, months: number, amount: number) {
    await this.ensureLeaseOwnership(tenantId, leaseId)
    const schedule: Prisma.PaymentCreateManyInput[] = Array.from({ length: months }, (_, index) => {
      const dueDate = new Date(startDate)
      dueDate.setMonth(dueDate.getMonth() + index)
      return {
        tenantId,
        leaseId,
        dueDate,
        amountDue: new Prisma.Decimal(amount),
        amountPaid: new Prisma.Decimal(0),
        status: PaymentStatus.PENDING,
      }
    })

    if (!schedule.length) {
      return { count: 0 }
    }

    await db.payment.createMany({ data: schedule })
    return { count: schedule.length }
  }

  private async ensureLeaseOwnership(tenantId: string, leaseId: string) {
    const lease = await db.lease.findFirst({
      where: { tenantId, id: leaseId },
      select: { id: true },
    })
    if (!lease) {
      throw new Error('Lease not found')
    }
  }

  private async ensurePaymentOwnership(tenantId: string, paymentId: string) {
    const payment = await db.payment.findFirst({
      where: { tenantId, id: paymentId },
      select: { id: true },
    })
    if (!payment) {
      throw new Error('Payment not found')
    }
  }
}

export const paymentService = new PaymentService()


