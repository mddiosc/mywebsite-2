# Documentación de Componentes

Esta guía proporciona documentación completa de todos los componentes UI utilizados en el portafolio de Miguel Ángel de Dios, incluyendo APIs, props, ejemplos de uso y patrones de pruebas.

## 📁 Estructura de Componentes

### Organización Jerárquica

```text
components/
├── Layout/               # Componentes de layout
│   ├── Layout.tsx       # Wrapper principal de aplicación
│   ├── Navbar.tsx       # Barra de navegación
│   └── Footer.tsx       # Pie de página
├── UI/                  # Componentes UI básicos
│   ├── Button.tsx       # Componente botón reutilizable
│   ├── Input.tsx        # Componente input de formulario
│   └── Modal.tsx        # Componente modal/dialog
├── Features/            # Componentes específicos de funcionalidad
│   ├── ProjectCard.tsx  # Tarjeta de proyecto
│   ├── ContactForm.tsx  # Formulario de contacto
│   └── TechGrid.tsx     # Grid de tecnologías
└── Common/              # Componentes comunes
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── LanguageSwitcher.tsx
```

## 🏗️ Componentes de Layout

### Layout Component

Componente principal que envuelve toda la aplicación proporcionando estructura básica y contexto global.

```typescript
interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-background text-foreground', className)}>
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

**Props:**

| Prop        | Tipo              | Requerido | Por Defecto | Descripción                              |
| ----------- | ----------------- | --------- | ----------- | ---------------------------------------- |
| `children`  | `React.ReactNode` | ✅        | -           | Contenido a renderizar dentro del layout |
| `className` | `string`          | ❌        | `''`        | Clases CSS adicionales                   |

**Ejemplo de uso:**

```typescript
import { Layout } from '@/components/Layout'

const App = () => {
  return (
    <Layout>
      <HomePage />
    </Layout>
  )
}
```

### Navbar Component

Componente de navegación responsive con soporte para múltiples idiomas y tema oscuro.

```typescript
interface NavbarProps {
  transparent?: boolean
  fixed?: boolean
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({
  transparent = false,
  fixed = true,
  className
}) => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={cn(
      'navbar-base',
      {
        'bg-transparent': transparent,
        'bg-background/80 backdrop-blur': !transparent,
        'fixed top-0 z-50': fixed,
      },
      className
    )}>
      {/* Implementación del navbar */}
    </nav>
  )
}
```

**Props:**

| Prop          | Tipo      | Requerido | Por Defecto | Descripción                                       |
| ------------- | --------- | --------- | ----------- | ------------------------------------------------- |
| `transparent` | `boolean` | ❌        | `false`     | Si el navbar debe ser transparente                |
| `fixed`       | `boolean` | ❌        | `true`      | Si el navbar debe estar fijo en la parte superior |
| `className`   | `string`  | ❌        | `''`        | Clases CSS adicionales                            |

**Estados internos:**

- `isMenuOpen`: Controla la visibilidad del menú móvil
- `activeSection`: Sección actualmente activa basada en scroll

**Ejemplo de uso:**

```typescript
// Navbar transparente para página hero
<Navbar transparent />

// Navbar con estilos personalizados
<Navbar className="border-b border-border" />
```

### Footer Component

Componente de pie de página con enlaces sociales e información de copyright.

```typescript
interface FooterProps {
  variant?: 'default' | 'minimal'
  showSocial?: boolean
  className?: string
}

