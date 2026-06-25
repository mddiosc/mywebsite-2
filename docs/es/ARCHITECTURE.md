# Documentación de Arquitectura

Este documento proporciona una visión integral de la arquitectura del sistema, patrones de diseño y decisiones estructurales tomadas en el proyecto del portafolio de Miguel Ángel de Dios.

## 🏗️ Arquitectura de Alto Nivel

El portafolio sigue una arquitectura moderna basada en componentes construida con React y TypeScript. La aplicación utiliza un enfoque modular con clara separación de responsabilidades, haciéndola mantenible, escalable y testeable.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Capa Browser/Cliente                     │
├─────────────────────────────────────────────────────────────┤
│                   Aplicación React                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Router    │ │    i18n     │ │    Estado Global        │ │
│  │  (Rutas)    │ │ (Idiomas)   │ │   (React Query)         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Capa de Páginas                       │ │
│  │  Home │ Projects │ About │ Contact │ NotFound           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Capa de Componentes                      │ │
│  │  Layout │ Navbar │ Footer │ Componentes de Página       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  Capa de Utilidades                     │ │
│  │  Hooks │ Animaciones │ Cliente HTTP │ Constantes        │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Servicios Externos                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │     API     │ │  Servicio   │ │    Servicio Email       │ │
│  │   GitHub    │ │  reCAPTCHA  │ │                         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Principios de Diseño

### 1. Arquitectura Basada en Componentes

La aplicación sigue la arquitectura basada en componentes de React con clara separación:

- **Componentes de Layout**: Navbar, Footer, Layout wrapper
- **Componentes de Página**: Home, Projects, About, Contact, NotFound
- **Componentes de Funcionalidad**: Cards de proyectos, formularios de contacto, grids de tecnología
- **Componentes UI**: Elementos reutilizables como botones, modales, skeletons

### 2. Patrón de Diseño Atómico

Los componentes están organizados siguiendo los principios de diseño atómico:

```text
Components/
├── Atoms/          # Bloques básicos de construcción (botones, inputs)
├── Molecules/      # Grupos simples de átomos (campos de formulario, cards)
├── Organisms/      # Componentes UI complejos (navbar, grid de proyectos)
└── Templates/      # Layouts de página y estructuras
```

### 3. Estructura Basada en Funcionalidades

Cada página está organizada como un módulo de funcionalidad autocontenido:

```text
pages/
├── Home/
│   ├── index.tsx           # Componente principal de página
│   ├── types.ts           # Definiciones TypeScript
│   ├── components/        # Componentes específicos de funcionalidad
│   ├── constants/         # Constantes de página
│   └── hooks/            # Hooks personalizados
├── Projects/
├── About/
└── Contact/
```

## 🛠️ Arquitectura Técnica

### Stack Frontend

#### Framework Principal

- **React 19.2**: Última versión de React con características concurrentes
- **TypeScript 5.9**: Seguridad de tipos completa y DX mejorada
- **Vite 8.0**: Herramienta de build moderna con HMR

#### Enrutamiento

- **React Router 7.17**: Enrutamiento del lado del cliente con rutas anidadas
- **Code splitting basado en rutas**: Optimización automática de bundles
- **Enrutamiento consciente del idioma**: Estructura URL soporta i18n

#### Gestión de Estado

1. **Estado Local**: React useState y useReducer
2. **Estado del Servidor**: TanStack Query (React Query)
3. **Estado Global**: Context API para tema y configuraciones
4. **Estado de Formularios**: React Hook Form para formularios complejos

#### Arquitectura de Estilos

- **Tailwind CSS 4.2**: Framework CSS utility-first
- **Propiedades CSS Personalizadas**: Soporte para temas dinámicos
- **Estilos con alcance de componente**: Enfoque CSS modular
- **Diseño responsivo**: Breakpoints mobile-first

#### Sistema de Animaciones

- **Framer Motion**: Animaciones declarativas
- **Variantes de animación**: Patrones de animación reutilizables
- **Optimización de rendimiento**: Aceleración GPU

