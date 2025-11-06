import { test, expect } from '@playwright/test'

test.describe('Property Management', () => {
  test('dashboard renders summary heading', async ({ page }) => {
    await page.goto('/admin/property-management')
    await expect(page.getByRole('heading', { name: /Property Management/i })).toBeVisible()
  })
})


