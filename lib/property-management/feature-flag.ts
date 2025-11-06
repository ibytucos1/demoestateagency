import { Tenant } from '@prisma/client'

const FEATURE_KEY = 'propertyManagement'

export function isPropertyManagementEnabled(tenant: Pick<Tenant, 'theme'>) {
  const theme = tenant.theme as Record<string, any> | null
  if (!theme) return true
  const features = (theme.features ?? {}) as Record<string, boolean>
  const value = features[FEATURE_KEY]
  if (typeof value === 'boolean') {
    return value
  }
  return true
}