### Arquitectura de Flujo de Datos

```text
Componentes UI
     ↓
Hooks Personalizados (useProjects, useAboutData)
     ↓
React Query (Gestión de Estado del Servidor)
     ↓
Cliente HTTP (fetch nativo)
     ↓
APIs Externas (GitHub, Servicio Email)
```

### Comunicación entre Componentes

1. **Props hacia abajo**: Los datos fluyen hacia abajo a través de props
2. **Eventos hacia arriba**: Las interacciones del usuario suben a través de callbacks
3. **Context para Estado Global**: Estado compartido a través de React Context
4. **Hooks Personalizados**: Lógica con estado reutilizable

## 📁 Organización de Archivos

### Estructura del Proyecto

```text
src/
├── components/              # Componentes UI compartidos
│   ├── Layout.tsx          # Wrapper de layout principal
│   ├── Navbar.tsx          # Componente de navegación
│   ├── Footer.tsx          # Componente footer
│   ├── LanguageSwitcher.tsx # Selector de idioma
│   └── index.ts            # Exportaciones de componentes
├── pages/                  # Componentes de página
│   ├── Home/               # Funcionalidad página Home
│   ├── Projects/           # Funcionalidad página Projects
│   ├── About/              # Funcionalidad página About
│   ├── Contact/            # Funcionalidad página Contact
│   ├── NotFound.tsx        # Página 404
│   └── index.ts            # Exportaciones de páginas
├── hooks/                  # Hooks personalizados de React
├── lib/                    # Bibliotecas de utilidades
│   ├── animations.ts       # Configuraciones de animación
│   ├── clientObservability.ts # Observabilidad/logging del cliente
│   ├── queryClient.ts     # Configuración React Query
│   ├── security.ts        # Utilidades de seguridad
│   └── seo.ts             # Helpers SEO
├── locales/               # Archivos de traducción
│   ├── en/                # Traducciones inglés
│   └── es/                # Traducciones español
├── router/                # Configuración de enrutamiento
│   ├── index.tsx          # Configuración router
│   └── routes.tsx         # Definiciones de rutas
├── i18n/                  # Configuración de internacionalización
├── content/               # Contenido/datos estáticos
├── context/               # Proveedores de React Context
├── data/                  # Fuentes de datos y repositorios
├── utils/                 # Helpers de utilidades
├── types/                 # Definiciones de tipos TypeScript compartidos
├── constants/             # Constantes de aplicación
├── styles/               # Estilos globales
├── types.ts              # Tipos TypeScript globales
└── main.tsx              # Punto de entrada de aplicación
```

### Convenciones de Nomenclatura

- **Componentes**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase con prefijo 'use' (`useProjects.ts`)
- **Tipos**: PascalCase con nombres descriptivos (`GitHubProject`)
- **Constantes**: UPPER_SNAKE_CASE (`ANIMATION_DELAYS`)
- **Archivos**: camelCase para utilidades, PascalCase para componentes

## 🔄 Patrones de Flujo de Datos

### Gestión de Estado del Servidor

```typescript
// Hook personalizado encapsulando lógica React Query
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    select: (data) => data.filter(project => project.id !== 334629076),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Componente consumiendo el hook
const ProjectsPage = () => {
  const { data: projects, isLoading, error } = useProjects()
  
  if (isLoading) return <ProjectSkeleton />
  if (error) return <ErrorState error={error} />
  
  return <ProjectGrid projects={projects} />
}
```

### Gestión de Estado de Formularios

```typescript
// Validación de formulario con Zod y React Hook Form
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un email válido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
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
      {/* Campos del formulario */}
    </form>
  )
}
```

### Arquitectura de Internacionalización

```typescript
// Estructura de traducciones
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

// Uso en componentes
const HomePage = () => {
  const { t } = useTranslation()
  
  return (
    <h1>{t('pages.home.title')}</h1>
  )
}
```

## 🎨 Arquitectura de Animaciones

### Diseño del Sistema de Animaciones

