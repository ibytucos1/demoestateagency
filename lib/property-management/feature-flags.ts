interface TenantFeatureTheme {
  features?: Record<string, boolean>
}

export function isPropertyManagementEnabled(theme: TenantFeatureTheme | null | undefined) {
  if (!theme || typeof theme !== 'object') return true
  const features = theme.features
  if (!features) return true
  return Boolean(features.propertyManagement !== false)
}


