# Guía de Desarrollo

Esta guía proporciona todo lo que necesitas saber para configurar, desarrollar y contribuir al proyecto del portafolio de Miguel Ángel de Dios.

## 🚀 Inicio Rápido

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v20 o superior)
- **pnpm** (v10+ - el proyecto fija pnpm 11.x mediante `packageManager`)
- **Git** (v2.30.0 o superior)

### Configuración del Entorno

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/mddiosc/mywebsite-2.git
   cd mywebsite-2
   ```

2. **Instala las dependencias**:

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno**:

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tus configuraciones:

   ```env
   # API GitHub (opcional - para datos en vivo de proyectos)
   VITE_GITHUB_API_URL=https://api.github.com
   VITE_GITHUB_USERNAME=tuusuario
   
   # reCAPTCHA (para formulario de contacto)
   VITE_RECAPTCHA_SITE_KEY=tu_site_key_aqui
   
   # Configuración de desarrollo
   VITE_APP_TITLE=Mi Portafolio
   VITE_APP_DESCRIPTION=Portafolio personal de desarrollador
   ```

4. **Inicia el servidor de desarrollo**:

   ```bash
   pnpm dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Scripts de Desarrollo

### Scripts Principales

```bash
# Servidor de desarrollo con hot reload (vite --host)
pnpm dev

# Build de producción
pnpm build

# Build de producción con análisis del bundle
pnpm build:analyze

# Preview del build de producción localmente
pnpm preview

# Ejecutar suite de pruebas
pnpm test

# Ejecutar pruebas en modo watch
pnpm test:watch

# Ejecutar pruebas con reporte de cobertura
pnpm test:coverage

# Pruebas E2E con Playwright
pnpm test:e2e

# Linting de código
pnpm lint

# Formateo de código con Prettier
pnpm format

# Verificación de formato de código
pnpm format:check

# Linting de documentación
pnpm docs:lint

# Auto-corrección de linting de documentación
pnpm docs:lint:fix

# Verificación de tipos TypeScript
pnpm type-check

# Verificación integral: lint + docs:lint + format:check + type-check
pnpm quality
```

> Nota: no existe un script `lint:fix`. La auto-corrección de ESLint se ejecuta a través de lint-staged sobre los archivos staged (`eslint . --fix`), o directamente con: `pnpm exec eslint . --fix`.

## 📁 Estructura del Proyecto

### Visión General

```text
mywebsite-2/
├── public/                 # Assets estáticos
│   ├── images/            # Imágenes del proyecto
│   │   └── tech/          # Logos de tecnologías
│   └── *.svg              # Iconos y logos
├── src/                   # Código fuente
│   ├── components/        # Componentes UI compartidos
│   ├── pages/            # Componentes de página
│   ├── hooks/            # Hooks personalizados
│   ├── lib/              # Utilidades y configuración
│   ├── locales/          # Archivos de traducción
│   ├── router/           # Configuración de enrutamiento
│   ├── constants/        # Constantes de aplicación
│   ├── styles/           # Estilos globales
│   └── types.ts          # Tipos TypeScript globales
├── docs/                 # Documentación del proyecto
├── .vscode/              # Configuración VS Code
└── tests/                # Configuración de pruebas
```

### Estructura de Páginas

Cada página sigue un patrón consistente:

```text
pages/NombrePagina/
├── index.tsx             # Componente principal de página
├── types.ts              # Tipos específicos de página
├── components/           # Componentes específicos de página
│   ├── ComponenteA.tsx
│   ├── ComponenteB.tsx
│   └── index.ts          # Archivo de exportaciones
├── constants/            # Constantes de página
│   ├── constants.ts
│   └── index.ts
├── hooks/                # Hooks específicos de página
│   ├── useHookPersonalizado.ts
│   └── index.ts
└── __tests__/           # Pruebas específicas de página
    └── *.test.tsx
```

## 🎯 Estándares de Código

### Estándares TypeScript

#### Configuración TypeScript

El proyecto usa TypeScript estricto con las siguientes configuraciones:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Pautas de Tipos

1. **Preferir interfaces sobre types** para definiciones de objetos:

   ```typescript
   // ✅ Preferido
   interface UserProps {
     id: string
     name: string
     email?: string
   }
   
   // ❌ Evitar para objetos
   type UserProps = {
     id: string
     name: string
   }
   ```

2. **Usar types para uniones y computados**:

   ```typescript
   // ✅ Apropiado para types
   type Status = 'loading' | 'success' | 'error'
   type UserKeys = keyof User
   ```

