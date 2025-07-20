# Development Guide

This guide provides comprehensive information for developers working on the Miguel Ángel de Dios portfolio project, including setup, workflows, coding standards, and best practices.

## 🚀 Getting Started

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended package manager)
- **Git**: v2.30.0 or higher
- **VS Code**: Recommended IDE with extensions

### Required VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "yoavbls.pretty-ts-errors"
  ]
}
```

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/mddiosc/mywebsite-2.git
   cd mywebsite-2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   ```env
   # GitHub API (for projects showcase)
   VITE_GITHUB_TOKEN=your_github_token_here
   
   # reCAPTCHA (for contact form)
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   
   # Email service configuration
   VITE_EMAIL_SERVICE_URL=your_email_service_url
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

## 🛠️ Development Workflow

### Branch Strategy

We follow the Git Flow branching model:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature development branches
- **hotfix/**: Critical bug fixes
- **release/**: Release preparation branches

### Branch Naming Convention

```text
feature/feature-name       # New features
bugfix/bug-description     # Bug fixes
hotfix/critical-fix        # Critical fixes
docs/documentation-update  # Documentation changes
refactor/code-improvement  # Code refactoring
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding missing tests
- **chore**: Changes to build process or auxiliary tools

#### Examples

```bash
feat(projects): add GitHub API integration
fix(contact): resolve form validation issue
docs(readme): update installation instructions
style(navbar): improve responsive design
```

### Development Scripts

```bash
# Development
pnpm dev                 # Start development server with HMR
pnpm dev:host           # Start dev server accessible on network
pnpm build              # Build for production
pnpm preview            # Preview production build locally

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues automatically
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
pnpm type-check         # TypeScript type checking

# Testing
pnpm test               # Run test suite
pnpm test:watch         # Run tests in watch mode
pnpm test:coverage      # Run tests with coverage report
pnpm test:ui            # Open Vitest UI

# Git Hooks
pnpm prepare            # Setup Husky git hooks
```

## 📋 Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration**

   ```typescript
   // ✅ Good: Explicit typing
   interface UserData {
     id: number
     name: string
     email: string
   }
   
   const fetchUser = async (id: number): Promise<UserData> => {
     // Implementation
   }
   
   // ❌ Avoid: Any types
   const fetchUser = async (id: any): Promise<any> => {
     // Implementation
   }
   ```

2. **Define interfaces for all data structures**

   ```typescript
   // Component props interface
   interface ProjectCardProps {
     project: GitHubProject
     delay: number
     className?: string
   }
   
   // API response interface
   interface GitHubProject {
     id: number
     name: string
     description: string | null
     html_url: string
     stargazers_count: number
     language: string | null
   }
   ```

3. **Use utility types when appropriate**

   ```typescript
   // Pick specific properties
   type ProjectPreview = Pick<GitHubProject, 'id' | 'name' | 'description'>
   
   // Make properties optional
   type PartialProject = Partial<GitHubProject>
   
   // Exclude specific properties
   type ProjectWithoutId = Omit<GitHubProject, 'id'>
   ```

### React Component Guidelines

1. **Use functional components with hooks**

   ```typescript
   // ✅ Good: Functional component with TypeScript
   interface HomePageProps {
     initialData?: HomeData
   }
   
   const HomePage: React.FC<HomePageProps> = ({ initialData }) => {
     const [data, setData] = useState(initialData)
     
     return <div>{/* Component JSX */}</div>
   }
   
   export default HomePage
   ```

2. **Custom hooks for reusable logic**

   ```typescript
   // Custom hook for data fetching
   export const useProjects = (options?: UseQueryOptions) => {
     return useQuery({
       queryKey: ['projects'],
       queryFn: fetchProjects,
       ...options,
     })
   }
   
   // Usage in component
   const ProjectsPage = () => {
     const { data, isLoading, error } = useProjects()
     // Component logic
   }
   ```

3. **Prop validation and default values**

   ```typescript
   interface ButtonProps {
     children: React.ReactNode
     variant?: 'primary' | 'secondary'
     size?: 'sm' | 'md' | 'lg'
     onClick?: () => void
   }
   
   const Button: React.FC<ButtonProps> = ({
     children,
     variant = 'primary',
     size = 'md',
     onClick,
   }) => {
     // Component implementation
   }
   ```

### CSS and Styling Guidelines

1. **Use Tailwind CSS utility classes**

   ```tsx
   // ✅ Good: Utility classes
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold text-gray-900">Title</h2>
     <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
       Action
     </button>
   </div>
   ```

2. **Use consistent spacing and sizing**

   ```tsx
   // Use Tailwind's spacing scale
   className="p-4 mb-6 mt-8"        // 16px, 24px, 32px
   className="space-y-4"            // 16px vertical spacing
   className="gap-x-6 gap-y-4"     // 24px horizontal, 16px vertical
   ```

3. **Responsive design patterns**

   ```tsx
   // Mobile-first responsive design
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     {/* Grid items */}
   </div>
   
   // Text sizing
   <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
     Responsive Title
   </h1>
   ```

### File Organization Standards

1. **Component file structure**

   ```text
   ComponentName/
   ├── index.tsx              # Main component
   ├── ComponentName.test.tsx # Component tests
   ├── ComponentName.types.ts # TypeScript types
   ├── ComponentName.styles.ts # Styled components (if needed)
   └── hooks/                 # Component-specific hooks
       └── useComponentName.ts
   ```

2. **Import order and grouping**

   ```typescript
   // 1. React and React-related imports
   import React, { useState, useEffect } from 'react'
   import { useTranslation } from 'react-i18next'
   
   // 2. Third-party library imports
   import { motion } from 'framer-motion'
   import { useQuery } from '@tanstack/react-query'
   
   // 3. Internal imports (components, hooks, utils)
   import { Button } from '@/components'
   import { useProjects } from '@/hooks'
   import { fadeIn, smoothTransition } from '@/lib/animations'
   
   // 4. Type imports (at the end)
   import type { GitHubProject } from '@/types'
   ```

3. **Export patterns**

   ```typescript
   // Named exports for utilities and hooks
   export const useProjects = () => { /* ... */ }
   export const formatDate = (date: Date) => { /* ... */ }
   
   // Default export for components
   const ProjectCard: React.FC<ProjectCardProps> = (props) => {
     // Component implementation
   }
   
   export default ProjectCard
   
   // Re-export from index files
   export { default as ProjectCard } from './ProjectCard'
   export { default as ProjectGrid } from './ProjectGrid'
   ```

## 🧪 Testing Guidelines

### Testing Strategy

1. **Unit Tests**: Test individual components and utilities
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows

### Writing Tests

1. **Component testing with React Testing Library**

   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react'
   import { describe, it, expect, vi } from 'vitest'
   import Button from './Button'
   
   describe('Button Component', () => {
     it('renders with correct text', () => {
       render(<Button>Click me</Button>)
       expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
     })
     
     it('calls onClick handler when clicked', () => {
       const handleClick = vi.fn()
       render(<Button onClick={handleClick}>Click me</Button>)
       
       fireEvent.click(screen.getByRole('button'))
       expect(handleClick).toHaveBeenCalledTimes(1)
     })
   })
   ```

