import { test, expect } from './fixtures'

test.describe('Visual regression', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium-only visual baselines')

  test('navbar remains visually stable on the home page', async ({
    page,
    prepareForScreenshot,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await prepareForScreenshot()

    const navbar = page.locator('nav[aria-label]').first()
    await expect(navbar).toHaveScreenshot('home-navbar.png', {
      mask: [page.locator('nav[aria-label] button')],
      maxDiffPixelRatio: 0.02,
    })
  })

  test('footer remains visually stable on the home page', async ({
    page,
    prepareForScreenshot,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await prepareForScreenshot()

    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toHaveScreenshot('home-footer.png', {
      mask: [footer.locator('a[target="_blank"]'), footer.locator('a[href$="/contact"]')],
      maxDiffPixelRatio: 0.02,
    })
  })
})
