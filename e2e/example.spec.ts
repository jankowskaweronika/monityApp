import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('/')
  
  // Verify that the page has loaded
  await expect(page).toHaveTitle(/MonityApp/)
  
  // Take a screenshot
  await page.screenshot({ path: 'screenshot.png' })
}) 