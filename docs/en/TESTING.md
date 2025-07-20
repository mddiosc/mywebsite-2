# Testing Documentation

This document provides comprehensive information about the testing strategy, frameworks, patterns, and best practices used in the Miguel Ángel de Dios portfolio project.

## 🧪 Testing Strategy

The project follows a comprehensive testing approach with multiple levels:

1. **Unit Tests**: Individual component and utility function testing
2. **Integration Tests**: Feature-level testing with multiple components
3. **End-to-End Tests**: Complete user journey testing
4. **Visual Regression Tests**: UI consistency verification

## 🛠️ Testing Stack

### Core Testing Tools

- **Vitest**: Fast unit test runner with native ES modules support
- **React Testing Library**: Component testing utilities following best practices
- **jsdom**: DOM environment for browser simulation
- **@testing-library/jest-dom**: Additional matchers for DOM assertions

### Additional Testing Tools

- **MSW (Mock Service Worker)**: API mocking for realistic testing
- **@testing-library/user-event**: User interaction simulation
- **Playwright**: End-to-end testing framework (future implementation)

## ⚙️ Configuration

### Vitest Configuration

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup

**File**: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock window.matchMedia
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
```

## 📁 Test Organization

### File Structure

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── Navbar/
│       ├── Navbar.tsx
│       └── Navbar.test.tsx
├── pages/
│   ├── Home/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.test.tsx
│   │   └── Home.test.tsx
│   └── Projects/
│       ├── hooks/
│       │   ├── useProjects.ts
│       │   └── useProjects.test.tsx
│       └── components/
│           ├── ProjectCard.tsx
│           └── ProjectCard.test.tsx
├── utils/
│   ├── dateUtils.ts
│   └── dateUtils.test.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── handlers.ts
        └── server.ts
```

### Naming Conventions

- **Test files**: `ComponentName.test.tsx` or `functionName.test.ts`
- **Test utilities**: `test-utils.tsx`
- **Mock data**: `mockData.ts`
- **Test setup**: `setup.ts`

## 🧪 Testing Patterns

### Component Testing

#### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
  
  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
```

#### Component with Props Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProjectCard from './ProjectCard'

describe('ProjectCard Component', () => {
  const mockProject = {
    id: 1,
    name: 'test-project',
    description: 'Test project description',
    html_url: 'https://github.com/user/test-project',
    stargazers_count: 42,
    language: 'TypeScript',
    topics: ['react', 'typescript'],
    updated_at: '2023-12-01T00:00:00Z',
  }
  
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} delay={0} />)
    
    expect(screen.getByText('test-project')).toBeInTheDocument()
    expect(screen.getByText('Test project description')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
  
  it('renders project topics', () => {
    render(<ProjectCard project={mockProject} delay={0} />)
    
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })
  
  it('handles external link correctly', () => {
    render(<ProjectCard project={mockProject} delay={0} />)
    
    const projectLink = screen.getByRole('link', { name: 'test-project' })
    expect(projectLink).toHaveAttribute('href', 'https://github.com/user/test-project')
    expect(projectLink).toHaveAttribute('target', '_blank')
  })
})
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProjects } from './useProjects'

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProjects Hook', () => {
  it('fetches projects successfully', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    })
    
    expect(result.current.isLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })
  })
  
  it('handles error state', async () => {
    // Mock API to return error
    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    })
    
    await waitFor(() => {
      if (result.current.error) {
        expect(result.current.error).toBeInstanceOf(Error)
      }
    })
  })
})
```

### Utility Function Testing

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate, calculateProjectStatistics } from './utils'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly in English', () => {
      const date = new Date('2023-12-25T00:00:00Z')
      const formatted = formatDate(date, 'en')
      
      expect(formatted).toBe('December 25, 2023')
    })
    
    it('formats date correctly in Spanish', () => {
      const date = new Date('2023-12-25T00:00:00Z')
      const formatted = formatDate(date, 'es')
      
      expect(formatted).toBe('25 de diciembre de 2023')
    })
    
    it('handles invalid dates', () => {
      const invalidDate = new Date('invalid')
      const formatted = formatDate(invalidDate, 'en')
      
      expect(formatted).toBe('Invalid Date')
    })
  })
})

