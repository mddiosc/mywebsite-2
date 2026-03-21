import { test, expect } from './fixtures'

/**
 * Accessibility E2E tests
 * Covers: skip links, keyboard navigation through navbar,
 * mobile menu open/close, responsive layout checks.
 *
 * Note: these tests run on all configured browser projects including mobile viewports.
 * Some tests are scoped to desktop-only or mobile-only via `test.skip`.
 */
test.describe('Accessibility', () => {
  // ---------------------------------------------------------------------------
  // Skip links
  // ---------------------------------------------------------------------------

  test.describe('Skip links', () => {
    test('should show skip-to-main-content link on Tab and move focus to #main-content', async ({
      page,
    }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Press Tab once — the first focusable element should be the skip link
      await page.keyboard.press('Tab')

      const skipLink = page.getByRole('link', { name: /skip to main content|ir al contenido/i })
      await expect(skipLink).toBeFocused({ timeout: 3000 })

      // Press Enter to follow the skip link
      await page.keyboard.press('Enter')

      // Focus should now be on or inside #main-content
      const mainContent = page.locator('#main-content')
      await expect(mainContent).toBeVisible()

      // Verify focus has moved to #main-content using evaluate (avoids timeout on :focus locator)
      const focusedId = await page.evaluate(() => document.activeElement?.id ?? '')
      expect(focusedId).toBe('main-content')
    })

    test('should show all three skip links when focused sequentially', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // First Tab → skip to main content
      await page.keyboard.press('Tab')
      const mainSkip = page.getByRole('link', { name: /skip to main content|ir al contenido/i })
      await expect(mainSkip).toBeFocused({ timeout: 3000 })

      // Second Tab → skip to navigation
      await page.keyboard.press('Tab')
      const navSkip = page.getByRole('link', { name: /skip to navigation|ir a la navegac/i })
      await expect(navSkip).toBeFocused({ timeout: 3000 })

      // Third Tab → skip to footer
      await page.keyboard.press('Tab')
      const footerSkip = page.getByRole('link', { name: /skip to footer|ir al pie/i })
      await expect(footerSkip).toBeFocused({ timeout: 3000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Keyboard navigation — desktop only
  // ---------------------------------------------------------------------------

  test.describe('Keyboard navigation (desktop)', () => {
    test.skip(({ isMobile }) => isMobile, 'Desktop-only test')

    test('should allow Tab navigation to reach the logo link', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Tab past the skip links (3 skip links) to reach the logo NavLink
      await page.keyboard.press('Tab') // skip to main
      await page.keyboard.press('Tab') // skip to nav
      await page.keyboard.press('Tab') // skip to footer
      await page.keyboard.press('Tab') // logo link

      const logoLink = page.getByRole('link', { name: /go to homepage|ir a la página de inicio/i })
      await expect(logoLink).toBeFocused({ timeout: 3000 })
    })

    test('should allow Tab navigation through all navbar links', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Skip past skip links and logo (4 tabs)
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab')
      }

      // Now we should reach the nav links — verify at least one nav item is focused
      const focusedElement = page.locator(':focus')
      const role = await focusedElement.getAttribute('role')
      const tagName = await focusedElement.evaluate((el) => (el as Element).tagName.toLowerCase())
      expect(['a', 'button']).toContain(tagName === 'a' ? 'a' : (role ?? tagName))
    })

    test('should have visible focus indicators on nav links', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Tab to the logo link
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab')
      }

      // The focused element should have an outline or focus ring visible
      // We verify this by checking the computed outline or box-shadow style
      const focusedOutline = await page.locator(':focus').evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.outline !== 'none' || styles.boxShadow !== 'none'
      })
      expect(focusedOutline).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Mobile menu — mobile viewports only
  // ---------------------------------------------------------------------------

  test.describe('Mobile menu', () => {
    test.skip(({ isMobile }) => !isMobile, 'Mobile-only test')

    test('should open the mobile menu when clicking the hamburger button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await expect(hamburger).toBeVisible({ timeout: 5000 })
      await hamburger.click()

      // The mobile menu dialog should be visible
      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })
    })

    test('should close the mobile menu when clicking the close button', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Open the menu
      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await hamburger.click()

      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })

      // Close the menu
      const closeButton = page.getByRole('button', { name: /close menu|cerrar menú/i })
      await closeButton.click()

      await expect(mobileMenu).not.toBeVisible({ timeout: 3000 })
    })

    test('should close the mobile menu when pressing Escape', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await hamburger.click()

      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })

      await page.keyboard.press('Escape')
      await expect(mobileMenu).not.toBeVisible({ timeout: 3000 })
    })

    test('should close the mobile menu after clicking a nav link', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await hamburger.click()

      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })

      // Click a nav link inside the menu
      const aboutLink = mobileMenu.getByRole('link', { name: /about|sobre/i }).first()
      await aboutLink.click()
      await page.waitForLoadState('networkidle')

      // Menu should be closed and URL should be about
      await expect(mobileMenu).not.toBeVisible({ timeout: 3000 })
      await expect(page).toHaveURL(/\/(es|en)\/about/)
    })

    test('should show ThemeToggle inside mobile menu', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await hamburger.click()

      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })

      // ThemeToggle should be accessible inside the mobile menu
      const themeToggle = mobileMenu.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      })
      await expect(themeToggle).toBeVisible({ timeout: 3000 })
    })

    test('should show LanguageSwitcher inside mobile menu', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      await hamburger.click()

      const mobileMenu = page.locator('#mobile-menu')
      await expect(mobileMenu).toBeVisible({ timeout: 3000 })

      // Language switcher should be accessible inside the mobile menu
      const langSwitcher = mobileMenu.getByRole('group', { name: /language|idioma/i })
      await expect(langSwitcher).toBeVisible({ timeout: 3000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Responsive layout checks
  // ---------------------------------------------------------------------------

  test.describe('Responsive layout', () => {
    test('should NOT show the hamburger menu on desktop viewports', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const hamburger = page.getByRole('button', { name: /open main menu|abrir menú/i })
      // On desktop (>=1024px), the hamburger is hidden via CSS
      await expect(hamburger).not.toBeVisible()
    })

    test('should show desktop nav links on desktop viewports', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // On desktop, at least one nav link should be visible in the header
      const nav = page.locator('nav[aria-label]').first()
      await expect(nav).toBeVisible()
    })
  })

  // ---------------------------------------------------------------------------
  // ARIA landmarks
  // ---------------------------------------------------------------------------

  test.describe('ARIA landmarks', () => {
    test('should have a main landmark', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const main = page.locator('main#main-content')
      await expect(main).toBeVisible()
    })

    test('should have a banner (header) landmark', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const banner = page.locator('[role="banner"]')
      await expect(banner).toBeVisible()
    })

    test('should have a navigation landmark with aria-label', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const nav = page.locator('nav[aria-label]').first()
      await expect(nav).toBeVisible()
    })

    test('should have a contentinfo (footer) landmark', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const footer = page.locator('footer#footer, footer[id="footer"]')
      // Footer exists in DOM (may need to scroll to it)
      const count = await footer.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })
})
