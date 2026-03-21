import {
  test,
  expect,
  mockGitHubApiSuccess,
  mockGitHubApiError,
  mockGitHubApiEmpty,
} from './fixtures'

/**
 * Projects page tests
 * Covers: happy path (real or mocked API), error state, empty state,
 * project card rendering, external link popup.
 */
test.describe('Projects page', () => {
  // ---------------------------------------------------------------------------
  // Happy path — mocked API returning 2 projects
  // ---------------------------------------------------------------------------

  test.describe('Happy path (mocked API)', () => {
    test.beforeEach(async ({ page }) => {
      await mockGitHubApiSuccess(page)
      await page.goto('/es/projects')
      await page.waitForLoadState('networkidle')
    })

    test('should load and display the Projects page title', async ({ page }) => {
      await expect(page).toHaveURL(/\/(es|en)\/projects/)

      // The page has a section heading (translated from pages.projects.portfolio)
      const heading = page.locator('h1, h2').first()
      await expect(heading).toBeVisible({ timeout: 5000 })
    })

    test('should render project cards after loading', async ({ page }) => {
      // Wait for skeleton to disappear and cards to appear
      // Project cards have an <a> with the project name inside an h3
      await expect(page.locator('h3').first()).toBeVisible({ timeout: 10000 })

      const cards = page.locator('h3')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })

    test('should display project name from mock data', async ({ page }) => {
      // Our mock project is named "test-project-alpha"
      const projectName = page.getByText('test-project-alpha')
      await expect(projectName).toBeVisible({ timeout: 10000 })
    })

    test('should display star and fork counts on a card', async ({ page }) => {
      // Star count "42" and fork count "7" come from the mock
      await expect(page.locator('h3').first()).toBeVisible({ timeout: 10000 })
      const starCount = page.getByText('42').first()
      await expect(starCount).toBeVisible()
    })

    test('should show a Demo link for a project with a homepage', async ({ page }) => {
      await expect(page.locator('h3').first()).toBeVisible({ timeout: 10000 })
      // The first mock project has homepage: 'https://example.com'
      const demoLink = page.getByRole('link', { name: /demo/i }).first()
      await expect(demoLink).toBeVisible()
    })

    test('should open GitHub URL in a new tab when clicking a project card link', async ({
      page,
    }) => {
      await expect(page.locator('h3').first()).toBeVisible({ timeout: 10000 })

      // The project name is a direct <a href="...github..."> link
      const projectLink = page.getByRole('link', { name: 'test-project-alpha' }).first()
      await expect(projectLink).toBeVisible()

      const [popup] = await Promise.all([page.waitForEvent('popup'), projectLink.click()])

      await popup.waitForLoadState()
      expect(popup.url()).toContain('github.com')
    })

    test('should display project statistics section', async ({ page }) => {
      await expect(page.locator('h3').first()).toBeVisible({ timeout: 10000 })
      // Statistics section renders total projects, stars, etc.
      const stats = page.getByText(/\d+/).first()
      await expect(stats).toBeVisible()
    })
  })

  // ---------------------------------------------------------------------------
  // Skeleton loading state
  // ---------------------------------------------------------------------------

  test.describe('Skeleton loading state', () => {
    test('should show skeleton cards while loading', async ({ page }) => {
      // Delay the API response to catch the skeleton state
      await page.route('**/api.github.com/users/*/repos**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      })

      await page.goto('/es/projects')

      // Skeletons use animate-pulse — check they appear before data loads
      const skeleton = page.locator('.animate-pulse').first()
      await expect(skeleton).toBeVisible({ timeout: 3000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Error state — API returns 500
  // ---------------------------------------------------------------------------

  test.describe('Error state (API 500)', () => {
    test('should render the error component when the API fails', async ({ page }) => {
      await mockGitHubApiError(page)
      await page.goto('/es/projects')
      await page.waitForLoadState('networkidle')

      // ProjectsError renders a visible error message
      const errorContent = page.getByText(/error|failed|unable|fallo|error al/i).first()
      await expect(errorContent).toBeVisible({ timeout: 10000 })
    })

    test('should render the error component in English', async ({ page }) => {
      await mockGitHubApiError(page)
      await page.goto('/en/projects')
      await page.waitForLoadState('networkidle')

      const errorContent = page.getByText(/error|failed|unable/i).first()
      await expect(errorContent).toBeVisible({ timeout: 10000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Empty state — API returns []
  // ---------------------------------------------------------------------------

  test.describe('Empty state (API returns empty array)', () => {
    test('should render the empty state component when there are no projects', async ({ page }) => {
      await mockGitHubApiEmpty(page)
      await page.goto('/es/projects')
      await page.waitForLoadState('networkidle')

      // ProjectsEmptyState renders a message about no projects found
      const emptyContent = page.getByText(/no projects|no hay proyectos|empty|vacío/i).first()
      await expect(emptyContent).toBeVisible({ timeout: 10000 })
    })
  })
})