export const Footer: React.FC<FooterProps> = ({
  variant = 'default',
  showSocial = true,
  className
}) => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('footer-base', className)}>
      {variant === 'default' && (
        <div className="footer-content">
          {showSocial && <SocialLinks />}
          <Copyright year={currentYear} />
        </div>
      )}
    </footer>
  )
}
```

**Props:**

| Prop         | Tipo                     | Requerido | Por Defecto | Descripción                   |
| ------------ | ------------------------ | --------- | ----------- | ----------------------------- |
| `variant`    | `'default' \| 'minimal'` | ❌        | `'default'` | Variante de diseño del footer |
| `showSocial` | `boolean`                | ❌        | `true`      | Si mostrar enlaces sociales   |
| `className`  | `string`                 | ❌        | `''`        | Clases CSS adicionales        |

## 🎯 Componentes de Funcionalidad

### ProjectCard Component

Componente para mostrar información de proyectos con animaciones y estados interactivos.

```typescript
interface ProjectCardProps {
  project: GitHubProject
  variant?: 'default' | 'featured' | 'compact'
  showStats?: boolean
  onCardClick?: (project: GitHubProject) => void
  className?: string
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'default',
  showStats = true,
  onCardClick,
  className
}) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const cardVariants = {
    default: 'project-card-default',
    featured: 'project-card-featured',
    compact: 'project-card-compact'
  }

  return (
    <motion.div
      className={cn(cardVariants[variant], className)}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onCardClick?.(project)}
    >
      <ProjectImage src={project.image} alt={project.name} />
      <ProjectContent
        project={project}
        showStats={showStats}
        isHovered={isHovered}
      />
    </motion.div>
  )
}
```

**Props:**

| Prop          | Tipo                                   | Requerido | Por Defecto | Descripción                          |
| ------------- | -------------------------------------- | --------- | ----------- | ------------------------------------ |
| `project`     | `GitHubProject`                        | ✅        | -           | Datos del proyecto a mostrar         |
| `variant`     | `'default' \| 'featured' \| 'compact'` | ❌        | `'default'` | Variante visual de la tarjeta        |
| `showStats`   | `boolean`                              | ❌        | `true`      | Si mostrar estadísticas del proyecto |
| `onCardClick` | `(project: GitHubProject) => void`     | ❌        | -           | Callback al hacer clic en la tarjeta |
| `className`   | `string`                               | ❌        | `''`        | Clases CSS adicionales               |

**Tipos relacionados:**

```typescript
interface GitHubProject {
  id: number
  name: string
  description: string
  html_url: string
  homepage?: string
  language: string
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  topics: string[]
}
```

**Ejemplo de uso:**

```typescript
const projects = useProjects()

