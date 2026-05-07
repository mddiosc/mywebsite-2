import { test, expect } from './fixtures'

/**
 * Theme toggle tests
 * Covers: light ↔ dark toggle, persistence across navigation,
 * and the anti-FOUC inline script synchronization with the React hook.
 *
 * Limited to desktop Chromium: the toggle is browser-agnostic logic,
 * MobileViewports hide it behind a hamburger menu, and unit tests
 * already cover the useTheme hook thoroughly.
 */
test.describe('Theme toggle', () => {
  test.beforeEach(({ browserName }, testInfo) => {
    test.skip(
      browserName !== 'chromium' || testInfo.project.name.includes('Mobile'),
      'Theme tests: desktop Chromium only',
    )
  })

  // ---------------------------------------------------------------------------
  // Toggle behaviour
  // ---------------------------------------------------------------------------

  test('should toggle from light to dark mode', async ({ page, enableLightMode, isDarkMode }) => {
    await enableLightMode()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Start in light mode
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(await isDarkMode()).toBe(false)

    await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click()

    // Should now be dark
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(await isDarkMode()).toBe(true)
  })

  test('should toggle from dark to light mode', async ({ page, enableDarkMode, isDarkMode }) => {
    await enableDarkMode()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Start in dark mode
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(await isDarkMode()).toBe(true)

    await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click()

    // Should now be light
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(await isDarkMode()).toBe(false)
  })

  // ---------------------------------------------------------------------------
  // Persistence across navigation
  // ---------------------------------------------------------------------------

  test('should persist dark mode across page navigation', async ({
    page,
    enableDarkMode,
    isDarkMode,
  }) => {
    await enableDarkMode()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(await isDarkMode()).toBe(true)

    // Navigate to blog
    await page.goto('/es/blog')
    await page.waitForLoadState('networkidle')

    // Theme should still be dark
    await expect(page.locator('html')).toHaveClass(/dark/)
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

    // Navigate to about
    await page.goto('/es/about')
    await page.waitForLoadState('networkidle')

    // Theme should still be light
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    expect(await isDarkMode()).toBe(false)
  })

  // ---------------------------------------------------------------------------
  // Toggle respects localStorage after manual change
  // ---------------------------------------------------------------------------

  test('should remember theme preference in localStorage', async ({ page, enableLightMode }) => {
    await enableLightMode()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Toggle to dark
    await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click()

    // Verify localStorage was updated
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme-preference'))
    expect(storedTheme).toBe('dark')

    // Toggle back to light
    await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click()

    const storedTheme2 = await page.evaluate(() => localStorage.getItem('theme-preference'))
    expect(storedTheme2).toBe('light')
  })
})
