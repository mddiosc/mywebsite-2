import type { Page } from '@playwright/test'

import { test, expect } from './fixtures'

const mockProjectsSnapshot = {
  generatedAt: '2026-03-26T00:00:00.000Z',
  source: 'generated',
  projects: [
    {
      id: 1,
      name: 'test-project-alpha',
      full_name: 'mddiosc/test-project-alpha',
      html_url: 'https://github.com/mddiosc/test-project-alpha',
      description: 'A snapshot-backed test project',
      homepage: 'https://example.com',
      language: 'TypeScript',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-06-01T00:00:00.000Z',
      pushed_at: '2024-06-01T00:00:00.000Z',
      stargazers_count: 42,
      forks_count: 7,
      topics: ['typescript', 'react'],
      languages: {
        TypeScript: 8000,
        JavaScript: 2000,
      },
    },
    {
      id: 2,
      name: 'test-project-beta',
      full_name: 'mddiosc/test-project-beta',
      html_url: 'https://github.com/mddiosc/test-project-beta',
      description: 'Another snapshot-backed project',
      homepage: null,
      language: 'JavaScript',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2024-05-01T00:00:00.000Z',
      pushed_at: '2024-05-01T00:00:00.000Z',
      stargazers_count: 5,
      forks_count: 1,
      topics: ['javascript', 'node'],
      languages: {
        JavaScript: 5000,
        CSS: 1000,
      },
    },
  ],
}

async function mockProjectsSnapshotModule(page: Page, payload: unknown) {
  await page.route('**/src/data/projects-snapshot.json?*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `export default ${JSON.stringify(payload)};`,
    })
  })
}

test.describe('Projects page', () => {
  test.describe('Snapshot-backed happy path', () => {
    test.beforeEach(async ({ page }) => {
      await mockProjectsSnapshotModule(page, mockProjectsSnapshot)

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

    test('should render project cards from the internal snapshot', async ({ page }) => {
      await expect(page.getByText('test-project-alpha')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('test-project-beta')).toBeVisible({ timeout: 10000 })
    })

    test('should display project statistics from snapshot data', async ({ page }) => {
      await expect(page.getByText('2').first()).toBeVisible()
      await expect(page.getByText('47').first()).toBeVisible()
      await expect(page.getByText('8').first()).toBeVisible()
    })

    test('should show a Demo link for a project with a homepage', async ({ page }) => {
      await expect(page.getByRole('link', { name: /demo/i }).first()).toBeVisible()
    })

    test('should open GitHub URL in a new tab when clicking a project card link', async ({
      page,
    }) => {
      const projectLink = page.getByRole('link', { name: 'test-project-alpha' }).first()
      await expect(projectLink).toBeVisible()

      const [popup] = await Promise.all([page.waitForEvent('popup'), projectLink.click()])

      await popup.waitForLoadState()
      expect(popup.url()).toContain('github.com/mddiosc/test-project-alpha')
    })

    test('should render without direct GitHub API access', async ({ page }) => {
      await expect(page.getByText('test-project-alpha')).toBeVisible({ timeout: 10000 })
      await expect(page.getByText('test-project-beta')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Empty state', () => {
    test('should render the empty state when the snapshot has no projects', async ({ page }) => {
      await mockProjectsSnapshotModule(page, {
        generatedAt: '2026-03-26T00:00:00.000Z',
        source: 'fallback',
        projects: [],
      })

      await page.goto('/es/projects')
      await page.waitForLoadState('networkidle')

      const emptyContent = page
        .getByText(/no projects|no hay proyectos|no se encontraron|empty|vacío/i)
        .first()
      await expect(emptyContent).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Invalid snapshot state', () => {
    test('should render the error component when the snapshot is invalid', async ({ page }) => {
      await mockProjectsSnapshotModule(page, {
        generatedAt: '2026-03-26T00:00:00.000Z',
        source: 'generated',
      })

      await page.goto('/es/projects')
      await page.waitForLoadState('networkidle')

      const errorContent = page.getByText(/error|failed|unable|fallo|error al/i).first()
      await expect(errorContent).toBeVisible({ timeout: 10000 })
    })
  })
})
