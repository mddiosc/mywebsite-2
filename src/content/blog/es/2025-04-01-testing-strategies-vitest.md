---
title: "Testing en el mundo real: Estrategias pragmáticas con Vitest"
description: "Una guía práctica sobre testing en React con Vitest. Qué testear, qué no testear, y cómo crear una estrategia de testing que realmente agregue valor sin ralentizar el desarrollo."
date: "2025-04-01"
tags: ["testing", "vitest", "react", "pragmatic", "quality-assurance"]
author: "Miguel Ángel de Dios"
slug: "testing-strategies-vitest"
featured: true
---

Testing no es sobre alcanzar 100% de coverage. Es sobre **confianza** - confianza en que tu código funciona, en que los cambios no rompen funcionalidad existente, y en que puedes refactorizar sin miedo. En este post, compartiré mi enfoque pragmático para testing en React con Vitest.

## La filosofía del testing pragmático

Después de trabajar en proyectos donde los tests eran más un obstáculo que una ayuda, desarrollé estas reglas:

### **Principios fundamentales**

1. **Testa el comportamiento, no la implementación**
2. **Más integración, menos aislamiento**
3. **Los tests deben ser más simple que el código que testan**
4. **Coverage no es el objetivo, confianza sí**

### **Qué testear (en orden de prioridad)**

```typescript
// Pirámide de testing pragmática
const testingPriorities = {
  high: [
    'Business logic crítica',
    'Flujos de usuario principales', 
    'Funciones puras complejas',
    'Hooks personalizados con estado'
  ],
  medium: [
    'Componentes con lógica condicional',
    'Integraciones con APIs',
    'Validaciones de formularios',
    'Utilities y helpers'
  ],
  low: [
    'Componentes puramente presentacionales',
    'Estilos y CSS',
    'Configuraciones estáticas'
  ]
}
```

## Configuración optimizada de Vitest

### **Setup base con React Testing Library**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true, // Para testear clases CSS
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts', // Archivos de barrel exports
        'src/main.tsx' // Entry point
      ],
      thresholds: {
        global: {
          branches: 70, // Pragmático, no 100%
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### **Setup file optimizado**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import './i18n-for-tests'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup después de cada test
afterEach(() => {
  cleanup()
})

// Mock de IntersectionObserver (común en componentes con lazy loading)
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

// Mock de matchMedia (para responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock de ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})
```

## Testing de hooks personalizados

### **Hook de ejemplo con estado complejo**

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

### **Test del hook con todos los edge cases**

```typescript
// hooks/__tests__/useLocalStorage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default')
  })

  it('should initialize with value from localStorage when available', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('updated-value')
    })
    
    expect(result.current[0]).toBe('updated-value')
    expect(localStorage.getItem('test-key')).toBe('"updated-value"')
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
  })

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json')
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })

  it('should handle localStorage write errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock localStorage.setItem to throw
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage full')
    })
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    )
    
    // Restore
    Storage.prototype.setItem = originalSetItem
    consoleSpy.mockRestore()
  })
})
```

## Testing de componentes con dependencias externas

### **Componente con React Query y i18n**

```typescript
// components/UserProfile.tsx
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../api/users'

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const { t } = useTranslation('users')
  const { 
    data: user, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId
  })

  if (isLoading) return <div data-testid="loading">{t('loading')}</div>
  if (error) return <div data-testid="error">{t('error.fetchFailed')}</div>
  if (!user) return <div data-testid="not-found">{t('notFound')}</div>

  return (
    <div data-testid="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <span data-testid="role">{t(`roles.${user.role}`)}</span>
    </div>
  )
}
```

### **Test helper para providers**

```typescript
// test/utils.tsx
import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n-for-tests'

interface ProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
}

function Providers({ children, queryClient }: ProvidersProps) {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Avoid retries in tests
        cacheTime: 0, // Disable caching
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient || defaultQueryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: {
    queryClient?: QueryClient
    [key: string]: any
  }
) {
  const { queryClient, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <Providers queryClient={queryClient}>{children}</Providers>
    ),
    ...renderOptions,
  })
}
```

### **Test del componente con mocking estratégico**

```typescript
// components/__tests__/UserProfile.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import { renderWithProviders } from '../../test/utils'
import { UserProfile } from '../UserProfile'
import * as usersApi from '../../api/users'

