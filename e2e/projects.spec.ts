import { readFileSync } from 'node:fs'
import path from 'node:path'

import { test, expect } from './fixtures'

const snapshotPath = path.resolve(process.cwd(), 'src/data/projects-snapshot.json')
const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8')) as {
  generatedAt: string
  source: 'generated' | 'fallback'
  projects: Array<{
    name: string
    html_url: string
    homepage: string | null
  }>
}

const firstProject = snapshot.projects[0]
if (!firstProject) {
  throw new Error('Projects snapshot must contain at least one project for e2e tests')
}

const projectWithHomepage = snapshot.projects.find(
  (project) => typeof project.homepage === 'string' && project.homepage.length > 0,
)

test.describe('Projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api.github.com/**', async (route) => {
      await route.abort()
    })

    await page.goto('/es/projects')
    await page.waitForLoadState('networkidle')
  })

  test('should load and display the Projects page title', async ({ page }) => {
    await expect(page).toHaveURL(/\/(es|en)\/projects/)
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 5000 })
  })

  test('should render projects from the committed snapshot', async ({ page }) => {
    await expect(page.getByRole('link', { name: firstProject.name }).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should render without direct GitHub API access at runtime', async ({ page }) => {
    await expect(page.getByRole('link', { name: firstProject.name }).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should open the GitHub project link in a new tab', async ({ page }) => {
    // The inner <a> tag with target="_blank" — not the outer div[role="link"]
    const projectLink = page.locator('a[target="_blank"]', { hasText: firstProject.name }).first()
    await expect(projectLink).toBeVisible()

    await expect(projectLink).toHaveAttribute('target', '_blank')
    await expect(projectLink).toHaveAttribute('rel', /noopener.*noreferrer|noreferrer.*noopener/)
    await expect(projectLink).toHaveAttribute('href', firstProject.html_url)
  })

  if (projectWithHomepage) {
    test('should show a demo link when the snapshot contains a project homepage', async ({
      page,
    }) => {
      await expect(page.getByRole('link', { name: /demo/i }).first()).toBeVisible()
    })
  }
})
