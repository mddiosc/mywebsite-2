# Guía de Pruebas

Esta guía proporciona documentación completa sobre la estrategia de pruebas, configuración y mejores prácticas implementadas en el portafolio de Miguel Ángel de Dios.

## 📋 Visión General de Pruebas

El proyecto implementa una estrategia de pruebas integral que abarca múltiples niveles para garantizar calidad, confiabilidad y mantenibilidad del código.

### Pirámide de Pruebas

```text
     🔺 E2E Tests
      Pruebas End-to-End
    (Playwright - Flujos completos)
    
   🔺🔺 Integration Tests  
    Pruebas de Integración
  (React Testing Library - Interacciones)
  
 🔺🔺🔺 Unit Tests
  Pruebas Unitarias  
(Vitest - Funciones y Hooks)
```

### Tipos de Pruebas

- **🧪 Pruebas Unitarias**: Funciones, hooks y utilidades individuales
- **🔗 Pruebas de Integración**: Componentes con sus dependencias
- **🌐 Pruebas End-to-End**: Flujos de usuario completos
- **📸 Pruebas Visuales**: Regresión visual de componentes
- **⚡ Pruebas de Rendimiento**: Métricas de performance

## 🛠️ Configuración de Herramientas

### Vitest - Framework de Pruebas

```typescript
// vite.config.ts (el bloque `test`)
import { configDefaults } from 'vitest/config'
// ...plugins de vite, resolve.alias, build...

export default defineConfig(() => ({
  // ...plugins, resolve, build...
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/*'],

    // Configuración de cobertura
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
        'src/types/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/i18n/**',
        'src/constants/**',
      ],
      // Umbrales de cobertura (intencionalmente bajos)
      thresholds: {
        lines: 20,
        functions: 15,
        branches: 15,
        statements: 20,
      },
    },
  },
}))
```

### Configuración Inicial de Pruebas

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Importar y configurar i18n para pruebas
import './i18n-for-tests'

// Mock de window.matchMedia para componentes que usan useReducedMotion
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de IntersectionObserver para framer-motion whileInView en jsdom
class MockIntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: number[] = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Silenciar errores de consola conocidos en pruebas
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0]
    const message =
      firstArg instanceof Error ? firstArg.message : typeof firstArg === 'string' ? firstArg : JSON.stringify(firstArg)
    if (message.includes('Error sending message') || message.includes('Validation error')) return
    originalError(...args)
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
```

### Utilidades de Pruebas Personalizadas

```typescript
// src/test/utils.tsx
import { ReactElement } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'

import { render, RenderOptions, RenderResult } from '@testing-library/react'

import i18n from './i18n-for-tests'

// Configuración de QueryClient para pruebas
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

// Función de render con todos los providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  const testQueryClient = createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    ),
    ...options,
  })
}
```

## 🧪 Pruebas Unitarias

### Pruebas de Hooks Personalizados

```typescript
// src/hooks/__tests__/useProjects.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useProjects } from '../useProjects'

// Mock data
const mockProjects = [
  {
    id: 1,
    name: 'Test Project',
    description: 'A test project',
    html_url: 'https://github.com/test/project',
    language: 'TypeScript',
    stargazers_count: 42,
    forks_count: 7,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z',
    topics: ['react', 'typescript']
  }
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProjects', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('obtiene proyectos exitosamente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      } as Response),
    )

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockProjects)
    expect(result.current.isLoading).toBe(false)
  })

  it('maneja errores correctamente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      } as Response),
    )

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  it('filtra proyectos excluidos', async () => {
    const projectsWithExcluded = [
      ...mockProjects,
      { ...mockProjects[0], id: 334629076 } // Proyecto excluido
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(projectsWithExcluded),
      } as Response),
    )

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe(1)
  })
})
```

### Pruebas de Utilidades

```typescript
// src/lib/__tests__/animations.test.ts
import { describe, it, expect } from 'vitest'
import { 
  fadeIn, 
  slideIn, 
  staggerChildren, 
  getAnimationDelay 
} from '../animations'

