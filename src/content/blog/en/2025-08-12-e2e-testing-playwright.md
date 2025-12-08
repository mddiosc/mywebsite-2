---
title: "E2E Testing with Playwright: From Zero to CI/CD"
description: "Complete guide to implementing end-to-end testing with Playwright in React projects: setup, patterns, visual regression, and automation."
date: "2025-08-12"
tags: ["testing", "playwright", "e2e", "ci-cd", "react", "automation"]
author: "Miguel Ángel de Dios"
slug: "e2e-testing-playwright"
featured: false
---

In my post about testing with Vitest, I covered strategies for unit and integration tests. But there's a layer we can't ignore: end-to-end tests. Today I want to share my experience implementing Playwright in React projects.

## Why Playwright?

After years using Cypress, I migrated to Playwright and haven't looked back. The reasons:

- ✅ True multi-browser support (Chromium, Firefox, WebKit)
- ✅ Native parallelization
- ✅ Smart auto-waiting
- ✅ Better support for modern applications
- ✅ Trace viewer for debugging
- ❌ Cypress: Only Chromium in the free plan
- ❌ Cypress: Parallelization requires paid plan

## Initial Setup

```bash
# Installation
npm init playwright@latest

# Generated structure
├── playwright.config.ts
├── tests/
│   └── example.spec.ts
└── tests-examples/
    └── demo-todo-app.spec.ts
```

### Configuration for React

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Robust Selectors

The secret to maintainable E2E tests lies in selectors. Playwright recommends using `data-testid`, but there are better options.

### Selector Hierarchy

```typescript
// ❌ Fragile: depends on CSS structure
await page.click('.btn.btn-primary.submit-form');

// ❌ Fragile: depends on exact text
await page.click('text=Submit form');

// ✅ Better: role with accessible name
await page.getByRole('button', { name: 'Submit form' }).click();

// ✅ Better: label for inputs
await page.getByLabel('Email address').fill('test@example.com');

// ✅ Alternative: data-testid when there's no semantic option
await page.getByTestId('submit-button').click();
```

### Composite Locators

```typescript
// Find within a specific container
const form = page.getByRole('form', { name: 'Registration' });
await form.getByLabel('Name').fill('Marco');
await form.getByLabel('Email').fill('marco@example.com');
await form.getByRole('button', { name: 'Register' }).click();

// Filter elements
const activeItems = page
  .getByRole('listitem')
  .filter({ hasNotText: 'completed' });
```

## Page Object Model

