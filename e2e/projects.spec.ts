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
    await expect(page.getByText(firstProject.name)).toBeVisible({ timeout: 10000 })
  })

  test('should render without direct GitHub API access at runtime', async ({ page }) => {
    await expect(page.getByRole('link', { name: firstProject.name }).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should open the GitHub project link in a new tab', async ({ page }) => {
    const projectLink = page.getByRole('link', { name: firstProject.name }).first()
    await expect(projectLink).toBeVisible()

    const [popup] = await Promise.all([page.waitForEvent('popup'), projectLink.click()])

    await popup.waitForLoadState()
    expect(popup.url()).toContain(firstProject.html_url)
  })

  if (projectWithHomepage) {
    test('should show a demo link when the snapshot contains a project homepage', async ({
      page,
    }) => {
      await expect(page.getByRole('link', { name: /demo/i }).first()).toBeVisible()
    })
  }
})