describe('animations', () => {
  describe('fadeIn', () => {
    it('devuelve variantes de animación correctas', () => {
      expect(fadeIn).toEqual({
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      })
    })
  })
  
  describe('slideIn', () => {
    it('devuelve variantes con dirección por defecto', () => {
      const variants = slideIn()
      
      expect(variants.hidden).toEqual({ x: -20, opacity: 0 })
      expect(variants.visible).toEqual({ x: 0, opacity: 1 })
    })
    
    it('acepta dirección personalizada', () => {
      const variants = slideIn('right')
      
      expect(variants.hidden).toEqual({ x: 20, opacity: 0 })
      expect(variants.visible).toEqual({ x: 0, opacity: 1 })
    })
    
    it('acepta distancia personalizada', () => {
      const variants = slideIn('left', 50)
      
      expect(variants.hidden).toEqual({ x: -50, opacity: 0 })
      expect(variants.visible).toEqual({ x: 0, opacity: 1 })
    })
  })
  
  describe('getAnimationDelay', () => {
    it('calcula delay basado en índice', () => {
      expect(getAnimationDelay(0)).toBe(0)
      expect(getAnimationDelay(1)).toBe(0.1)
      expect(getAnimationDelay(2)).toBe(0.2)
    })
    
    it('acepta delay personalizado', () => {
      expect(getAnimationDelay(1, 0.05)).toBe(0.05)
      expect(getAnimationDelay(2, 0.05)).toBe(0.1)
    })
  })
})
```

## 🔗 Pruebas de Integración

### Pruebas de Componentes

```typescript
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { vi } from 'vitest'
import { ProjectCard } from '../ProjectCard'

const mockProject = {
  id: 1,
  name: 'awesome-project',
  description: 'An awesome project built with React and TypeScript',
  html_url: 'https://github.com/user/awesome-project',
  language: 'TypeScript',
  stargazers_count: 42,
  forks_count: 7,
  topics: ['react', 'typescript'],
}

describe('ProjectCard', () => {
  const defaultProps = {
    project: mockProject,
    onCardClick: vi.fn()
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renderiza información del proyecto', () => {
    render(<ProjectCard {...defaultProps} />)
    
    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByText(mockProject.language)).toBeInTheDocument()
  })
  
  it('muestra estadísticas cuando está habilitado', () => {
    render(<ProjectCard {...defaultProps} showStats />)
    
    expect(screen.getByText(mockProject.stargazers_count.toString())).toBeInTheDocument()
    expect(screen.getByText(mockProject.forks_count.toString())).toBeInTheDocument()
  })
  
  it('oculta estadísticas cuando está deshabilitado', () => {
    render(<ProjectCard {...defaultProps} showStats={false} />)
    
    expect(screen.queryByText(mockProject.stargazers_count.toString())).not.toBeInTheDocument()
  })
  
  it('aplica variante de estilo correcta', () => {
    const { rerender } = render(<ProjectCard {...defaultProps} variant="default" />)
    
    expect(screen.getByTestId('project-card')).toHaveClass('project-card-default')
    
    rerender(<ProjectCard {...defaultProps} variant="featured" />)
    
    expect(screen.getByTestId('project-card')).toHaveClass('project-card-featured')
  })
  
  it('maneja clic en tarjeta', () => {
    render(<ProjectCard {...defaultProps} />)
    
    fireEvent.click(screen.getByTestId('project-card'))
    
    expect(defaultProps.onCardClick).toHaveBeenCalledWith(mockProject)
  })
  
  it('maneja estado de hover', async () => {
    render(<ProjectCard {...defaultProps} />)
    
    const card = screen.getByTestId('project-card')
    
    fireEvent.mouseEnter(card)
    
    await waitFor(() => {
      expect(card).toHaveClass('project-card-hovered')
    })
    
    fireEvent.mouseLeave(card)
    
    await waitFor(() => {
      expect(card).not.toHaveClass('project-card-hovered')
    })
  })
})
```

### Pruebas de Formularios

```typescript
// src/pages/Contact/components/__tests__/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { vi } from 'vitest'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  const mockOnSubmit = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('renderiza todos los campos del formulario', () => {
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })
  
  it('valida campos requeridos', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
  
  it('valida formato de email', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'email-invalido' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email válido/i)).toBeInTheDocument()
    })
  })
  
  it('envía formulario con datos válidos', async () => {
    const formData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Este es un mensaje de prueba'
    }
    
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response),
    )

    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: formData.name }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: formData.email }
    })
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: formData.message }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(formData)
    })
  })
  
  it('muestra estado de carga durante envío', async () => {
    const slowSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(<ContactForm onSubmit={slowSubmit} />)
    
    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Test User' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: 'Test message' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    expect(screen.getByText(/enviando/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    await waitFor(() => {
      expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument()
    })
  })
})
```

## 🌐 Pruebas End-to-End

### Configuración de Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  webServer: {
    command: 'pnpm preview',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Pruebas de Navegación

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navegación', () => {
  test('navega entre páginas principales', async ({ page }) => {
    await page.goto('/')
    
    // Verificar página de inicio
    await expect(page.getByRole('heading', { name: /miguel ángel de dios/i })).toBeVisible()
    
    // Navegar a proyectos
    await page.getByRole('link', { name: /proyectos/i }).click()
    await expect(page).toHaveURL(/\/projects/)
    await expect(page.getByRole('heading', { name: /mis proyectos/i })).toBeVisible()
    
    // Navegar a acerca de
    await page.getByRole('link', { name: /acerca de/i }).click()
    await expect(page).toHaveURL(/\/about/)
    await expect(page.getByRole('heading', { name: /acerca de/i })).toBeVisible()
    
    // Navegar a contacto
    await page.getByRole('link', { name: /contacto/i }).click()
    await expect(page).toHaveURL(/\/contact/)
    await expect(page.getByRole('heading', { name: /hablemos/i })).toBeVisible()
  })
  
  test('funciona en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Abrir menú móvil
    await page.getByRole('button', { name: /alternar menú/i }).click()
    
    // Verificar que el menú es visible
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Navegar usando menú móvil
    await page.getByRole('link', { name: /proyectos/i }).click()
    await expect(page).toHaveURL(/\/projects/)
  })
})
```