La aplicación utiliza un sistema de animaciones centralizado con Framer Motion:

```typescript
// Variantes de animación reutilizables
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

// Configuración de animación
export const smoothTransition = {
  duration: 0.6,
  ease: [0.645, 0.045, 0.355, 1.000]
}

// Uso en componentes
<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeIn}
  transition={smoothTransition}
>
  Contenido
</motion.div>
```

## 🔒 Arquitectura de Seguridad

### Seguridad del Lado del Cliente

1. **Validación de Entrada**: Esquemas Zod para todas las entradas del usuario
2. **Prevención XSS**: Protección XSS integrada de React
3. **reCAPTCHA**: Protección contra bots para formularios de contacto
4. **Seguridad de Tipos**: TypeScript previene errores de tiempo de ejecución

### Seguridad API

1. **Solo HTTPS**: Todas las llamadas API externas usan HTTPS
2. **Rate Limiting**: Manejo de limitación de tasa API GitHub
3. **Manejo de Errores**: Boundaries de error graceful
4. **Headers Seguros**: CSP y headers de seguridad vía Vite

## 📊 Arquitectura de Rendimiento

### Optimización de Bundle

1. **Code Splitting**: Carga lazy basada en rutas
2. **Tree Shaking**: Eliminación de código no usado
3. **Optimización de Assets**: Compresión de imágenes y carga lazy
4. **Análisis de Bundle**: Vite + rollup-plugin-visualizer (`pnpm build:analyze`)

### Rendimiento en Tiempo de Ejecución

1. **Optimización React**: useMemo, useCallback para operaciones costosas
2. **Optimización de Imágenes**: Formato WebP con fallbacks
3. **Rendimiento de Animaciones**: Animaciones aceleradas por GPU
4. **Estrategia de Caché**: React Query para caché de estado del servidor

### Estados de Carga

```typescript
// Patrones de skeleton loading
const ProjectSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-300 rounded w-1/2" />
  </div>
)

// Carga de componente suspendido
const ProjectsPage = lazy(() => import('./pages/Projects'))

<Suspense fallback={<ProjectSkeleton />}>
  <ProjectsPage />
</Suspense>
```

## 🧪 Arquitectura de Pruebas

### Estrategia de Pruebas

1. **Pruebas Unitarias**: Pruebas de componentes individuales y utilidades
2. **Pruebas de Integración**: Pruebas a nivel de funcionalidad
3. **Pruebas End-to-End**: Pruebas de viaje del usuario
4. **Regresión Visual**: Pruebas basadas en capturas de pantalla

### Herramientas de Pruebas

- **Vitest**: Ejecutor de pruebas unitarias rápido
- **React Testing Library**: Utilidades de pruebas de componentes
- **Playwright**: Framework de pruebas E2E

## 🚀 Arquitectura de Despliegue

### Proceso de Build

1. **Verificación de Tipos**: Compilación TypeScript
2. **Linting**: Verificaciones de calidad de código ESLint
3. **Pruebas**: Suite de pruebas automatizada
4. **Build de Bundle**: Build de producción Vite
5. **Despliegue**: Despliegue de sitio estático

### Configuración de Entorno

```typescript
// Configuración específica de entorno
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

## 🔄 Consideraciones de Arquitectura Futura

### Escalabilidad

1. **Arquitectura Micro-frontend**: Potencial división futura
2. **Integración CDN**: Entrega de contenido global
3. **Progressive Web App**: Implementación service worker
4. **Server-Side Rendering**: Consideración migración Next.js

### Mantenibilidad

1. **Documentación**: Sistema de documentación viva
2. **Seguridad de Tipos**: Configuración TypeScript estricta
3. **Calidad de Código**: Puertas de calidad automatizadas
4. **Gestión de Dependencias**: Actualizaciones regulares y auditorías de seguridad

---

Esta documentación de arquitectura proporciona una visión integral del diseño del sistema. Para detalles de implementación, consulta la documentación específica de componentes y funcionalidades.
