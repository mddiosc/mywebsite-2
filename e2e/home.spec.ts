import { test, expect } from './fixtures'

/**
 * Home page tests
 * Covers: Hero section, Features (bento grid), Stats, CTA buttons.
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // ---------------------------------------------------------------------------
  // Hero section
  // ---------------------------------------------------------------------------

  test.describe('Hero section', () => {
    test('should render the hero title', async ({ page }) => {
      // The animated h1 should be visible and non-empty
      const heroTitle = page.locator('h1').first()
      await expect(heroTitle).toBeVisible({ timeout: 5000 })
      const titleText = await heroTitle.textContent()
      expect(titleText?.trim().length).toBeGreaterThan(0)
    })

    test('should render the hero subtitle', async ({ page }) => {
      // The subtitle paragraph follows the h1
      const subtitle = page.locator('main p').first()
      await expect(subtitle).toBeVisible({ timeout: 5000 })
      const text = await subtitle.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    })

    test('should show availability status badge linking to contact', async ({ page }) => {
      // StatusBadge is a Link to /:lang/contact
      const badge = page.getByRole('link', { name: /available|disponible/i }).first()
      await expect(badge).toBeVisible({ timeout: 5000 })

      const href = await badge.getAttribute('href')
      expect(href).toMatch(/\/(es|en)\/contact/)
    })

    test('should show scroll indicator', async ({ page }) => {
      // The scroll indicator div is rendered below the subtitle
      // It is a purely decorative element — we just verify it is present in DOM
      const scrollIndicator = page.locator('.rounded-full.border-2').first()
      await expect(scrollIndicator).toBeVisible({ timeout: 5000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Features section
  // ---------------------------------------------------------------------------

  test.describe('Features section', () => {
    test('should render the features section heading', async ({ page }) => {
      const featuresHeading = page.locator('h2').first()
      await expect(featuresHeading).toBeVisible({ timeout: 5000 })
      const text = await featuresHeading.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    })

    test('should render at least one feature card', async ({ page }) => {
      // Feature cards are rendered in a grid — each has an h3
      const featureCards = page.locator('h3')
      await expect(featureCards.first()).toBeVisible({ timeout: 5000 })
      const count = await featureCards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  // ---------------------------------------------------------------------------
  // Stats section
  // ---------------------------------------------------------------------------

  test.describe('Stats section', () => {
    test('should render the stats grid with at least 3 items', async ({ page }) => {
      // Stats are text values like "5+", "14", "20+" inside StatsCard components
      const statsValues = page.getByText(/^\d+\+?$/)
      const count = await statsValues.count()
      expect(count).toBeGreaterThanOrEqual(3)
    })
  })

  // ---------------------------------------------------------------------------
  // CTA buttons
  // ---------------------------------------------------------------------------

  test.describe('CTA buttons', () => {
    test('should have a CTA link to the About page', async ({ page }) => {
      // Primary CTA → about page
      const aboutCTA = page.getByRole('link', { name: /about me|sobre mí/i }).first()
      await expect(aboutCTA).toBeVisible({ timeout: 5000 })

      const href = await aboutCTA.getAttribute('href')
      expect(href).toMatch(/\/(es|en)\/about/)
    })

    test('should have a CTA link to the Projects page', async ({ page }) => {
      // Secondary CTA → projects page
      const projectsCTA = page.getByRole('link', { name: /view portfolio|ver portfolio/i }).first()
      await expect(projectsCTA).toBeVisible({ timeout: 5000 })

      const href = await projectsCTA.getAttribute('href')
      expect(href).toMatch(/\/(es|en)\/projects/)
    })

    test('should navigate to About page when clicking About CTA', async ({ page }) => {
      const aboutCTA = page.getByRole('link', { name: /about me|sobre mí/i }).first()
      await aboutCTA.click()

      await expect(page).toHaveURL(/\/(es|en)\/about/, { timeout: 5000 })
    })

    test('should navigate to Projects page when clicking Portfolio CTA', async ({ page }) => {
      const projectsCTA = page.getByRole('link', { name: /view portfolio|ver portfolio/i }).first()
      await projectsCTA.click()

      await expect(page).toHaveURL(/\/(es|en)\/projects/, { timeout: 5000 })
    })
  })
})
