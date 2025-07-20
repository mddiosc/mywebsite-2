# Architecture Documentation

This document provides a comprehensive overview of the system architecture, design patterns, and
structural decisions made in the Miguel Ángel de Dios portfolio project.

## 🏗️ High-Level Architecture

The portfolio follows a modern, component-based architecture built with React and TypeScript.
The application uses a modular approach with clear separation of concerns, making it
maintainable, scalable, and testable.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Browser/Client Layer                     │
├─────────────────────────────────────────────────────────────┤
│                     React Application                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Router    │ │   i18n      │ │    Global State         │ │
│  │  (Routes)   │ │ (Languages) │ │   (React Query)         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Pages Layer                          │ │
│  │  Home │ Projects │ About │ Contact │ NotFound           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Components Layer                        │ │
│  │  Layout │ Navbar │ Footer │ Page Components             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Utils Layer                          │ │
│  │  Hooks │ Animations │ HTTP Client │ Constants           │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   External Services                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   GitHub    │ │  reCAPTCHA  │ │    Email Service        │ │
│  │     API     │ │   Service   │ │                         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. Component-Based Architecture

The application follows React's component-based architecture with clear separation:

- **Layout Components**: Navbar, Footer, Layout wrapper
- **Page Components**: Home, Projects, About, Contact, NotFound
- **Feature Components**: Project cards, contact forms, technology grids
- **UI Components**: Reusable elements like buttons, modals, skeletons

### 2. Atomic Design Pattern

Components are organized following atomic design principles:

```text
Components/
├── Atoms/          # Basic building blocks (buttons, inputs)
├── Molecules/      # Simple groups of atoms (form fields, cards)
├── Organisms/      # Complex UI components (navbar, project grid)
└── Templates/      # Page layouts and structures
```

### 3. Feature-Based Structure

Each page is organized as a self-contained feature module:

```text
pages/
├── Home/
│   ├── index.tsx           # Main page component
│   ├── types.ts           # TypeScript definitions
│   ├── components/        # Feature-specific components
│   ├── constants/         # Page constants
│   └── hooks/            # Custom hooks
├── Projects/
├── About/
└── Contact/
```

## 🛠️ Technical Architecture

### Frontend Stack

#### Core Framework

- **React 19.0**: Latest React with concurrent features
- **TypeScript 5.6**: Full type safety and enhanced DX
- **Vite 6.0**: Modern build tool with HMR

#### Routing

- **React Router 7.2**: Client-side routing with nested routes
- **Route-based code splitting**: Automatic bundle optimization
- **Language-aware routing**: URL structure supports i18n

#### State Management

1. **Local State**: React useState and useReducer
2. **Server State**: TanStack Query (React Query)
3. **Global State**: Context API for theme and settings
4. **Form State**: React Hook Form for complex forms

#### Styling Architecture

- **Tailwind CSS 4.0**: Utility-first CSS framework
- **CSS Custom Properties**: Dynamic theming support
- **Component-scoped styles**: Modular CSS approach
- **Responsive design**: Mobile-first breakpoints

#### Animation System

- **Framer Motion**: Declarative animations
- **Animation variants**: Reusable animation patterns
- **Performance optimization**: GPU acceleration

### Data Flow Architecture

```text
UI Components
     ↓
Custom Hooks (useProjects, useAboutData)
     ↓
React Query (Server State Management)
     ↓
HTTP Client (Axios)
     ↓
External APIs (GitHub, Email Service)
```

### Component Communication

1. **Props Down**: Data flows down through props
2. **Events Up**: User interactions bubble up through callbacks
3. **Context for Global State**: Shared state through React Context
4. **Custom Hooks**: Reusable stateful logic

## 📁 File Organization

### Project Structure

```text
src/
├── components/              # Shared UI components
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Navbar.tsx          # Navigation component
│   ├── Footer.tsx          # Footer component
│   ├── LanguageSwitcher.tsx # Language toggle
│   └── index.ts            # Component exports
├── pages/                  # Page components
│   ├── Home/               # Home page feature
│   ├── Projects/           # Projects page feature
│   ├── About/              # About page feature
│   ├── Contact/            # Contact page feature
│   ├── NotFound.tsx        # 404 page
│   └── index.ts            # Page exports
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── animations.ts       # Animation configurations
│   ├── axios.ts           # HTTP client setup
│   └── queryClient.ts     # React Query setup
├── locales/               # Translation files
│   ├── en/                # English translations
│   └── es/                # Spanish translations
├── router/                # Routing configuration
│   ├── index.tsx          # Router setup
│   └── routes.tsx         # Route definitions
├── constants/             # Application constants
├── styles/               # Global styles
├── types.ts              # Global TypeScript types
└── main.tsx              # Application entry point
```

