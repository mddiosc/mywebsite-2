---
title: "Monorepos con Nx: Escalando Proyectos React"
description: "Guía completa para implementar monorepos con Nx en proyectos React: setup, estructura, caching, generators, y estrategias de CI/CD."
date: "2025-11-18"
tags: ["nx", "monorepo", "react", "architecture", "ci-cd", "scalability"]
author: "Miguel Ángel de Dios"
slug: "monorepos-nx-react"
featured: false
---

Después de hablar sobre micro-frontends y design systems, el siguiente paso natural es discutir cómo organizar todo en un monorepo. Nx se ha convertido en mi herramienta favorita para esto. Hoy comparto mi experiencia escalando proyectos React con Nx.

## ¿Por Qué Monorepos?

En proyectos grandes, mantener múltiples repositorios se vuelve problemático:

- ❌ Sincronización de versiones entre repos
- ❌ Duplicación de configuraciones
- ❌ PRs que tocan múltiples repos
- ❌ Testing de integración complejo
- ❌ Refactoring que cruza límites de repos

Los monorepos resuelven estos problemas:

- ✅ Un solo lugar para todo el código relacionado
- ✅ Configuraciones compartidas
- ✅ Atomic commits que tocan múltiples proyectos
- ✅ Testing de integración simplificado
- ✅ Mejor visibilidad de dependencias

## ¿Por Qué Nx?

Nx ofrece ventajas sobre otras herramientas de monorepo:

- ✅ **Computation caching**: No rebuilds innecesarios
- ✅ **Affected commands**: Solo ejecuta lo que cambió
- ✅ **Generators**: Scaffolding consistente
- ✅ **Task orchestration**: Ejecución paralela inteligente
- ✅ **Nx Cloud**: Caché distribuido para CI
- ✅ **Plugins**: Soporte first-class para React, Next.js, Node, etc.

## Setup Inicial

### Crear un Workspace Nx

```bash
# Crear workspace con preset de React
npx create-nx-workspace@latest mi-empresa --preset=react-monorepo

# O empezar vacío y añadir lo que necesites
npx create-nx-workspace@latest mi-empresa --preset=apps
```

### Estructura del Workspace

```plaintext
mi-empresa/
├── apps/
│   ├── web/                    # App principal
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   ├── admin/                  # App de administración
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   └── docs/                   # Documentación (Storybook)
├── libs/
│   ├── shared/
│   │   ├── ui/                 # Componentes compartidos
│   │   ├── utils/              # Utilidades
│   │   └── types/              # Tipos TypeScript
│   ├── features/
│   │   ├── auth/               # Feature de autenticación
│   │   ├── products/           # Feature de productos
│   │   └── orders/             # Feature de pedidos
│   └── data-access/
│       ├── api/                # Cliente API
│       └── state/              # Estado global
├── tools/
│   └── generators/             # Generators personalizados
├── nx.json
├── tsconfig.base.json
└── package.json
```

## Configuración de Nx

### nx.json

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/*.spec.tsx",
      "!{projectRoot}/**/*.test.tsx",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": [
      "{workspaceRoot}/tsconfig.base.json",
      "{workspaceRoot}/babel.config.json"
    ]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production"],
      "cache": true
    },
    "lint": {
      "inputs": ["default"],
      "cache": true
    }
  },
  "defaultBase": "main",
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve"
      }
    }
  ]
}
```

### tsconfig.base.json

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "bundler",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@mi-empresa/shared/ui": ["libs/shared/ui/src/index.ts"],
      "@mi-empresa/shared/utils": ["libs/shared/utils/src/index.ts"],
      "@mi-empresa/shared/types": ["libs/shared/types/src/index.ts"],
      "@mi-empresa/features/auth": ["libs/features/auth/src/index.ts"],
      "@mi-empresa/features/products": ["libs/features/products/src/index.ts"],
      "@mi-empresa/data-access/api": ["libs/data-access/api/src/index.ts"],
      "@mi-empresa/data-access/state": ["libs/data-access/state/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

## Generando Proyectos

### Crear una Aplicación

```bash
# Crear app React con Vite
nx g @nx/react:app web --directory=apps/web --bundler=vite