return (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {projects.map(project => (
      <ProjectCard
        key={project.id}
        project={project}
        variant="featured"
        onCardClick={handleProjectClick}
      />
    ))}
  </div>
)
```

### ContactForm Component

Formulario de contacto con validación, reCAPTCHA y manejo de estado.

```typescript
interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>
  initialValues?: Partial<ContactFormData>
  showReCaptcha?: boolean
  className?: string
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  initialValues,
  showReCaptcha = true,
  className
}) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues
  })

  const onFormSubmit = async (data: ContactFormData) => {
    try {
      await onSubmit?.(data)
      reset()
      toast.success(t('contact.form.success'))
    } catch (error) {
      toast.error(t('contact.form.error'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={cn('contact-form', className)}
    >
      <FormField
        label={t('contact.form.name')}
        error={errors.name?.message}
        required
      >
        <Input
          {...register('name')}
          placeholder={t('contact.form.namePlaceholder')}
        />
      </FormField>

      <FormField
        label={t('contact.form.email')}
        error={errors.email?.message}
        required
      >
        <Input
          type="email"
          {...register('email')}
          placeholder={t('contact.form.emailPlaceholder')}
        />
      </FormField>

      <FormField
        label={t('contact.form.message')}
        error={errors.message?.message}
        required
      >
        <Textarea
          {...register('message')}
          placeholder={t('contact.form.messagePlaceholder')}
          rows={5}
        />
      </FormField>

      {showReCaptcha && <ReCaptchaField />}

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        {t('contact.form.submit')}
      </Button>
    </form>
  )
}
```

**Props:**

| Prop            | Tipo                                       | Requerido | Por Defecto | Descripción                               |
| --------------- | ------------------------------------------ | --------- | ----------- | ----------------------------------------- |
| `onSubmit`      | `(data: ContactFormData) => Promise<void>` | ❌        | -           | Función para manejar envío del formulario |
| `initialValues` | `Partial<ContactFormData>`                 | ❌        | `{}`        | Valores iniciales del formulario          |
| `showReCaptcha` | `boolean`                                  | ❌        | `true`      | Si mostrar verificación reCAPTCHA         |
| `className`     | `string`                                   | ❌        | `''`        | Clases CSS adicionales                    |

**Esquema de validación:**

```typescript
const contactSchema = z.object({
  name: z.string().min(2, t('validation.name.min')).max(50, t('validation.name.max')),
  email: z.string().email(t('validation.email.invalid')),
  message: z.string().min(10, t('validation.message.min')).max(1000, t('validation.message.max')),
})

type ContactFormData = z.infer<typeof contactSchema>
```

### TechnologyGrid Component

Grid responsive para mostrar tecnologías con iconos y animaciones.

```typescript
interface TechnologyGridProps {
  technologies: Technology[]
  columns?: number
  showNames?: boolean
  animationDelay?: number
  className?: string
}

export const TechnologyGrid: React.FC<TechnologyGridProps> = ({
  technologies,
  columns = 3,
  showNames = true,
  animationDelay = 0.1,
  className
}) => {
  return (
    <div className={cn(
      'grid gap-6',
      {
        'grid-cols-2 md:grid-cols-3': columns === 3,
        'grid-cols-3 md:grid-cols-4': columns === 4,
        'grid-cols-4 md:grid-cols-6': columns === 6,
      },
      className
    )}>
      {technologies.map((tech, index) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * animationDelay }}
          className="tech-item"
        >
          <TechIcon src={tech.icon} alt={tech.name} />
          {showNames && (
            <span className="tech-name">{tech.name}</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}
```

**Props:**

| Prop             | Tipo           | Requerido | Por Defecto | Descripción                          |
| ---------------- | -------------- | --------- | ----------- | ------------------------------------ |
| `technologies`   | `Technology[]` | ✅        | -           | Array de tecnologías a mostrar       |
| `columns`        | `number`       | ❌        | `3`         | Número de columnas en desktop        |
| `showNames`      | `boolean`      | ❌        | `true`      | Si mostrar nombres de tecnologías    |
| `animationDelay` | `number`       | ❌        | `0.1`       | Delay entre animaciones de elementos |
| `className`      | `string`       | ❌        | `''`        | Clases CSS adicionales               |

## 🎛️ Componentes UI Base

### Button Component

Componente de botón reutilizable con múltiples variantes y estados.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonVariants = {
    default: 'btn-default',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  }

  const buttonSizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }

  return (
    <button
      className={cn(
        'btn-base',
        buttonVariants[variant],
        buttonSizes[size],
        { 'btn-loading': loading },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="btn-spinner" />}
      {!loading && leftIcon && <span className="btn-left-icon">{leftIcon}</span>}
      <span className="btn-content">{children}</span>
      {!loading && rightIcon && <span className="btn-right-icon">{rightIcon}</span>}
    </button>
  )
}
```

**Props heredadas de HTMLButtonElement más:**

| Prop        | Tipo                                                            | Requerido | Por Defecto | Descripción                    |
| ----------- | --------------------------------------------------------------- | --------- | ----------- | ------------------------------ |
| `variant`   | `'default' \| 'primary' \| 'secondary' \| 'outline' \| 'ghost'` | ❌        | `'default'` | Variante visual del botón      |
| `size`      | `'sm' \| 'md' \| 'lg'`                                          | ❌        | `'md'`      | Tamaño del botón               |
| `loading`   | `boolean`                                                       | ❌        | `false`     | Estado de carga                |
| `leftIcon`  | `React.ReactNode`                                               | ❌        | -           | Icono a la izquierda del texto |
| `rightIcon` | `React.ReactNode`                                               | ❌        | -           | Icono a la derecha del texto   |

**Ejemplos de uso:**

```typescript
// Botón básico
<Button>Hacer clic</Button>

// Botón primario con icono
<Button variant="primary" leftIcon={<PlusIcon />}>
  Agregar Proyecto
</Button>

// Botón con estado de carga
<Button loading={isSubmitting}>
  Enviando...
</Button>

// Botón outline con icono derecho
<Button variant="outline" rightIcon={<ArrowRightIcon />}>
  Ver Más
</Button>
```

### Input Component

Componente de entrada de texto con validación y estados.

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outline'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  className,
  ...props
}, ref) => {
  const inputId = useId()

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className={cn(
        'input-wrapper',
        {
          'input-error': error,
          'input-with-left-icon': leftIcon,
          'input-with-right-icon': rightIcon,
        }
      )}>
        {leftIcon && <span className="input-left-icon">{leftIcon}</span>}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-base',
            `input-${variant}`,
            className
          )}
          {...props}
        />

        {rightIcon && <span className="input-right-icon">{rightIcon}</span>}
      </div>

      {error && (
        <span className="input-error-text">{error}</span>
      )}

      {helperText && !error && (
        <span className="input-helper-text">{helperText}</span>
      )}
    </div>
  )
})
```

### Modal Component

Componente modal accesible con overlay y control de foco.

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  children
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
      <div
        className={cn('modal-content', `modal-${size}`)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button onClick={onClose} className="modal-close-button">
                <XIcon />
              </button>
            )}
          </div>
        )}

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
```

## 🔧 Componentes de Utilidad

### LoadingSpinner Component