### Naming Conventions

- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useProjects.ts`)
- **Types**: PascalCase with descriptive names (`GitHubProject`)
- **Constants**: UPPER_SNAKE_CASE (`ANIMATION_DELAYS`)
- **Files**: camelCase for utilities, PascalCase for components

## 🔄 Data Flow Patterns

### Server State Management

```typescript
// Custom hook encapsulating React Query logic
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    select: (data) => data.filter(project => project.id !== 334629076),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Component consuming the hook
const ProjectsPage = () => {
  const { data: projects, isLoading, error } = useProjects()
  
  if (isLoading) return <ProjectSkeleton />
  if (error) return <ErrorState error={error} />
  
  return <ProjectGrid projects={projects} />
}
```

### Form State Management

```typescript
// Form validation with Zod and React Hook Form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })
  
  const onSubmit = async (data: ContactFormData) => {
    await submitContactForm(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Internationalization Architecture

```typescript
// Translation structure
const translations = {
  en: {
    pages: {
      home: {
        title: "Welcome to My Portfolio",
        subtitle: "Front-End Developer"
      }
    }
  },
  es: {
    pages: {
      home: {
        title: "Bienvenido a Mi Portafolio",
        subtitle: "Desarrollador Front-End"
      }
    }
  }
}

// Usage in components
const HomePage = () => {
  const { t } = useTranslation()
  
  return (
    <h1>{t('pages.home.title')}</h1>
  )
}
```

## 🎨 Animation Architecture

### Animation System Design

The application uses a centralized animation system with Framer Motion:

```typescript
// Reusable animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

// Animation configuration
export const smoothTransition = {
  duration: 0.6,
  ease: [0.645, 0.045, 0.355, 1.000]
}

// Usage in components
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeIn}
  transition={smoothTransition}
>
  Content
</motion.div>
```

## 🔒 Security Architecture

### Client-Side Security

1. **Input Validation**: Zod schemas for all user inputs
2. **XSS Prevention**: React's built-in XSS protection
3. **reCAPTCHA**: Bot protection for contact forms
4. **Type Safety**: TypeScript prevents runtime errors

### API Security

1. **HTTPS Only**: All external API calls use HTTPS
2. **Rate Limiting**: GitHub API rate limiting handling
3. **Error Handling**: Graceful error boundaries
4. **Secure Headers**: CSP and security headers via Vite

## 📊 Performance Architecture

### Bundle Optimization

1. **Code Splitting**: Route-based lazy loading
2. **Tree Shaking**: Unused code elimination
3. **Asset Optimization**: Image compression and lazy loading
4. **Bundle Analysis**: Webpack bundle analyzer integration

### Runtime Performance

1. **React Optimization**: useMemo, useCallback for expensive operations
2. **Image Optimization**: WebP format with fallbacks
3. **Animation Performance**: GPU-accelerated animations
4. **Caching Strategy**: React Query for server state caching

### Loading States

```typescript
// Skeleton loading patterns
const ProjectSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-300 rounded w-1/2" />
  </div>
)

// Suspended component loading
const ProjectsPage = lazy(() => import('./pages/Projects'))

<Suspense fallback={<ProjectSkeleton />}>
  <ProjectsPage />
</Suspense>
```

## 🧪 Testing Architecture

### Testing Strategy

1. **Unit Tests**: Individual component and utility testing
2. **Integration Tests**: Feature-level testing
3. **End-to-End Tests**: User journey testing
4. **Visual Regression**: Screenshot-based testing

### Testing Tools

- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Playwright**: E2E testing framework

## 🚀 Deployment Architecture

### Build Process

1. **Type Checking**: TypeScript compilation
2. **Linting**: ESLint code quality checks
3. **Testing**: Automated test suite
4. **Bundle Building**: Vite production build
5. **Deployment**: Static site deployment

### Environment Configuration

```typescript
// Environment-specific configuration
interface Config {
  apiUrl: string
  recaptchaSiteKey: string
  environment: 'development' | 'production'
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  environment: import.meta.env.MODE as 'development' | 'production',
}
```

## 🔄 Future Architecture Considerations

### Scalability

1. **Micro-frontend Architecture**: Potential future splitting
2. **CDN Integration**: Global content delivery
3. **Progressive Web App**: Service worker implementation
4. **Server-Side Rendering**: Next.js migration consideration

### Maintainability

1. **Documentation**: Living documentation system
2. **Type Safety**: Strict TypeScript configuration
3. **Code Quality**: Automated quality gates
4. **Dependency Management**: Regular updates and security audits

---

This architecture documentation provides a comprehensive overview of the system design.
For implementation details, refer to the specific component and feature documentation.
