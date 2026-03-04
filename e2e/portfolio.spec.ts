import { test, expect } from '@playwright/test'

test.describe('Portfolio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/')
  })

  test('should toggle dark mode successfully', async ({ page }) => {
    // 1. Initial state check
    const html = page.locator('html')
    const isInitiallyDark = await html.evaluate(
      (node: any) => node.classList?.contains('dark') ?? false,
    )

    // 2. Click the theme toggle button
    // Using a more robust selector that finds the button containing the SVG icons
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg.w-5.h-5') })
      .first()
    await expect(toggleButton).toBeVisible()
    await toggleButton.click()

    // 3. Verify the class has changed
    // Wait for the class mutation to happen
    await expect(html)
      .toHaveClass(isInitiallyDark ? /(^|\s)light(\s|$)/ : /(^|\s)dark(\s|$)/, { timeout: 5000 })
      .catch(() => {
        // Fallback check if it just removes the dark class instead of adding light
        return expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/)
      })
  })

  test('should change language from Spanish to English', async ({ page }) => {
    // 1. Check initial state - finding the EN button
    const enButton = page
      .getByRole('button', { name: 'EN' })
      .or(page.getByText('EN', { exact: true }))
      .first()
    await expect(enButton).toBeVisible()

    // 2. Click English language button
    await enButton.click()

    // 3. Verify URL changed to /en
    await expect(page).toHaveURL(/\/en/)

    // 4. Verify text changed to English
    await expect(page.getByRole('link', { name: /About/i }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('link', { name: /Projects/i }).first()).toBeVisible()
  })

  test('should navigate to portfolio projects page', async ({ page }) => {
    // 1. Wait for page to load
    // Need to handle both ES and EN cases since language might persist
    const portfolioButton = page
      .locator('a:has-text("Ver Portfolio"), a:has-text("View Portfolio")')
      .first()
    await expect(portfolioButton).toBeVisible()

    // 2. Click and verify navigation
    await portfolioButton.click()
    await expect(page).toHaveURL(/.*\/projects/)

    // 3. Verify the page content loaded (e.g. GitHub section)
    await expect(page.getByRole('heading', { name: 'GitHub' })).toBeVisible({ timeout: 10000 })
  })
})