3. **Tipos de props de componente**:

   ```typescript
   interface ComponentProps {
     title: string
     children: React.ReactNode
     className?: string
     onClick?: () => void
   }
   
   const Component: React.FC<ComponentProps> = ({ title, children, ...props }) => {
     return <div {...props}>{title}{children}</div>
   }
   ```

#### Convenciones de Nomenclatura

- **Interfaces**: PascalCase con sufijo descriptivo (`UserInterface`, `ApiResponse`)
- **Types**: PascalCase (`Status`, `Theme`)
- **Enums**: PascalCase (`UserRole`, `ApiStatus`)
- **Genéricos**: Una letra mayúscula (`T`, `K`, `V`)

### Estándares de Componentes React

#### Estructura de Componente

```typescript
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// Tipos e interfaces
interface ComponentProps {
  prop1: string
  prop2?: number
  children: React.ReactNode
}

// Constantes locales del componente
const ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// Componente principal
export const Component: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 = 0, 
  children 
}) => {
  // Hooks
  const { t } = useTranslation()
  
  // Lógica del componente
  const handleClick = () => {
    // Lógica de manejo
  }
  
  // Renderizado
  return (
    <motion.div
      variants={ANIMATION_VARIANTS}
      initial="hidden"
      animate="visible"
      className="component-styles"
    >
      {children}
    </motion.div>
  )
}

// Exportación por defecto
export default Component
```

#### Hooks Personalizados

```typescript
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface UseCustomHookOptions {
  enabled?: boolean
  refetchInterval?: number
}

interface UseCustomHookReturn {
  data: DataType | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  const { enabled = true, refetchInterval } = options
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customData'],
    queryFn: fetchCustomData,
    enabled,
    refetchInterval,
  })
  
  return { data, isLoading, error, refetch }
}
```

### Estándares de Estilos

#### Tailwind CSS

1. **Orden de clases**: Sigue el orden recomendado de Tailwind
2. **Clases utilitarias específicas**: Prefiere clases utilitarias sobre CSS personalizado
3. **Breakpoints responsivos**: Mobile-first approach

```typescript
// ✅ Buen orden de clases
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" />

// ✅ Diseño responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
```

#### CSS Personalizado

Para estilos que no se pueden expresar con Tailwind:

```css
/* styles/components/Component.css */
.component-specific-style {
  @apply base-tailwind-classes;
  
  /* CSS personalizado cuando sea necesario */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}
```

## 🌐 Configuración de Internacionalización

### Agregar Nuevas Traducciones

1. **Estructura de archivos de traducción**:

   ```text
   locales/
   ├── en/
   │   └── translation.json
   └── es/
       └── translation.json
   ```

2. **Formato de archivo de traducción**:

   ```json
   {
     "pages": {
       "home": {
         "title": "Bienvenido a Mi Portafolio",
         "subtitle": "Desarrollador Front-End Especializado en React"
       }
     },
     "components": {
       "navbar": {
         "home": "Inicio",
         "projects": "Proyectos",
         "about": "Acerca de",
         "contact": "Contacto"
       }
     }
   }
   ```

3. **Uso en componentes**:

   ```typescript
   import { useTranslation } from 'react-i18next'
   
   const Component = () => {
     const { t, i18n } = useTranslation()
     
     const changeLanguage = (lng: string) => {
       i18n.changeLanguage(lng)
     }
     
     return (
       <div>
         <h1>{t('pages.home.title')}</h1>
         <button onClick={() => changeLanguage('es')}>
           Español
         </button>
       </div>
     )
   }
   ```

### Pautas de Traducción

1. **Claves descriptivas**: Usa claves que describan el contexto
2. **Anidación lógica**: Organiza traducciones por página/componente
3. **Valores por defecto**: Proporciona texto de respaldo
4. **Pluralización**: Usa el sistema de pluralización de i18next

```json
{
  "projects": {
    "count_one": "{{count}} proyecto",
    "count_other": "{{count}} proyectos"
  }
}
```

## 🧪 Configuración de Pruebas

### Configuración Vitest

```typescript
// vite.config.ts (el bloque `test`)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
})
```

### Escribiendo Pruebas

#### Pruebas de Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Component } from './Component'

