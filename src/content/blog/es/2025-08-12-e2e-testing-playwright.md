---
title: "E2E Testing con Playwright: De cero a CI/CD"
description: "Guía completa para implementar testing end-to-end con Playwright en proyectos React: setup, patrones, visual regression y automatización."
date: "2025-08-12"
tags: ["testing", "playwright", "e2e", "ci-cd", "react", "automation"]
author: "Marco Di Dionisio"
slug: "e2e-testing-playwright"
featured: true
---

En mi post sobre testing con Vitest cubrí estrategias para tests unitarios y de integración. Pero hay una capa que no podemos ignorar: los tests end-to-end. Hoy quiero compartir mi experiencia implementando Playwright en proyectos React.

## ¿Por qué Playwright?

Después de años usando Cypress, migré a Playwright y no he mirado atrás. Las razones:

- ✅ Multi-navegador real (Chromium, Firefox, WebKit)
- ✅ Paralelización nativa
- ✅ Auto-waiting inteligente
- ✅ Mejor soporte para aplicaciones modernas
- ✅ Trace viewer para debugging
- ❌ Cypress: Solo Chromium en el plan gratuito
- ❌ Cypress: Paralelización requiere plan de pago

## Setup Inicial

```bash
# Instalación
npm init playwright@latest

# Estructura generada
├── playwright.config.ts
├── tests/
│   └── example.spec.ts
└── tests-examples/
    └── demo-todo-app.spec.ts
```

### Configuración para React

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

## Selectores Robustos

El secreto de tests E2E mantenibles está en los selectores. Playwright recomienda usar `data-testid`, pero hay mejores opciones.

### Jerarquía de Selectores

```typescript
// ❌ Frágil: depende de estructura CSS
await page.click('.btn.btn-primary.submit-form');

// ❌ Frágil: depende de texto exacto
await page.click('text=Enviar formulario');

// ✅ Mejor: role con nombre accesible
await page.getByRole('button', { name: 'Enviar formulario' }).click();

// ✅ Mejor: label para inputs
await page.getByLabel('Correo electrónico').fill('test@example.com');

// ✅ Alternativa: data-testid cuando no hay opción semántica
await page.getByTestId('submit-button').click();
```

### Locators Compuestos

```typescript
// Encontrar dentro de un contenedor específico
const form = page.getByRole('form', { name: 'Registro' });
await form.getByLabel('Nombre').fill('Marco');
await form.getByLabel('Email').fill('marco@example.com');
await form.getByRole('button', { name: 'Registrar' }).click();

// Filtrar elementos
const activeItems = page
  .getByRole('listitem')
  .filter({ hasNotText: 'completado' });
```

## Page Object Model

