# UI Components Documentation

This document provides comprehensive documentation for all UI components used in the Miguel Ángel de Dios portfolio project, including their APIs, usage examples, and design patterns.

## 🎨 Component Architecture

The component library follows atomic design principles and is organized into different levels of complexity:

- **Layout Components**: Application structure (Navbar, Footer, Layout)
- **Page Components**: Complete page implementations
- **Feature Components**: Complex UI components (ProjectCard, ContactForm)
- **Utility Components**: Reusable UI elements

## 📁 Component Organization

```text
src/components/
├── Layout.tsx              # Main layout wrapper
├── Navbar.tsx              # Navigation component
├── Footer.tsx              # Footer component
├── LanguageSwitcher.tsx    # Language toggle
└── index.ts                # Component exports

src/pages/
├── Home/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── HomeFeatures.tsx
│   │   └── index.ts
├── Projects/
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectStatistics.tsx
│   │   └── index.ts
├── About/
│   ├── components/
│   │   ├── AboutHero.tsx
│   │   ├── AboutContent.tsx
│   │   ├── TechnologyGrid.tsx
│   │   └── index.ts
└── Contact/
    ├── components/
    │   ├── ContactForm.tsx
    │   ├── ContactHeader.tsx
    │   └── index.ts
```

## 🏗️ Layout Components

### Layout

Main application layout wrapper that provides consistent structure across all pages.

**File**: `src/components/Layout.tsx`

```typescript
interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

**Features**:

- Responsive design with mobile-first approach
- Consistent header and footer across pages
- Smooth page transitions
- Accessibility compliance

### Navbar

Navigation component with responsive design and language switching.

**File**: `src/components/Navbar.tsx`

```typescript
const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      {/* Navigation implementation */}
    </nav>
  )
}
```

**Features**:

- Fixed position with backdrop blur effect
- Mobile hamburger menu
- Active link highlighting
- Language switcher integration
- Smooth animations

**Props**: None (uses translation hooks internally)

### Footer

Site footer with contact information and social links.

**File**: `src/components/Footer.tsx`

```typescript
const Footer: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Footer content */}
    </footer>
  )
}
```

**Features**:

- Social media links
- Contact information
- Copyright notice
- Responsive layout

### LanguageSwitcher

Component for switching between English and Spanish.

**File**: `src/components/LanguageSwitcher.tsx`

```typescript
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(newLang)
  }
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
    >
      {/* Language toggle UI */}
    </button>
  )
}
```

**Features**:

- Visual language indicator
- Smooth language switching
- URL update with new language
- Persistent language preference

## 🏠 Home Page Components

### Hero

Main hero section with animated introduction.

**File**: `src/pages/Home/components/Hero.tsx`

```typescript
const Hero: React.FC = () => {
  const { title, subtitle } = useHeroData()
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative isolate px-6 pt-14 lg:px-8"
    >
      {/* Hero content */}
    </motion.div>
  )
}
```

**Features**:

- Animated text reveal
- Background pattern
- Call-to-action buttons
- Responsive typography

### HomeFeatures

Feature showcase section with animated cards.

**File**: `src/pages/Home/components/HomeFeatures.tsx`

```typescript
const HomeFeatures: React.FC = () => {
  const { t } = useTranslation()
  const features = t('components.homeFeatures.features', { returnObjects: true })
  
  return (
    <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Features grid */}
    </motion.div>
  )
}
```

**Features**:

- Animated feature cards
- Icon integration
- Responsive grid layout
- Call-to-action links

## 📁 Projects Page Components

### ProjectCard

Individual project showcase card.

**File**: `src/pages/Projects/components/ProjectCard.tsx`

```typescript
interface ProjectCardProps {
  project: GitHubProject
  delay: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Project card content */}
    </motion.div>
  )
}
```

**Props**:

- `project: GitHubProject` - Project data from GitHub API
- `delay: number` - Animation delay for staggered loading

**Features**:

- Hover animations
- Language visualization
- Technology tags
- Star and fork counts
- Live demo links
- Responsive design

### ProjectGrid

Grid layout for displaying project cards.

**File**: `src/pages/Projects/components/ProjectsGrid.tsx`

```typescript
interface ProjectsGridProps {
  projects: GitHubProject[]
  isLoading: boolean
  error: Error | null
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, isLoading, error }) => {
  return (
    <motion.div className="mt-10 grid gap-x-6 gap-y-10 xl:gap-x-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Grid content */}
    </motion.div>
  )
}
```

**Props**:

- `projects: GitHubProject[]` - Array of project data
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state

**Features**:

- Loading skeletons
- Error handling
- Responsive grid
- Staggered animations

### ProjectStatistics

Statistics overview for projects.

**File**: `src/pages/Projects/components/ProjectStatistics.tsx`

```typescript
interface ProjectStatisticsProps {
  statistics: ProjectStatistics
}