### Pruebas de Formulario de Contacto

```typescript
// e2e/contact-form.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Formulario de Contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })
  
  test('envía formulario exitosamente', async ({ page }) => {
    // Llenar formulario
    await page.getByLabel(/nombre/i).fill('Juan Pérez')
    await page.getByLabel(/email/i).fill('juan@example.com')
    await page.getByLabel(/mensaje/i).fill('Este es un mensaje de prueba')
    
    // Interceptar solicitud
    await page.route('**/api/contact', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      })
    })
    
    // Enviar formulario
    await page.getByRole('button', { name: /enviar/i }).click()
    
    // Verificar mensaje de éxito
    await expect(page.getByText(/mensaje enviado exitosamente/i)).toBeVisible()
  })
  
  test('muestra errores de validación', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.getByRole('button', { name: /enviar/i }).click()
    
    // Verificar errores de validación
    await expect(page.getByText(/el nombre es requerido/i)).toBeVisible()
    await expect(page.getByText(/el email es requerido/i)).toBeVisible()
    await expect(page.getByText(/el mensaje es requerido/i)).toBeVisible()
  })
  
  test('valida formato de email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('email-invalido')
    await page.getByRole('button', { name: /enviar/i }).click()
    
    await expect(page.getByText(/email válido/i)).toBeVisible()
  })
})
```

### Pruebas de Rendimiento

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Rendimiento', () => {
  test('carga página inicial rápidamente', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Esperar a que el contenido principal sea visible
    await expect(page.getByRole('heading', { name: /miguel ángel de dios/i })).toBeVisible()
    
    const loadTime = Date.now() - startTime
    
    // Verificar que carga en menos de 3 segundos
    expect(loadTime).toBeLessThan(3000)
  })
  
  test('métricas de Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Obtener métricas de rendimiento
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const metrics = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              metrics.fcp = entry.firstContentfulPaint
              metrics.lcp = entry.largestContentfulPaint
            }
          })
          
          resolve(metrics)
        }).observe({ entryTypes: ['navigation', 'paint'] })
      })
    })
    
    expect(metrics.fcp).toBeLessThan(1800) // FCP < 1.8s
    expect(metrics.lcp).toBeLessThan(2500) // LCP < 2.5s
  })
})
```

## 🎯 Mocking y Fixtures

### Mocking de APIs con `fetch`

El proyecto no usa MSW. Las llamadas a la API se mockean stubbeando el `fetch` global con `vi.fn()` / `vi.stubGlobal('fetch', ...)` y mockeando módulos con `vi.mock(...)`.

```typescript
// Ejemplo: stub de fetch para una prueba
import { vi } from 'vitest'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response),
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

Para sobrescribir el comportamiento en una prueba concreta, vuelve a stubbear `fetch` dentro del test o usa `vi.mocked(fetch).mockResolvedValueOnce(...)`.

### Mocking de Módulos