Para proyectos grandes, el patrón Page Object Model es esencial.

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
    this.emailInput = page.getByLabel('Correo electrónico');
    this.passwordInput = page.getByLabel('Contraseña');
    this.submitButton = page.getByRole('button', { name: 'Iniciar sesión' });
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
    this.userMenu = page.getByRole('button', { name: /perfil/i });
    this.logoutButton = page.getByRole('menuitem', { name: 'Cerrar sesión' });
  }

  async expectWelcome(name: string) {
    await expect(this.welcomeMessage).toContainText(`Bienvenido, ${name}`);
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
```

### Usando Page Objects en Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Autenticación', () => {
  test('login exitoso redirige al dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('usuario@test.com', 'password123');
    
    await loginPage.expectLoggedIn();
    await dashboardPage.expectWelcome('Usuario Test');
  });

  test('login fallido muestra error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalido@test.com', 'wrongpassword');
    
    await loginPage.expectError('Credenciales inválidas');
  });

  test('logout redirige al login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Setup: login primero
    await loginPage.goto();
    await loginPage.login('usuario@test.com', 'password123');
    await loginPage.expectLoggedIn();

    // Test: logout
    await dashboardPage.logout();
    await expect(page).toHaveURL('/login');
  });
});
```

## Fixtures Personalizados

Los fixtures permiten reutilizar setup entre tests.

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
    await loginPage.login('usuario@test.com', 'password123');
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
  test('muestra widgets del usuario', async ({ authenticatedPage }) => {
    // Ya estamos autenticados gracias al fixture
    await expect(authenticatedPage.welcomeMessage).toBeVisible();
  });
});
```

## Mocking de APIs

Playwright permite interceptar y mockear requests de red.

```typescript
// e2e/api-mocking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Con API mockeada', () => {
  test('muestra productos desde API', async ({ page }) => {
    // Interceptar llamada a API
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Producto Test', price: 99.99 },
          { id: 2, name: 'Otro Producto', price: 149.99 },
        ]),
      });
    });

    await page.goto('/products');

    await expect(page.getByText('Producto Test')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();
  });

  test('maneja error de API gracefully', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/products');

    await expect(
      page.getByText('Error al cargar productos')
    ).toBeVisible();
  });

  test('muestra loading mientras carga', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      // Simular latencia
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    await page.goto('/products');

    // Verificar estado de loading
    await expect(page.getByRole('progressbar')).toBeVisible();
    
    // Verificar que desaparece
    await expect(page.getByRole('progressbar')).not.toBeVisible();
  });
});
```

## Visual Regression Testing

Una de las features más poderosas de Playwright.

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage se ve correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Captura de página completa
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('componente Card mantiene diseño', async ({ page }) => {
    await page.goto('/components/card');
    
    const card = page.getByTestId('product-card');
    
    // Captura de componente específico
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

### Configuración de Snapshots

```typescript
// playwright.config.ts
export default defineConfig({
  // ...
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100, // Tolerancia para pequeñas diferencias
      threshold: 0.2, // Umbral de diferencia por pixel
    },
  },
  snapshotDir: './e2e/snapshots',
});
```

## Integración con CI/CD

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

### Sharding para Tests Paralelos

```yaml
# Para proyectos grandes
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

## Debugging Efectivo

### Trace Viewer

```bash
# Ejecutar con traces
npx playwright test --trace on

# Ver trace de un test fallido
npx playwright show-trace test-results/test-name/trace.zip
```

### UI Mode

```bash
# Modo interactivo para desarrollo
npx playwright test --ui
```

### Codegen

```bash
# Generar tests grabando acciones
npx playwright codegen localhost:5173
```

## Tests de Accesibilidad con Playwright

Combinando con axe-core:

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accesibilidad', () => {
  test('homepage no tiene violaciones críticas', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('formulario de contacto es accesible', async ({ page }) => {
    await page.goto('/contact');

    const results = await new AxeBuilder({ page })
      .include('#contact-form')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Buenas Prácticas

### 1. Tests Independientes

```typescript
// ❌ Malo: tests dependientes
test('crear usuario', async ({ page }) => { /* ... */ });
test('editar usuario creado', async ({ page }) => { /* ... */ }); // Depende del anterior

// ✅ Bueno: cada test es independiente
test('editar usuario', async ({ page }) => {
  // Setup propio
  await seedUser({ id: 1, name: 'Test User' });
  
  await page.goto('/users/1/edit');
  // ...
});
```

### 2. Esperas Explícitas vs Implícitas

```typescript
// ❌ Malo: sleep arbitrario
await page.waitForTimeout(2000);

// ✅ Bueno: esperar por condición específica
await expect(page.getByRole('alert')).toBeVisible();
await page.waitForResponse('**/api/data');
await page.waitForLoadState('networkidle');
```

### 3. Datos de Test Aislados

```typescript
// e2e/utils/test-data.ts
export function generateTestUser() {
  const id = crypto.randomUUID();
  return {
    email: `test-${id}@example.com`,
    name: `Test User ${id.slice(0, 8)}`,
  };
}

// En el test
test('registro de usuario', async ({ page }) => {
  const user = generateTestUser();
  // Usar user.email, user.name...
});
```

## Conclusión

Playwright ha transformado cómo escribo tests E2E. La combinación de selectores semánticos, Page Objects, visual regression y una integración CI/CD robusta hace que los tests sean confiables y mantenibles.

**Puntos clave:**

- ✅ Usar selectores basados en roles y labels
- ✅ Implementar Page Object Model desde el inicio
- ✅ Aprovechar visual regression para UI
- ✅ Configurar CI/CD con artifacts y reportes
- ✅ Tests independientes y datos aislados

¿Ya usas Playwright en tus proyectos? ¿Qué patrones te han funcionado mejor? 🎭