describe('Project Utils', () => {
  describe('calculateProjectStatistics', () => {
    it('calculates statistics correctly', () => {
      const projects = [
        { 
          stargazers_count: 10, 
          forks_count: 5, 
          topics: ['react', 'typescript'],
          language: 'TypeScript',
          homepage: 'https://example.com'
        },
        { 
          stargazers_count: 20, 
          forks_count: 8, 
          topics: ['vue', 'javascript'],
          language: 'JavaScript',
          homepage: null
        },
      ]
      
      const stats = calculateProjectStatistics(projects)
      
      expect(stats.totalProjects).toBe(2)
      expect(stats.totalStars).toBe(30)
      expect(stats.totalForks).toBe(13)
      expect(stats.uniqueTechnologies).toBe(2)
      expect(stats.projectsWithDemos).toBe(1)
    })
  })
})
```

## 🎭 Mocking Strategies

### API Mocking with MSW

**File**: `src/test/mocks/handlers.ts`

```typescript
import { rest } from 'msw'

export const handlers = [
  // Mock GitHub API
  rest.get('https://api.github.com/users/:username/repos', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'mock-project',
          description: 'Mock project description',
          html_url: 'https://github.com/user/mock-project',
          stargazers_count: 42,
          forks_count: 8,
          language: 'TypeScript',
          topics: ['react', 'typescript'],
          updated_at: '2023-12-01T00:00:00Z',
          homepage: 'https://mock-project.com',
        },
      ])
    )
  }),
  
  // Mock contact form submission
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, message: 'Message sent successfully' })
    )
  }),
]
```

**File**: `src/test/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### Component Mocking

```typescript
import { vi } from 'vitest'

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock React Router
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/en/home' }),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}))
```

## 📊 Test Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
```

### Coverage Goals

- **Components**: 90%+ coverage
- **Utils**: 95%+ coverage
- **Hooks**: 85%+ coverage
- **Integration**: 70%+ coverage

## 🎯 Testing Best Practices

### Writing Effective Tests

1. **Test behavior, not implementation**

   ```typescript
   // ❌ Bad: Testing implementation details
   expect(component.state.isLoading).toBe(true)
   
   // ✅ Good: Testing user-visible behavior
   expect(screen.getByRole('progressbar')).toBeInTheDocument()
   ```

2. **Use semantic queries**

   ```typescript
   // ❌ Bad: Using data-testid unnecessarily
   screen.getByTestId('submit-button')
   
   // ✅ Good: Using semantic queries
   screen.getByRole('button', { name: /submit/i })
   ```

3. **Test error states**

   ```typescript
   it('displays error message when API fails', async () => {
     // Mock API to fail
     server.use(
       rest.get('/api/projects', (req, res, ctx) => {
         return res(ctx.status(500))
       })
     )
     
     render(<ProjectsList />)
     
     await waitFor(() => {
       expect(screen.getByText(/error loading projects/i)).toBeInTheDocument()
     })
   })
   ```

4. **Test accessibility**

   ```typescript
   it('is accessible', () => {
     render(<ContactForm />)
     
     // Check for proper labels
     expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
     expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
     
     // Check for keyboard navigation
     const submitButton = screen.getByRole('button', { name: /submit/i })
     expect(submitButton).not.toHaveAttribute('tabindex', '-1')
   })
   ```

### Test Organization

```typescript
describe('ProjectCard Component', () => {
  // Group related tests
  describe('rendering', () => {
    it('renders project name', () => {})
    it('renders project description', () => {})
  })
  
  describe('interactions', () => {
    it('handles click events', () => {})
    it('handles keyboard navigation', () => {})
  })
  
  describe('edge cases', () => {
    it('handles missing data', () => {})
    it('handles long text content', () => {})
  })
})
```

## 🔧 Testing Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Open Vitest UI
pnpm test:ui

# Run specific test file
pnpm test ProjectCard.test.tsx

# Run tests matching pattern
pnpm test --grep="renders correctly"
```

## 🚀 Continuous Integration

### GitHub Actions Configuration

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test:ci
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

## 🐛 Debugging Tests

### Common Debugging Techniques

1. **Use screen.debug()**

   ```typescript
   it('should render correctly', () => {
     render(<MyComponent />)
     screen.debug() // Prints DOM to console
   })
   ```

2. **Query debugging**

   ```typescript
   it('finds element correctly', () => {
     render(<MyComponent />)
     
     // This will log all available queries
     screen.getByRole('button', { name: /submit/i })
     // If not found, suggests alternative queries
   })
   ```

3. **Async debugging**

   ```typescript
   it('handles async operations', async () => {
     render(<AsyncComponent />)
     
     // Debug what's rendered before waiting
     screen.debug()
     
     await waitFor(() => {
       screen.debug() // Debug after async operation
       expect(screen.getByText('Loaded')).toBeInTheDocument()
     })
   })
   ```

## 📚 Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [MSW Documentation](https://mswjs.io/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

This testing documentation should be updated as new testing patterns emerge and the testing strategy evolves.