```typescript
import { vi } from 'vitest'

// Mock de un módulo completo
vi.mock('@/services/projects', () => ({
  fetchProjects: vi.fn().mockResolvedValue([{ id: 1, name: 'mock-project' }]),
}))
```

### Fixtures de Datos

Los datos de prueba se definen inline dentro de cada test (o en un archivo co-localizado junto al test). No existe un directorio `src/test/mocks/`.

```typescript
// Datos de ejemplo definidos inline en el test
import type { GitHubProject } from '@/types'

const mockProject: GitHubProject = {
  id: 1,
  name: 'awesome-project',
  full_name: 'user/awesome-project',
  description: 'An awesome project built with React and TypeScript',
  html_url: 'https://github.com/user/awesome-project',
  homepage: 'https://awesome-project.vercel.app',
  language: 'TypeScript',
  stargazers_count: 42,
  forks_count: 7,
  watchers_count: 42,
  size: 1024,
  default_branch: 'main',
  open_issues_count: 2,
  topics: ['react', 'typescript', 'vite', 'tailwindcss'],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-12-01T00:00:00Z',
  pushed_at: '2023-12-01T00:00:00Z',
  private: false,
  fork: false,
  archived: false,
  disabled: false
}

const mockProjects: GitHubProject[] = [
  mockProject,
  {
    ...mockProject,
    id: 2,
    name: 'portfolio-website',
    description: 'Personal portfolio website',
    language: 'JavaScript',
    stargazers_count: 15,
    forks_count: 3,
    topics: ['portfolio', 'react', 'javascript']
  }
]
```

## 📊 Cobertura de Código

### Configuración de Umbrales

```typescript
// vite.config.ts (el bloque `test`) - configuración de cobertura
export default defineConfig(() => ({
  test: {
    coverage: {
      // Umbrales mínimos de cobertura (intencionalmente bajos)
      thresholds: {
        lines: 20,
        functions: 15,
        branches: 15,
        statements: 20,
      },

      // Archivos a incluir / excluir
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
        'src/types/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/i18n/**',
        'src/constants/**',
      ],

      // Reportes de cobertura
      reporter: ['text', 'json', 'html', 'lcov'],
    }
  }
}))
```

> Nota: los umbrales enforceados por la configuración son bajos (líneas/sentencias 20%, funciones/ramas 15%) para mantener el CI en verde mientras la cobertura crece. Los objetivos más altos (90%+ en componentes, 95%+ en utils) son aspiracionales, no puertas de CI.

### Scripts de Cobertura

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:coverage:ui": "vitest --ui --coverage"
  }
}
```

## 🔧 Herramientas de Debug

### Debug de Pruebas en VS Code

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Utilidades de Debug

```typescript
// src/test/debug.ts
import { screen } from '@testing-library/react'

export const debugComponent = () => {
  screen.debug(undefined, 300000) // Imprimir DOM completo
}

export const debugQueries = () => {
  console.log('Queries disponibles:', screen.queryAllByText(''))
}

export const waitForDebug = (timeout = 5000) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}
```

## 📝 Mejores Prácticas

### Principios de Pruebas

1. **Prueba comportamiento, no implementación**
2. **Escribe pruebas legibles y mantenibles**
3. **Usa AAA: Arrange, Act, Assert**
4. **Una sola aserción por prueba cuando sea posible**
5. **Nombres descriptivos de pruebas**

### Patrones de Pruebas

```typescript
// ✅ Buena práctica
describe('ContactForm', () => {
  it('muestra error cuando el email es inválido', async () => {
    // Arrange
    render(<ContactForm />)
    
    // Act
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'email-invalido' }
    })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/email válido/i)).toBeInTheDocument()
    })
  })
})

// ❌ Mala práctica
it('prueba todo el formulario', () => {
  // Prueba demasiado en una sola función
  // Difícil de debuggear cuando falla
})
```

### Organización de Archivos de Prueba

```text
src/
├── components/
│   ├── ProjectCard.tsx
│   └── __tests__/
│       └── ProjectCard.test.tsx
├── hooks/
│   ├── useProjects.ts
│   └── __tests__/
│       └── useProjects.test.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── i18n-for-tests.ts
```

Esta guía de pruebas proporciona un marco completo para mantener alta calidad de código a través de testing efectivo. Para más detalles sobre configuración específica, consulta los archivos de configuración en el directorio raíz del proyecto.