const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({ statistics }) => {
  return (
    <motion.div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
      {/* Statistics grid */}
    </motion.div>
  )
}
```

**Props**:

- `statistics: ProjectStatistics` - Calculated project statistics

**Features**:

- Animated counters
- Icon integration
- Responsive layout

## 👤 About Page Components

### AboutHero

Hero section for the about page.

**File**: `src/pages/About/components/AboutHero.tsx`

```typescript
interface AboutHeroProps {
  biographyParagraphs: string[]
}

const AboutHero: React.FC<AboutHeroProps> = ({ biographyParagraphs }) => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      {/* About hero content */}
    </div>
  )
}
```

**Props**:

- `biographyParagraphs: string[]` - Biography content paragraphs

**Features**:

- Background patterns
- Image integration
- Call-to-action buttons

### TechnologyGrid

Grid displaying technology skills and logos.

**File**: `src/pages/About/components/TechnologyGrid.tsx`

```typescript
interface TechnologyGridProps {
  technologies: Technology[]
  skills: string[]
}

const TechnologyGrid: React.FC<TechnologyGridProps> = ({ technologies, skills }) => {
  return (
    <div className="bg-white py-24 sm:py-32">
      {/* Technology grid */}
    </div>
  )
}
```

**Props**:

- `technologies: Technology[]` - Array of technology objects with logos
- `skills: string[]` - List of skill strings

**Features**:

- Logo showcase
- Skill tags
- Responsive grid
- Hover effects

## 📬 Contact Page Components

### ContactForm

Contact form with validation and reCAPTCHA.

**File**: `src/pages/Contact/components/ContactForm.tsx`

```typescript
const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-16 max-w-xl sm:mt-20">
      {/* Form fields */}
    </form>
  )
}
```

**Features**:

- Form validation with Zod
- reCAPTCHA integration
- Loading states
- Error handling
- Success feedback

## 🎨 Styling Patterns

### Consistent Class Patterns

```typescript
// Container classes
const containerClasses = "mx-auto max-w-7xl px-6 lg:px-8"

// Grid classes
const gridClasses = "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"

// Button classes
const buttonClasses = "rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"

// Text classes
const headingClasses = "text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
```

### Animation Patterns

```typescript
// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

## 🧪 Component Testing

### Testing Patterns

```typescript
// Component test example
describe('ProjectCard', () => {
  const mockProject: GitHubProject = {
    id: 1,
    name: 'test-project',
    description: 'Test project description',
    html_url: 'https://github.com/user/test-project',
    stargazers_count: 42,
    language: 'TypeScript',
    // ... other properties
  }
  
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} delay={0} />)
    
    expect(screen.getByText('test-project')).toBeInTheDocument()
    expect(screen.getByText('Test project description')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
  
  it('handles project click navigation', () => {
    render(<ProjectCard project={mockProject} delay={0} />)
    
    const projectLink = screen.getByRole('link', { name: 'test-project' })
    expect(projectLink).toHaveAttribute('href', 'https://github.com/user/test-project')
  })
})
```

## 📝 Component Development Guidelines

### Creating New Components

1. **Create component file with TypeScript interface**
2. **Add proper prop validation and default values**
3. **Include comprehensive tests**
4. **Document component API and usage examples**
5. **Export from appropriate index file**

### Component Best Practices

1. **Use TypeScript for all components**
2. **Implement proper error boundaries**
3. **Follow accessibility guidelines**
4. **Use consistent naming conventions**
5. **Optimize for performance with React.memo when needed**

---

This component documentation should be updated as new components are added or existing ones are modified. For implementation details, refer to the individual component files and their associated tests.
