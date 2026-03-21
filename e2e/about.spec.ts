import { test, expect } from './fixtures'

/**
 * About page tests
 * Covers: page load, hero section, content sections, technology grid, skills.
 */
test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/about')
    await page.waitForLoadState('networkidle')
  })

  test('should load and display the About page', async ({ page }) => {
    await expect(page).toHaveURL(/\/(es|en)\/about/)
  })

  // ---------------------------------------------------------------------------
  // Hero section
  // ---------------------------------------------------------------------------

  test.describe('About hero', () => {
    test('should render the main heading', async ({ page }) => {
      const heading = page.locator('h1, h2').first()
      await expect(heading).toBeVisible({ timeout: 5000 })
      const text = await heading.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    })

    test('should show a contact CTA link', async ({ page }) => {
      const contactLink = page.getByRole('link', { name: /contact|contacto/i }).first()
      await expect(contactLink).toBeVisible({ timeout: 5000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Technology grid
  // ---------------------------------------------------------------------------

  test.describe('Technology grid', () => {
    test('should render the technologies section heading', async ({ page }) => {
      // The TechnologyGrid renders an h2 with the section title
      const techHeading = page.getByRole('heading', { name: /skills|habilidades|tecnolog/i })
      await expect(techHeading.first()).toBeVisible({ timeout: 5000 })
    })

    test('should render multiple technology logos', async ({ page }) => {
      // Each technology renders an OptimizedLogo inside a grid cell
      // We check that there are several img elements inside the tech section
      const techImages = page.locator('img[alt]')
      const count = await techImages.count()
      expect(count).toBeGreaterThanOrEqual(3)
    })

    test('should render skill tags', async ({ page }) => {
      // Skill tags are rendered as <span> elements below the logo grid
      // They come from the `skills` array in the constants
      const skillTags = page.locator('span').filter({ hasText: /react|typescript|javascript/i })
      const count = await skillTags.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------

  test.describe('Stats section', () => {
    test('should display experience stats', async ({ page }) => {
      // Stats contain values like "5+", "14", "20+"
      const statsValues = page.getByText(/^\d+\+?$/)
      const count = await statsValues.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  // ---------------------------------------------------------------------------
  // Works correctly in English too
  // ---------------------------------------------------------------------------

  test('should render correctly in English', async ({ page }) => {
    await page.goto('/en/about')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/\/en\/about/)
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 5000 })
  })
})
