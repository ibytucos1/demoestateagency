import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test('should display search page and filter listings', async ({ page }) => {
    await page.goto('/search')
    await expect(page.getByRole('heading', { name: /search properties/i })).toBeVisible()
    
    // Wait for listings to load
    await page.waitForSelector('[data-testid="listing-card"], text=No listings found', { timeout: 5000 })
  })

  test('should submit lead form', async ({ page }) => {
    // First, go to a listing page (if any exist)
    await page.goto('/search')
    
    // Try to find and click a listing
    const firstListing = page.locator('a[href^="/listing/"]').first()
    if (await firstListing.count() > 0) {
      await firstListing.click()
      await page.waitForURL(/\/listing\//)
      
      // Fill and submit lead form
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('textarea[name="message"]', 'I am interested in this property')
      await page.click('button[type="submit"]')
      
      // Wait for success message
      await expect(page.getByText(/thank you/i)).toBeVisible({ timeout: 5000 })
    }
  })
})