For large projects, the Page Object Model pattern is essential.

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL('/dashboard');
  }
}
```

```typescript
// e2e/pages/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByRole('heading', { level: 1 });
    this.userMenu = page.getByRole('button', { name: /profile/i });
    this.logoutButton = page.getByRole('menuitem', { name: 'Sign out' });
  }

  async expectWelcome(name: string) {
    await expect(this.welcomeMessage).toContainText(`Welcome, ${name}`);
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
```

### Using Page Objects in Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('user@test.com', 'password123');
    
    await loginPage.expectLoggedIn();
    await dashboardPage.expectWelcome('Test User');
  });

  test('failed login shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid@test.com', 'wrongpassword');
    
    await loginPage.expectError('Invalid credentials');
  });

  test('logout redirects to login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Setup: login first
    await loginPage.goto();
    await loginPage.login('user@test.com', 'password123');
    await loginPage.expectLoggedIn();

    // Test: logout
    await dashboardPage.logout();
    await expect(page).toHaveURL('/login');
  });
});
```

## Custom Fixtures

Fixtures allow reusing setup across tests.

```typescript
// e2e/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@test.com', 'password123');
    await loginPage.expectLoggedIn();
    
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from './fixtures';

test.describe('Dashboard', () => {
  test('shows user widgets', async ({ authenticatedPage }) => {
    // Already authenticated thanks to the fixture
    await expect(authenticatedPage.welcomeMessage).toBeVisible();
  });
});
```

## API Mocking

Playwright allows intercepting and mocking network requests.

```typescript
// e2e/api-mocking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('With mocked API', () => {
  test('shows products from API', async ({ page }) => {
    // Intercept API call
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Test Product', price: 99.99 },
          { id: 2, name: 'Another Product', price: 149.99 },
        ]),
      });
    });

    await page.goto('/products');

    await expect(page.getByText('Test Product')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();
  });

  test('handles API error gracefully', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/products');

    await expect(
      page.getByText('Error loading products')
    ).toBeVisible();
  });

  test('shows loading while fetching', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      // Simulate latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    await page.goto('/products');

    // Verify loading state
    await expect(page.getByRole('progressbar')).toBeVisible();
    
    // Verify it disappears
    await expect(page.getByRole('progressbar')).not.toBeVisible();
  });
});
```

## Visual Regression Testing

One of Playwright's most powerful features.

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage looks correct', async ({ page }) => {
    await page.goto('/');
    
    // Full page capture
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('Card component maintains design', async ({ page }) => {
    await page.goto('/components/card');
    
    const card = page.getByTestId('product-card');
    
    // Specific component capture
    await expect(card).toHaveScreenshot('product-card.png');
  });

  test('responsive: mobile vs desktop', async ({ page }) => {
    await page.goto('/');
    
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('homepage-desktop.png');
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('homepage-tablet.png');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });
});
```

### Snapshot Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // ...
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Tolerance for small differences
      threshold: 0.2, // Per-pixel difference threshold
    },
  },
  snapshotDir: './e2e/snapshots',
});
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload test artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-artifacts
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

### Sharding for Parallel Tests

```yaml
# For large projects
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    
    steps:
      # ... setup steps
      
      - name: Run E2E tests
        run: npx playwright test --shard=${{ matrix.shard }}
```

## Effective Debugging

### Trace Viewer

```bash
# Run with traces
npx playwright test --trace on

# View trace from a failed test
npx playwright show-trace test-results/test-name/trace.zip
```

### UI Mode

```bash
# Interactive mode for development
npx playwright test --ui
```

### Codegen

```bash
# Generate tests by recording actions
npx playwright codegen localhost:5173
```

## Accessibility Tests with Playwright

Combining with axe-core:

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no critical violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('contact form is accessible', async ({ page }) => {
    await page.goto('/contact');

    const results = await new AxeBuilder({ page })
      .include('#contact-form')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Best Practices

### 1. Independent Tests

```typescript
// ❌ Bad: dependent tests
test('create user', async ({ page }) => { /* ... */ });
test('edit created user', async ({ page }) => { /* ... */ }); // Depends on previous

// ✅ Good: each test is independent
test('edit user', async ({ page }) => {
  // Own setup
  await seedUser({ id: 1, name: 'Test User' });
  
  await page.goto('/users/1/edit');
  // ...
});
```

### 2. Explicit vs Implicit Waits

```typescript
// ❌ Bad: arbitrary sleep
await page.waitForTimeout(2000);

// ✅ Good: wait for specific condition
await expect(page.getByRole('alert')).toBeVisible();
await page.waitForResponse('**/api/data');
await page.waitForLoadState('networkidle');
```

### 3. Isolated Test Data

```typescript
// e2e/utils/test-data.ts
export function generateTestUser() {
  const id = crypto.randomUUID();
  return {
    email: `test-${id}@example.com`,
    name: `Test User ${id.slice(0, 8)}`,
  };
}

// In the test
test('user registration', async ({ page }) => {
  const user = generateTestUser();
  // Use user.email, user.name...
});
```

## Conclusion

Playwright has transformed how I write E2E tests. The combination of semantic selectors, Page Objects, visual regression, and robust CI/CD integration makes tests reliable and maintainable.

**Key points:**

- ✅ Use role-based and label selectors
- ✅ Implement Page Object Model from the start
- ✅ Leverage visual regression for UI
- ✅ Configure CI/CD with artifacts and reports
- ✅ Independent tests and isolated data

Are you already using Playwright in your projects? What patterns have worked best for you? 🎭