// Mock solo la API, no React Query ni i18n
vi.mock('../../api/users')

const mockFetchUser = vi.mocked(usersApi.fetchUser)

describe('UserProfile', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
      },
    })
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    mockFetchUser.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithProviders(<UserProfile userId="123" />, { queryClient })
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should display user data when loaded successfully', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin'
    }
    
    mockFetchUser.mockResolvedValue(mockUser)
    
    renderWithProviders(<UserProfile userId="123" />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument()
    })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('role')).toHaveTextContent('Administrator')
  })

  it('should show error when fetch fails', async () => {
    mockFetchUser.mockRejectedValue(new Error('API Error'))
    
    renderWithProviders(<UserProfile userId="123" />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
  })

  it('should not fetch when userId is empty', () => {
    renderWithProviders(<UserProfile userId="" />, { queryClient })
    
    expect(mockFetchUser).not.toHaveBeenCalled()
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
```

## Testing de formularios complejos

### **Hook de formulario con validación**

```typescript
// hooks/useContactForm.ts
import { useState } from 'react'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactForm = z.infer<typeof contactSchema>

export function useContactForm() {
  const [values, setValues] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: keyof ContactForm, value: string) => {
    try {
      contactSchema.shape[name].parse(value)
      setErrors(prev => ({ ...prev, [name]: undefined }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }))
      }
      return false
    }
  }

  const handleChange = (name: keyof ContactForm, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      validateField(name, value)
    }
  }

  const handleSubmit = async (onSubmit: (data: ContactForm) => Promise<void>) => {
    const result = contactSchema.safeParse(values)
    
    if (!result.success) {
      const fieldErrors = result.error.errors.reduce((acc, err) => {
        const field = err.path[0] as keyof ContactForm
        acc[field] = err.message
        return acc
      }, {} as Record<keyof ContactForm, string>)
      
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    setIsSubmitting(true)
    
    try {
      await onSubmit(result.data)
      return true
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField
  }
}
```

### **Test completo del formulario**

```typescript
// hooks/__tests__/useContactForm.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactForm } from '../useContactForm'

describe('useContactForm', () => {
  it('should initialize with empty values and no errors', () => {
    const { result } = renderHook(() => useContactForm())
    
    expect(result.current.values).toEqual({
      name: '',
      email: '',
      message: ''
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should update values when handleChange is called', () => {
    const { result } = renderHook(() => useContactForm())
    
    act(() => {
      result.current.handleChange('name', 'John Doe')
    })
    
    expect(result.current.values.name).toBe('John Doe')
  })

  it('should validate field and show errors', () => {
    const { result } = renderHook(() => useContactForm())
    
    act(() => {
      result.current.validateField('email', 'invalid-email')
    })
    
    expect(result.current.errors.email).toBe('Invalid email address')
  })

  it('should clear error when field becomes valid', () => {
    const { result } = renderHook(() => useContactForm())
    
    // Set invalid value first
    act(() => {
      result.current.validateField('email', 'invalid')
    })
    expect(result.current.errors.email).toBeDefined()
    
    // Then set valid value
    act(() => {
      result.current.validateField('email', 'test@example.com')
    })
    expect(result.current.errors.email).toBeUndefined()
  })

  it('should handle form submission with valid data', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useContactForm())
    
    // Set valid data
    act(() => {
      result.current.handleChange('name', 'John Doe')
      result.current.handleChange('email', 'john@example.com') 
      result.current.handleChange('message', 'This is a test message')
    })
    
    let submitResult: boolean
    await act(async () => {
      submitResult = await result.current.handleSubmit(mockSubmit)
    })
    
    expect(submitResult).toBe(true)
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    })
  })

  it('should prevent submission with invalid data and show errors', async () => {
    const mockSubmit = vi.fn()
    const { result } = renderHook(() => useContactForm())
    
    // Submit with empty data (invalid)
    let submitResult: boolean
    await act(async () => {
      submitResult = await result.current.handleSubmit(mockSubmit)
    })
    
    expect(submitResult).toBe(false)
    expect(mockSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBe('Name must be at least 2 characters')
    expect(result.current.errors.email).toBe('Invalid email address')
    expect(result.current.errors.message).toBe('Message must be at least 10 characters')
  })

  it('should handle submission errors gracefully', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useContactForm())
    
    // Set valid data
    act(() => {
      result.current.handleChange('name', 'John Doe')
      result.current.handleChange('email', 'john@example.com')
      result.current.handleChange('message', 'This is a test message')
    })
    
    await act(async () => {
      await result.current.handleSubmit(mockSubmit)
    })
    
    expect(result.current.isSubmitting).toBe(false)
  })
})
```

## Integration tests vs Unit tests

### **Cuándo usar cada uno**

```typescript
// Estrategia de testing por tipo
const testingStrategy = {
  unitTests: {
    target: ['Pure functions', 'Custom hooks', 'Utilities'],
    tools: ['Vitest', 'renderHook'],
    benefits: ['Fast', 'Isolated', 'Easy to debug'],
    example: 'Testing useLocalStorage hook in isolation'
  },
  
  integrationTests: {
    target: ['User flows', 'Component + API', 'Form submission'],
    tools: ['Vitest + React Testing Library', 'MSW'],
    benefits: ['Realistic', 'Catches integration bugs', 'User-focused'],
    example: 'Testing complete login flow with API calls'
  },
  
  e2eTests: {
    target: ['Critical user journeys', 'Cross-browser compatibility'],
    tools: ['Playwright', 'Cypress'],
    benefits: ['Complete confidence', 'Real browser testing'],
    example: 'Testing complete purchase flow'
  }
}
```

### **Integration test de flujo completo**

```typescript
// __tests__/contact-flow.integration.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../test/utils'
import { ContactPage } from '../pages/Contact'
import * as contactApi from '../api/contact'

