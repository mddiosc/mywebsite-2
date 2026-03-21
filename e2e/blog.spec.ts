import { test, expect } from './fixtures'

/**
 * Blog page tests
 * Covers: page load, filter UI visibility, individual post navigation,
 * and 404 for unknown blog slugs.
 */
test.describe('Blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/blog')
    await page.waitForLoadState('networkidle')
  })

  // ---------------------------------------------------------------------------
  // Page load
  // ---------------------------------------------------------------------------

  test('should load the Blog page without crashing', async ({ page }) => {
    await expect(page).toHaveURL(/\/(es|en)\/blog/)
    // The page should render — no error boundary visible
    const errorBoundary = page.getByText(/something went wrong|algo salió mal/i)
    await expect(errorBoundary).not.toBeVisible()
  })

  test('should render a page heading', async ({ page }) => {
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  // ---------------------------------------------------------------------------
  // Blog content (may be empty or have posts)
  // ---------------------------------------------------------------------------

  test('should render either a post list or an empty/coming-soon state', async ({ page }) => {
    // Either blog post cards exist OR a "no posts" / coming-soon message is shown
    const postCards = page.locator('article')
    const emptyState = page.getByText(/no posts|coming soon|próximamente|no hay/i)

    const postCount = await postCards.count()
    if (postCount > 0) {
      // Posts exist — verify first card is visible
      await expect(postCards.first()).toBeVisible({ timeout: 5000 })
    } else {
      // No posts — empty state should be visible
      await expect(emptyState.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should navigate to a blog post when clicking its link', async ({ page }) => {
    const postCards = page.locator('article')
    const count = await postCards.count()

    if (count === 0) {
      test.skip()
      return
    }

    // Click the first blog post link
    const firstPostLink = postCards.first().getByRole('link').first()
    await firstPostLink.click()
    await page.waitForLoadState('networkidle')

    // URL should now include a slug segment
    await expect(page).toHaveURL(/\/(es|en)\/blog\/.+/)
  })

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------

  test('should show filter controls if posts are available', async ({ page }) => {
    const postCards = page.locator('article')
    const count = await postCards.count()

    if (count === 0) {
      test.skip()
      return
    }

    // Filter buttons or a search input should be visible
    const filterSection = page.locator('input[type="search"], [role="group"] button').first()
    await expect(filterSection).toBeVisible({ timeout: 5000 })
  })

  // ---------------------------------------------------------------------------
  // English version
  // ---------------------------------------------------------------------------

  test('should load the Blog page in English', async ({ page }) => {
    await page.goto('/en/blog')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveURL(/\/en\/blog/)
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  // ---------------------------------------------------------------------------
  // Unknown blog slug → 404
  // ---------------------------------------------------------------------------

  test('should render 404 for an unknown blog slug', async ({ page }) => {
    await page.goto('/es/blog/this-post-does-not-exist-xyz')
    await page.waitForLoadState('networkidle')

    // Should either redirect to 404 page or show a not-found message
    const notFoundContent = page.getByText(/404|not found|no encontrado|error/i).first()
    await expect(notFoundContent).toBeVisible({ timeout: 5000 })
  })
})