# Crear app Next.js
nx g @nx/next:app marketing --directory=apps/marketing
```

### Crear Librerías

```bash
# Librería de componentes UI
nx g @nx/react:lib ui --directory=libs/shared/ui --component=false

# Librería de utilidades (sin React)
nx g @nx/js:lib utils --directory=libs/shared/utils --bundler=none

# Feature library
nx g @nx/react:lib auth --directory=libs/features/auth
```

### Crear Componentes

```bash
# Componente en librería UI
nx g @nx/react:component Button --project=shared-ui --export

# Componente en feature
nx g @nx/react:component LoginForm --project=features-auth
```

## Arquitectura de Librerías

### Organización por Tipo

```plaintext
libs/
├── shared/           # Código compartido entre apps
│   ├── ui/          # Componentes presentacionales
│   ├── utils/       # Funciones de utilidad
│   └── types/       # Tipos e interfaces
├── features/        # Funcionalidades completas
│   ├── auth/        # Login, registro, etc.
│   └── products/    # CRUD de productos
└── data-access/     # Acceso a datos
    ├── api/         # Cliente HTTP
    └── state/       # Zustand, Redux, etc.
```

### Boundaries y Tags

```json
// libs/shared/ui/project.json
{
  "name": "shared-ui",
  "tags": ["scope:shared", "type:ui"]
}

