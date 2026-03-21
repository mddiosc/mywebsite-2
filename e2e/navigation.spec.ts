import { test, expect } from './fixtures'

/**
 * Navigation & i18n tests
 * Covers: dark mode toggle + persistence, language switch ES↔EN,
 * language persistence across routes, and 404 handling.
 */
test.describe('Navigation & i18n', () => {
  // ---------------------------------------------------------------------------
  // Dark mode
  // ---------------------------------------------------------------------------

  test.describe('Dark mode', () => {
    test('should toggle dark mode when clicking the theme button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const html = page.locator('html')
      const isInitiallyDark = await html.evaluate((el) =>
        (el as HTMLElement).classList.contains('dark'),
      )

      // The ThemeToggle button has an accessible aria-label
      const toggleButton = page.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      })
      await expect(toggleButton).toBeVisible()
      await toggleButton.click()

      if (isInitiallyDark) {
        await expect(html).not.toHaveClass(/\bdark\b/, { timeout: 3000 })
      } else {
        await expect(html).toHaveClass(/\bdark\b/, { timeout: 3000 })
      }
    })

    test('should persist dark mode across page navigation', async ({
      page,
      enableDarkMode,
      isDarkMode,
    }) => {
      await enableDarkMode()
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      expect(await isDarkMode()).toBe(true)

      // Navigate to About and verify dark mode is still active
      await page.getByRole('link', { name: /about/i }).first().click()
      await page.waitForLoadState('networkidle')
      expect(await isDarkMode()).toBe(true)

      // Navigate to Contact and verify dark mode is still active
      await page
        .getByRole('link', { name: /contact/i })
        .first()
        .click()
      await page.waitForLoadState('networkidle')
      expect(await isDarkMode()).toBe(true)
    })

    test('should persist light mode across page navigation', async ({
      page,
      enableLightMode,
      isDarkMode,
    }) => {
      await enableLightMode()
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      expect(await isDarkMode()).toBe(false)

      await page.getByRole('link', { name: /about/i }).first().click()
      await page.waitForLoadState('networkidle')
      expect(await isDarkMode()).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // Language switching
  // ---------------------------------------------------------------------------

  test.describe('Language switching', () => {
    test('should switch from Spanish to English and update URL + content', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Default language is Spanish — the EN button should be present
      const enButton = page.getByRole('button', { name: /switch to english/i })
      await expect(enButton).toBeVisible()
      await enButton.click()

      // URL should now contain /en
      await expect(page).toHaveURL(/\/en(\/|$)/, { timeout: 5000 })

      // Navigation links should be in English
      await expect(page.getByRole('link', { name: /^about$/i }).first()).toBeVisible({
        timeout: 5000,
      })
      await expect(page.getByRole('link', { name: /^projects$/i }).first()).toBeVisible()
    })

    test('should switch from English to Spanish and update URL + content', async ({ page }) => {
      await page.goto('/en/')
      await page.waitForLoadState('networkidle')

      const esButton = page.getByRole('button', { name: /switch to spanish/i })
      await expect(esButton).toBeVisible()
      await esButton.click()

      await expect(page).toHaveURL(/\/es(\/|$)/, { timeout: 5000 })

      // Navigation links should be in Spanish
      await expect(page.getByRole('link', { name: /^inicio$/i }).first()).toBeVisible({
        timeout: 5000,
      })
    })

    test('should persist selected language when navigating between pages', async ({ page }) => {
      // Start in English
      await page.goto('/en/')
      await page.waitForLoadState('networkidle')

      // Navigate to About
      await page
        .getByRole('link', { name: /^about$/i })
        .first()
        .click()
      await expect(page).toHaveURL(/\/en\/about/)

      // Navigate to Projects
      await page
        .getByRole('link', { name: /^projects$/i })
        .first()
        .click()
      await expect(page).toHaveURL(/\/en\/projects/)

      // URL should still contain /en throughout
      expect(page.url()).toContain('/en/')
    })

    test('should redirect unsupported lang prefix to default language', async ({ page }) => {
      await page.goto('/fr/')
      await page.waitForLoadState('networkidle')

      // Should redirect to /es or /en (the app default)
      await expect(page).toHaveURL(/\/(es|en)(\/|$)/, { timeout: 5000 })
    })
  })

  // ---------------------------------------------------------------------------
  // 404 page
  // ---------------------------------------------------------------------------

  test.describe('404 not found', () => {
    test('should render the 404 page for an unknown route', async ({ page }) => {
      await page.goto('/es/this-route-does-not-exist')
      await page.waitForLoadState('networkidle')

      // The NotFound page should render — check for a 404-related heading or text
      const notFoundContent = page.getByText(/404|not found|página no encontrada/i).first()
      await expect(notFoundContent).toBeVisible({ timeout: 5000 })
    })

    test('should render 404 page in English for unknown English route', async ({ page }) => {
      await page.goto('/en/this-route-does-not-exist')
      await page.waitForLoadState('networkidle')

      const notFoundContent = page.getByText(/404|not found/i).first()
      await expect(notFoundContent).toBeVisible({ timeout: 5000 })
    })
  })
})
