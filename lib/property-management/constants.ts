export const UNIT_STATUS_OPTIONS = [
  'VACANT',
  'OCCUPIED',
  'MAINTENANCE',
  'RESERVED',
] as const

export const LEASE_STATUS_OPTIONS = [
  'DRAFT',
  'ACTIVE',
  'TERMINATED',
  'EXPIRED',
] as const

export const LEASE_BILLING_INTERVALS = [
  'MONTHLY',
  'QUARTERLY',
  'ANNUALLY',
] as const

export const PAYMENT_STATUS_OPTIONS = [
  'PENDING',
  'PAID',
  'PARTIAL',
  'FAILED',
  'WAIVED',
] as const

export const MAINTENANCE_PRIORITY_OPTIONS = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
] as const

export const MAINTENANCE_STATUS_OPTIONS = [
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'RESOLVED',
  'CLOSED',
] as const

export type UnitStatusOption = typeof UNIT_STATUS_OPTIONS[number]
export type LeaseStatusOption = typeof LEASE_STATUS_OPTIONS[number]
export type LeaseBillingIntervalOption = typeof LEASE_BILLING_INTERVALS[number]
export type PaymentStatusOption = typeof PAYMENT_STATUS_OPTIONS[number]
export type MaintenancePriorityOption = typeof MAINTENANCE_PRIORITY_OPTIONS[number]
export type MaintenanceStatusOption = typeof MAINTENANCE_STATUS_OPTIONS[number]

export const PROPERTY_MANAGEMENT_FEATURE_FLAG = 'propertyManagement'