// libs/features/auth/project.json
{
  "name": "features-auth",
  "tags": ["scope:auth", "type:feature"]
}
```

```json
// .eslintrc.json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "depConstraints": [
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": ["type:ui", "type:data-access", "type:util"]
              },
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:ui", "type:util"]
              },
              {
                "sourceTag": "type:data-access",
                "onlyDependOnLibsWithTags": ["type:util"]
              },
              {
                "sourceTag": "scope:auth",
                "onlyDependOnLibsWithTags": ["scope:shared", "scope:auth"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Ejemplo de Librería UI

### Estructura

```plaintext
libs/shared/ui/
├── src/
│   ├── lib/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.spec.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.ts
│   └── index.ts
├── project.json
└── tsconfig.json
```

### Componente Button

```tsx
// libs/shared/ui/src/lib/Button/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@mi-empresa/shared/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        outline: 'border border-input bg-transparent hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Export Barrel

```tsx
// libs/shared/ui/src/index.ts
export * from './lib/Button';
export * from './lib/Input';
export * from './lib/Modal';
export * from './lib/Card';
// ... más componentes
```

## Feature Libraries

### Estructura de Feature

```plaintext
libs/features/auth/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSession.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── types/
│   │       └── auth.types.ts
│   └── index.ts
├── project.json
└── tsconfig.json
```

### Hook de Autenticación

```tsx
// libs/features/auth/src/lib/hooks/useAuth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

## Caching y Performance

### Computation Caching Local

Nx cachea automáticamente los resultados de builds y tests:

```bash
# Primera ejecución: 45s
nx build web

# Segunda ejecución (sin cambios): 0.5s
nx build web
# [local cache]
```

### Nx Cloud para CI

```bash
# Conectar con Nx Cloud
npx nx connect
```

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - uses: nrwl/nx-set-shas@v4

      # Nx Cloud cachea entre CI runs
      - run: npx nx affected -t lint test build --parallel=3
```

### Affected Commands

Solo ejecuta tareas para proyectos afectados por cambios:

```bash
# Solo lint proyectos afectados
nx affected -t lint

# Solo test proyectos afectados
nx affected -t test

# Solo build proyectos afectados
nx affected -t build

# Ver qué proyectos están afectados
nx affected --graph
```

## Generators Personalizados

### Crear un Generator

```bash
nx g @nx/plugin:generator feature --project=tools-generators
```

```typescript
// tools/generators/src/generators/feature/generator.ts
import {
  Tree,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  joinPathFragments,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/react';

interface FeatureGeneratorSchema {
  name: string;
  directory?: string;
}

export async function featureGenerator(
  tree: Tree,
  options: FeatureGeneratorSchema
) {
  const { name, directory } = options;
  const projectName = names(name).fileName;
  const projectRoot = joinPathFragments('libs/features', directory ?? '', projectName);

  // Generar librería base
  await libraryGenerator(tree, {
    name: projectName,
    directory: projectRoot,
    tags: `scope:${projectName},type:feature`,
    style: 'css',
    skipTsConfig: false,
    skipFormat: true,
    unitTestRunner: 'vitest',
    bundler: 'none',
  });

  // Añadir archivos de template
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    projectRoot,
    {
      ...names(name),
      offsetFromRoot: offsetFromRoot(projectRoot),
    }
  );

  await formatFiles(tree);
}

export default featureGenerator;
```

```tsx
// tools/generators/src/generators/feature/files/src/lib/hooks/use__fileName__.ts.template
import { create } from 'zustand';

interface <%= className %>State {
  // Define your state here
  isLoading: boolean;
}

export const use<%= className %> = create<<%= className %>State>()((set) => ({
  isLoading: false,
}));
```

### Usar el Generator

```bash
# Crear feature completa
nx g @mi-empresa/tools-generators:feature products --directory=commerce

# Genera:
# libs/features/commerce/products/
# ├── src/
# │   ├── lib/
# │   │   ├── components/
# │   │   ├── hooks/
# │   │   │   └── useProducts.ts
# │   │   └── types/
# │   └── index.ts
# └── project.json
```

## Estrategias de Deploy

### Deploy por App

```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'libs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: nrwl/nx-set-shas@v4

      - run: npm ci

      # Solo build si web está afectado
      - run: |
          if npx nx show projects --affected | grep -q "web"; then
            npx nx build web --configuration=production
            # Deploy a Vercel, AWS, etc.
          fi
```

### Matrix Deploy

```yaml
# .github/workflows/deploy-all.yml
name: Deploy Affected Apps

on:
  push:
    branches: [main]

jobs:
  affected:
    runs-on: ubuntu-latest
    outputs:
      apps: ${{ steps.affected.outputs.apps }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: nrwl/nx-set-shas@v4
      - run: npm ci
      - id: affected
        run: |
          APPS=$(npx nx show projects --affected --type=app | tr '\n' ' ')
          echo "apps=$APPS" >> $GITHUB_OUTPUT

  deploy:
    needs: affected
    if: needs.affected.outputs.apps != ''
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: ${{ fromJson(format('["{0}"]', join(fromJson(needs.affected.outputs.apps), '","'))) }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx nx build ${{ matrix.app }} --configuration=production
      - run: echo "Deploy ${{ matrix.app }}"
```

## Visualización del Workspace

### Graph de Dependencias

```bash
# Ver grafo interactivo
nx graph

# Grafo de proyectos afectados
nx affected --graph
```

### Project Details

```bash
# Ver detalles de un proyecto
nx show project web

# Ver todas las tareas disponibles
nx show project web --web
```

## Mejores Prácticas

### Mantén las Librerías Pequeñas y Enfocadas

```plaintext
# ❌ Malo: librería monolítica
libs/shared/
└── everything/    # Demasiado grande, afecta a todo

# ✅ Bueno: librerías granulares
libs/shared/
├── ui/           # Solo componentes UI
├── utils/        # Solo utilidades
├── hooks/        # Solo hooks compartidos
└── types/        # Solo tipos
```

### Usa Tags para Enforcer Boundaries

```json
// Esto previene imports incorrectos en compile time
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        {
          "sourceTag": "type:app",
          "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util"]
        }
      ]
    }
  ]
}
```

### Cachea Agresivamente

```json
// nx.json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "inputs": ["production", "^production"]
    },
    "test": {
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "e2e": {
      "cache": true
    }
  }
}
```

## Conclusión

Nx ha transformado cómo organizo proyectos React a escala. La combinación de monorepo, caching inteligente, y generators hace que mantener múltiples aplicaciones sea manejable.

**Puntos clave:**

- ✅ Estructura clara con apps y libs
- ✅ Boundaries enforceados con tags
- ✅ Caching local y distribuido
- ✅ Affected commands para CI eficiente
- ✅ Generators para consistencia

¿Ya usas Nx o alguna herramienta de monorepo? ¿Qué desafíos has encontrado al escalar? 🏗️