describe('Component', () => {
  it('renderiza correctamente', () => {
    render(<Component title="Prueba" />)
    
    expect(screen.getByText('Prueba')).toBeInTheDocument()
  })
  
  it('maneja eventos de clic', () => {
    const handleClick = vi.fn()
    render(<Component onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

#### Pruebas de Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCustomHook } from './useCustomHook'

describe('useCustomHook', () => {
  it('devuelve datos después de la carga', async () => {
    const { result } = renderHook(() => useCustomHook())
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
    
    expect(result.current.isLoading).toBe(false)
  })
})
```

#### Mocking de APIs

El proyecto no usa MSW. Para simular llamadas a la API en las pruebas, stubea el `fetch` global con Vitest:

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetch de proyectos', () => {
  it('devuelve los proyectos desde la API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: 'proyecto-ejemplo',
            description: 'Un proyecto de ejemplo',
          },
        ],
      })
    )

    const repos = await fetch(
      'https://api.github.com/users/tuusuario/repos'
    ).then((r) => r.json())

    expect(repos).toHaveLength(1)
    expect(repos[0].name).toBe('proyecto-ejemplo')
  })
})
```

## 🔧 Herramientas de Desarrollo

### Configuración VS Code

#### Extensiones Recomendadas

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "lokalise.i18n-ally",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
}
```

#### Configuración de Workspace

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "tailwindCSS.experimental.classRegex": [
    "cn\\(([^)]*)\\)",
    "cva\\(([^)]*)\\)"
  ]
}
```

### Configuración de Git

#### Hooks Preconfigurados

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && pnpm type-check",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

#### Lint-staged

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Configuración de Prettier

```javascript
// prettier.config.cjs
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
}
```

### Configuración de ESLint

```javascript
// eslint.config.js
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from '@typescript-eslint/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
```

## 🔄 Workflow de Desarrollo

### Flujo de Trabajo Git

1. **Crear una rama de funcionalidad**:

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer commits con formato convencional**:

   ```bash
   git commit -m "feat: agregar componente de portfolio"
   git commit -m "fix: corregir responsive en mobile"
   git commit -m "docs: actualizar README"
   ```

3. **Push y crear Pull Request**:

   ```bash
   git push origin feature/nueva-funcionalidad
   ```

### Commits Convencionales

Formato: `tipo(alcance): descripción`

Tipos disponibles:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, punto y coma, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar pruebas
- `chore`: Cambios en build o herramientas auxiliares

Ejemplos:

```bash
feat(projects): agregar filtro por tecnología
fix(contact): corregir validación de formulario
docs(readme): actualizar instrucciones de instalación
style(navbar): mejorar espaciado en mobile
refactor(hooks): extraer lógica de useProjects
test(components): agregar pruebas para ProjectCard
chore(deps): actualizar dependencias
```

### Proceso de Review

1. **Auto-revisión**: Revisa tu propio código antes del PR
2. **Pruebas**: Asegúrate de que todas las pruebas pasen
3. **Documentación**: Actualiza documentación si es necesario
4. **Descripción del PR**: Describe cambios y contexto

### Configuración de Entorno de Desarrollo

#### Variables de Entorno

```bash
# .env.local
VITE_GITHUB_API_URL=https://api.github.com
VITE_GITHUB_USERNAME=tu_usuario
VITE_RECAPTCHA_SITE_KEY=tu_site_key
VITE_APP_TITLE=Mi Portafolio
VITE_APP_DESCRIPTION=Portafolio personal
```

#### Scripts de Desarrollo Adicionales

```bash
# Build de producción con análisis de bundle
pnpm build:analyze

# Análisis de presupuesto de rendimiento
pnpm performance:budget

# Lighthouse CI
pnpm lighthouse:ci

# Genera snapshot de proyectos
pnpm generate:projects-snapshot
```

## 🐛 Debugging

### Herramientas de Debug

1. **React Developer Tools**: Para inspeccionar componentes
2. **React Query Devtools**: Para debuggear estado del servidor
3. **Redux DevTools**: Para estado global (si se usa)
4. **Vite DevTools**: Para análisis de build

### Logging

```typescript
// Utilidad de logging para desarrollo
const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data)
    }
  },
  error: (message: string, error?: Error) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, error)
    }
  },
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, data)
    }
  },
}
```

### Debugging de Performance

```typescript
import { Profiler } from 'react'

const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  if (import.meta.env.DEV) {
    console.log(`[PROFILER] ${id} ${phase}:`, actualDuration)
  }
}

<Profiler id="ComponentName" onRender={onRenderCallback}>
  <Component />
</Profiler>
```

## 📚 Recursos Adicionales

### Documentación de Referencia

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)

### Herramientas Útiles

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com/)
- [Bundle Analyzer](https://bundleanalyzer.com/)

Esta guía de desarrollo te proporciona todo lo necesario para trabajar efectivamente en el proyecto. Para dudas específicas, consulta la documentación adicional en la carpeta `docs/`.