vi.mock('../api/contact')
const mockSendMessage = vi.mocked(contactApi.sendContactMessage)

describe('Contact Flow Integration', () => {
  it('should complete entire contact form submission flow', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockResolvedValue({ success: true })
    
    renderWithProviders(<ContactPage />)
    
    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(
      screen.getByLabelText(/message/i), 
      'This is my test message that is long enough'
    )
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Verify loading state
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
    
    // Verify success state
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
    
    // Verify API was called correctly
    expect(mockSendMessage).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is my test message that is long enough'
    })
    
    // Verify form is reset
    expect(screen.getByLabelText(/name/i)).toHaveValue('')
  })
})
```

## Scripts de testing automatizado

### **Package.json scripts optimizado**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:run": "vitest run",
    "test:affected": "vitest related",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

### **GitHub Actions para testing**

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test:ci
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

## Mi filosofía de testing en la práctica

### **En mi portfolio, testeo:**

```typescript
// Lo que SÍ testeo (alto valor, bajo mantenimiento)
const testsIWrite = [
  'Custom hooks (useLocalStorage, useBlog, useContactForm)',
  'Business logic (formatters, validators, calculators)', 
  'Complex components (ContactForm, BlogPost with dynamic content)',
  'API integrations (error handling, data transformation)',
  'Critical user flows (contact form submission, language switching)'
]

// Lo que NO testeo (bajo valor, alto mantenimiento)  
const testsISkip = [
  'Pure UI components without logic',
  'Third-party library configurations',
  'Static content and translations',
  'Simple utility functions (<5 lines)',
  'Styling and CSS classes'
]
```

### **Métricas que me importan:**

- **Coverage útil**: ~70% (enfocado en lógica crítica)
- **Velocidad**: Tests deben correr en <10 segundos
- **Mantenimiento**: Tests que no requieren actualización frecuente
- **Confianza**: Puedo hacer refactor sin miedo

## Conclusión

El testing efectivo no se trata de números o métricas vanidosas. Se trata de **confianza pragmática**: escribir tests que realmente agreguen valor, que sean fáciles de mantener, y que te permitan desarrollar más rápido, no más lento.

Mi regla de oro: **Si un test no te daría confianza para hacer un deploy un viernes por la tarde, probablemente no vale la pena escribirlo**.

¿Cuál es tu enfoque para testing en React? ¿Has encontrado el balance entre coverage y productividad? Me encantaría conocer tu experiencia a través del [formulario de contacto](/contact).

---

**Recursos recomendados:**

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [MSW (Mock Service Worker)](https://mswjs.io/)
