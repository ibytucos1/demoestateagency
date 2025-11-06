import { z } from 'zod'
import {
  LeaseBillingInterval as PrismaLeaseBillingInterval,
  LeaseStatus as PrismaLeaseStatus,
  MaintenancePriority as PrismaMaintenancePriority,
  MaintenanceStatus as PrismaMaintenanceStatus,
  PaymentStatus as PrismaPaymentStatus,
  UnitStatus as PrismaUnitStatus,
} from '@prisma/client'

const stringOrNull = z.string().trim().min(1).optional()

export const propertyCreateSchema = z.object({
  name: z.string().trim().min(1),
  code: stringOrNull,
  description: z.string().trim().max(10000).optional(),
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  postcode: z.string().trim().optional(),
  country: z.string().trim().optional(),
  lat: z.number().finite().optional(),
  lng: z.number().finite().optional(),
  ownerName: z.string().trim().optional(),
  ownerEmail: z.string().email().optional(),
  ownerPhone: z.string().trim().optional(),
  metadata: z.record(z.any()).optional(),
  externalId: z.string().trim().optional(),
})

export const propertyUpdateSchema = propertyCreateSchema.partial()

export const tenantProfileCreateSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().trim().optional(),
  alternateContact: z.record(z.any()).optional(),
  dateOfBirth: z.string().optional(),
  notes: z.string().trim().max(10000).optional(),
  externalId: z.string().trim().optional(),
})

const fallbackUnitStatus = {
  VACANT: 'VACANT',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED',
} as const

const fallbackLeaseStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
  EXPIRED: 'EXPIRED',
} as const

const fallbackLeaseBillingInterval = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  ANNUALLY: 'ANNUALLY',
} as const

const fallbackPaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED',
  WAIVED: 'WAIVED',
} as const

const fallbackMaintenancePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const

const fallbackMaintenanceStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const

const UnitStatusEnum =
  (PrismaUnitStatus as unknown as typeof fallbackUnitStatus | undefined) ?? fallbackUnitStatus

const LeaseStatusEnum =
  (PrismaLeaseStatus as unknown as typeof fallbackLeaseStatus | undefined) ?? fallbackLeaseStatus

const LeaseBillingIntervalEnum =
  (PrismaLeaseBillingInterval as unknown as typeof fallbackLeaseBillingInterval | undefined) ??
  fallbackLeaseBillingInterval

const PaymentStatusEnum =
  (PrismaPaymentStatus as unknown as typeof fallbackPaymentStatus | undefined) ?? fallbackPaymentStatus

const MaintenancePriorityEnum =
  (PrismaMaintenancePriority as unknown as typeof fallbackMaintenancePriority | undefined) ??
  fallbackMaintenancePriority

const MaintenanceStatusEnum =
  (PrismaMaintenanceStatus as unknown as typeof fallbackMaintenanceStatus | undefined) ??
  fallbackMaintenanceStatus

export const unitCreateSchema = z.object({
  propertyId: z.string().cuid(),
  label: z.string().trim().min(1),
  floor: z.string().trim().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  squareFeet: z.number().int().min(0).optional(),
  status: z.nativeEnum(UnitStatusEnum).optional(),
  rentAmount: z.number().nonnegative().optional(),
  deposit: z.number().nonnegative().optional(),
  availableFrom: z.string().datetime().optional(),
  notes: z.string().trim().max(10000).optional(),
  externalId: z.string().trim().optional(),
})

export const unitUpdateSchema = unitCreateSchema.partial().extend({
  propertyId: z.string().cuid().optional(),
})

export const leaseCreateSchema = z.object({
  unitId: z.string().cuid(),
  tenantProfileId: z.string().cuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  rentAmount: z.number().nonnegative(),
  depositAmount: z.number().nonnegative().optional(),
  status: z.nativeEnum(LeaseStatusEnum).default(LeaseStatusEnum.DRAFT),
  billingInterval: z.nativeEnum(LeaseBillingIntervalEnum).default(LeaseBillingIntervalEnum.MONTHLY),
  autoRentIncrease: z.boolean().optional(),
  noticePeriodDays: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional(),
  externalId: z.string().trim().optional(),
})

export const leaseUpdateSchema = leaseCreateSchema.partial().extend({
  unitId: z.string().cuid().optional(),
  tenantProfileId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
})

export const paymentCreateSchema = z.object({
  leaseId: z.string().cuid(),
  dueDate: z.string().datetime(),
  amountDue: z.number().nonnegative(),
  amountPaid: z.number().nonnegative().optional(),
  paidAt: z.string().datetime().optional(),
  status: z.nativeEnum(PaymentStatusEnum).default(PaymentStatusEnum.PENDING),
  method: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  notes: z.string().trim().max(5000).optional(),
  externalId: z.string().trim().optional(),
})

export const maintenanceCreateSchema = z.object({
  propertyId: z.string().cuid(),
  unitId: z.string().cuid().optional(),
  tenantProfileId: z.string().cuid().optional(),
  summary: z.string().trim().min(1),
  description: z.string().trim().max(10000).optional(),
  priority: z.nativeEnum(MaintenancePriorityEnum).default(MaintenancePriorityEnum.MEDIUM),
  scheduledAt: z.string().datetime().optional(),
  attachments: z.array(z.object({ key: z.string(), url: z.string().url().optional() })).optional(),
  externalId: z.string().trim().optional(),
})

export const maintenanceUpdateSchema = maintenanceCreateSchema.partial().extend({
  propertyId: z.string().cuid().optional(),
  summary: z.string().trim().min(1).optional(),
})

export const maintenanceAssignSchema = z.object({
  assignedAgentId: z.string().trim().min(1),
  scheduledAt: z.string().datetime().optional(),
})

export type CreatePropertyInput = z.infer<typeof propertyCreateSchema>
export type UpdatePropertyInput = z.infer<typeof propertyUpdateSchema>

export type CreateTenantProfileInput = z.infer<typeof tenantProfileCreateSchema>

export type CreateUnitInput = z.infer<typeof unitCreateSchema>
export type UpdateUnitInput = z.infer<typeof unitUpdateSchema>

export type CreateLeaseInput = z.infer<typeof leaseCreateSchema>
export type UpdateLeaseInput = z.infer<typeof leaseUpdateSchema>

export type CreatePaymentInput = z.infer<typeof paymentCreateSchema>

export type CreateMaintenanceInput = z.infer<typeof maintenanceCreateSchema>
export type UpdateMaintenanceInput = z.infer<typeof maintenanceUpdateSchema>
export type AssignMaintenanceInput = z.infer<typeof maintenanceAssignSchema>