2. **Hook testing**

   ```typescript
   import { renderHook, waitFor } from '@testing-library/react'
   import { useProjects } from './useProjects'
   
   describe('useProjects Hook', () => {
     it('fetches projects successfully', async () => {
       const { result } = renderHook(() => useProjects())
       
       await waitFor(() => {
         expect(result.current.isLoading).toBe(false)
         expect(result.current.data).toBeDefined()
       })
     })
   })
   ```

3. **Utility function testing**

   ```typescript
   import { describe, it, expect } from 'vitest'
   import { formatDate } from './dateUtils'
   
   describe('formatDate', () => {
     it('formats date correctly', () => {
       const date = new Date('2023-12-25')
       const formatted = formatDate(date)
       expect(formatted).toBe('December 25, 2023')
     })
   })
   ```

### Test Organization

```text
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx
├── hooks/
│   ├── useProjects.ts
│   └── useProjects.test.ts
└── utils/
    ├── dateUtils.ts
    └── dateUtils.test.ts
```

## 🔧 Tools and Configuration

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### ESLint Configuration

Key ESLint rules in `eslint.config.js`:

```javascript
export default [
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]
```

### Prettier Configuration

Create `prettier.config.cjs`:

```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
}
```

## 🚀 Performance Guidelines

### Code Optimization

1. **Lazy loading for route components**

   ```typescript
   import { lazy, Suspense } from 'react'
   
   const ProjectsPage = lazy(() => import('./pages/Projects'))
   
   <Suspense fallback={<LoadingSpinner />}>
     <ProjectsPage />
   </Suspense>
   ```

2. **Memoization for expensive operations**

   ```typescript
   import { useMemo, useCallback } from 'react'
   
   const ProjectsGrid = ({ projects, filters }) => {
     const filteredProjects = useMemo(() => {
       return projects.filter(project => 
         filters.language ? project.language === filters.language : true
       )
     }, [projects, filters.language])
     
     const handleProjectClick = useCallback((project) => {
       // Handle click
     }, [])
     
     return (
       // Component JSX
     )
   }
   ```

3. **Image optimization**

   ```tsx
   // Use appropriate image formats and sizes
   <img
     src="/images/project-screenshot.webp"
     alt="Project screenshot"
     loading="lazy"
     width={400}
     height={300}
   />
   ```

### Bundle Optimization

1. **Analyze bundle size**

   ```bash
   pnpm build
   pnpm run analyze  # If bundle analyzer is configured
   ```

2. **Import only what you need**

   ```typescript
   // ✅ Good: Named imports
   import { motion } from 'framer-motion'
   import { format } from 'date-fns'
   
   // ❌ Avoid: Entire library imports
   import * as framerMotion from 'framer-motion'
   import dateFns from 'date-fns'
   ```

## 🐛 Debugging Guidelines

### Development Debugging

1. **Use React Developer Tools**
2. **Enable React Query Devtools in development**
3. **Use browser debugger with source maps**

### Error Handling

```typescript
// Error boundaries for catching React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    
    return this.props.children
  }
}
```

### Logging

```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  },
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Testing Library Documentation](https://testing-library.com/)
- [Vite Guide](https://vitejs.dev/guide/)

---

This development guide should be updated as the project evolves. For specific implementation details, refer to the component documentation and API guides.