Spinner de carga animado con diferentes tamaños.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'current'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className
}) => {
  return (
    <div
      className={cn(
        'spinner-base',
        `spinner-${size}`,
        `spinner-${color}`,
        className
      )}
      role="status"
      aria-label="Cargando..."
    >
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
```

### ErrorBoundary Component

Boundary de error para capturar errores de componentes React.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="error-boundary">
    <h2>Algo salió mal</h2>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>
      Recargar página
    </button>
  </div>
)
```

### LanguageSwitcher Component

Selector de idioma con animaciones y persistencia.

```typescript
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle'
  showLabels?: boolean
  className?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  showLabels = false,
  className
}) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  if (variant === 'toggle') {
    return (
      <button
        onClick={() => changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
        className={cn('language-toggle', className)}
      >
        {currentLanguage?.flag}
        {showLabels && <span>{currentLanguage?.label}</span>}
      </button>
    )
  }

  return (
    <div className={cn('language-dropdown', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-trigger"
      >
        {currentLanguage?.flag}
        {showLabels && <span>{currentLanguage?.label}</span>}
        <ChevronDownIcon className={cn('transition-transform', {
          'rotate-180': isOpen
        })} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="language-menu"
          >
            {languages.map(language => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={cn('language-option', {
                  'language-option-active': language.code === i18n.language
                })}
              >
                {language.flag}
                <span>{language.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## 🧪 Patrones de Pruebas

### Configuración de Pruebas de Componentes

```typescript
// test/utils.tsx - Utilidades de prueba personalizadas
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n-test'

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### Ejemplos de Pruebas de Componentes

```typescript
// ProjectCard.test.tsx
import { render, screen, fireEvent } from '@/test/utils'
import { ProjectCard } from './ProjectCard'
import { mockProject } from '@/test/mocks'

describe('ProjectCard', () => {
  it('renderiza información del proyecto correctamente', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText(mockProject.name)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockProject.name)
  })

  it('llama onCardClick cuando se hace clic', () => {
    const handleClick = vi.fn()
    render(<ProjectCard project={mockProject} onCardClick={handleClick} />)

    fireEvent.click(screen.getByRole('article'))

    expect(handleClick).toHaveBeenCalledWith(mockProject)
  })

  it('muestra estadísticas cuando showStats es true', () => {
    render(<ProjectCard project={mockProject} showStats />)

    expect(screen.getByText(mockProject.stargazers_count.toString())).toBeInTheDocument()
    expect(screen.getByText(mockProject.forks_count.toString())).toBeInTheDocument()
  })

  it('aplica la variante correcta', () => {
    render(<ProjectCard project={mockProject} variant="featured" />)

    expect(screen.getByRole('article')).toHaveClass('project-card-featured')
  })
})
```

### Pruebas de Formularios

```typescript
// ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('valida campos requeridos', async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument()
    })
  })

  it('envía formulario con datos válidos', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ContactForm onSubmit={handleSubmit} />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Juan Pérez' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'juan@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: 'Este es un mensaje de prueba' }
    })

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        message: 'Este es un mensaje de prueba'
      })
    })
  })
})
```

### Mocks para Pruebas

```typescript
// test/mocks/project.ts
export const mockProject: GitHubProject = {
  id: 1,
  name: 'proyecto-ejemplo',
  description: 'Un proyecto de ejemplo para pruebas',
  html_url: 'https://github.com/usuario/proyecto-ejemplo',
  homepage: 'https://proyecto-ejemplo.com',
  language: 'TypeScript',
  stargazers_count: 42,
  forks_count: 7,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-12-01T00:00:00Z',
  topics: ['react', 'typescript', 'vite'],
}

// test/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.json([mockProject]))
  }),

  rest.post('/api/contact', (req, res, ctx) => {
    return res(ctx.json({ success: true }))
  }),
]
```

## 📚 Guías de Uso

### Mejores Prácticas

1. **Composición sobre herencia**: Prefiere componentes compuestos
2. **Props descriptivas**: Usa nombres claros y específicos
3. **Tipos estrictos**: Define interfaces TypeScript completas
4. **Accesibilidad**: Incluye roles ARIA y etiquetas adecuadas
5. **Pruebas**: Prueba comportamiento del usuario, no implementación

### Patrones Comunes

```typescript
// Patrón Compound Component
const Card = ({ children, className }) => (
  <div className={cn('card', className)}>{children}</div>
)

Card.Header = ({ children }) => (
  <div className="card-header">{children}</div>
)

Card.Body = ({ children }) => (
  <div className="card-body">{children}</div>
)

Card.Footer = ({ children }) => (
  <div className="card-footer">{children}</div>
)

// Uso
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>Pie</Card.Footer>
</Card>
```

### Optimización de Rendimiento

```typescript
// Memoización de componentes costosos
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // Renderizado costoso
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})

// Uso de useMemo para cálculos costosos
const MemoizedComponent = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0)
  }, [items])

  return <div>{expensiveValue}</div>
}
```

Esta documentación de componentes proporciona una referencia completa para trabajar con todos los componentes UI del proyecto. Para más detalles sobre implementación específica, consulta el código fuente en `src/components/`.
