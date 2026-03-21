import { test as base, expect, type Page } from '@playwright/test'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PortfolioFixtures {
  /** Navigates to a language-prefixed path and waits for network idle */
  gotoPage: (path: string) => Promise<void>
  /** Returns the current language from the URL (/es or /en) */
  getCurrentLang: () => Promise<string>
  /** Forces dark mode on via localStorage + html class before navigation */
  enableDarkMode: () => Promise<void>
  /** Forces light mode on via localStorage + html class before navigation */
  enableLightMode: () => Promise<void>
  /** Reads whether the page is currently in dark mode */
  isDarkMode: () => Promise<boolean>
}

// ---------------------------------------------------------------------------
// Mock data for GitHub API
// ---------------------------------------------------------------------------

export const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'test-project-alpha',
    full_name: 'testuser/test-project-alpha',
    description: 'A test project for end-to-end testing purposes',
    html_url: 'https://github.com/testuser/test-project-alpha',
    homepage: 'https://example.com',
    language: 'TypeScript',
    languages_url: 'https://api.github.com/repos/testuser/test-project-alpha/languages',
    stargazers_count: 42,
    forks_count: 7,
    topics: ['react', 'typescript', 'vite', 'testing', 'playwright'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T15:30:00Z',
    languages: { TypeScript: 8500, CSS: 1200, HTML: 300 },
    owner: { login: 'testuser', avatar_url: '' },
  },
  {
    id: 2,
    name: 'test-project-beta',
    full_name: 'testuser/test-project-beta',
    description: 'Another test project showcasing various features',
    html_url: 'https://github.com/testuser/test-project-beta',
    homepage: '',
    language: 'JavaScript',
    languages_url: 'https://api.github.com/repos/testuser/test-project-beta/languages',
    stargazers_count: 15,
    forks_count: 3,
    topics: ['javascript', 'node'],
    created_at: '2023-09-10T08:00:00Z',
    updated_at: '2024-03-05T12:00:00Z',
    languages: { JavaScript: 5000, HTML: 800 },
    owner: { login: 'testuser', avatar_url: '' },
  },
]

export const MOCK_LANGUAGES = {
  TypeScript: 8500,
  CSS: 1200,
  HTML: 300,
}

// ---------------------------------------------------------------------------
// Route mock helpers
// ---------------------------------------------------------------------------

/**
 * Intercepts GitHub API calls and returns mock project data.
 * Call this BEFORE page.goto() to ensure requests are intercepted.
 */
export async function mockGitHubApiSuccess(page: Page): Promise<void> {
  // Mock the repos list endpoint
  await page.route('**/api.github.com/users/*/repos**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PROJECTS),
    })
  })

  // Mock the languages endpoint for each project
  await page.route('**/api.github.com/repos/**/languages**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_LANGUAGES),
    })
  })
}

/**
 * Intercepts GitHub API calls and returns a 500 error.
 */
export async function mockGitHubApiError(page: Page): Promise<void> {
  await page.route('**/api.github.com/users/*/repos**', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    })
  })
}

/**
 * Intercepts GitHub API calls and returns an empty array.
 */
export async function mockGitHubApiEmpty(page: Page): Promise<void> {
  await page.route('**/api.github.com/users/*/repos**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })
}

// ---------------------------------------------------------------------------
// Extended test fixture
// ---------------------------------------------------------------------------

export const test = base.extend<PortfolioFixtures>({
  gotoPage: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
    })
  },

  getCurrentLang: async ({ page }, use) => {
    await use(async () => {
      const url = page.url()
      const match = /\/(es|en)(\/|$)/.exec(url)
      return match?.[1] ?? 'es'
    })
  },

  enableDarkMode: async ({ page }, use) => {
    await use(async () => {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'dark')
      })
    })
  },

  enableLightMode: async ({ page }, use) => {
    await use(async () => {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'light')
      })
    })
  },

  isDarkMode: async ({ page }, use) => {
    await use(async () => {
      return page.locator('html').evaluate((el) => (el as HTMLElement).classList.contains('dark'))
    })
  },
})

export { expect }
