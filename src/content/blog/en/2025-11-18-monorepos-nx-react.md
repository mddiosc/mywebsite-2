---
title: "Monorepos with Nx: Scaling React Projects"
description: "Complete guide to implementing monorepos with Nx in React projects: setup, structure, caching, generators, and CI/CD strategies."
date: "2025-11-18"
tags: ["nx", "monorepo", "react", "architecture", "ci-cd", "scalability"]
author: "Miguel Ángel de Dios"
slug: "monorepos-nx-react"
featured: false
---

After discussing micro-frontends and design systems, the natural next step is to talk about how to organize everything in a monorepo. Nx has become my favorite tool for this. Today I'm sharing my experience scaling React projects with Nx.

## Why Monorepos?

In large projects, maintaining multiple repositories becomes problematic:

- ❌ Version synchronization between repos
- ❌ Configuration duplication
- ❌ PRs touching multiple repos
- ❌ Complex integration testing
- ❌ Refactoring that crosses repo boundaries

Monorepos solve these problems:

- ✅ Single place for all related code
- ✅ Shared configurations
- ✅ Atomic commits touching multiple projects
- ✅ Simplified integration testing
- ✅ Better visibility of dependencies

## Why Nx?

Nx offers advantages over other monorepo tools:

- ✅ **Computation caching**: No unnecessary rebuilds
- ✅ **Affected commands**: Only run what changed
- ✅ **Generators**: Consistent scaffolding
- ✅ **Task orchestration**: Smart parallel execution
- ✅ **Nx Cloud**: Distributed cache for CI
- ✅ **Plugins**: First-class support for React, Next.js, Node, etc.

## Initial Setup

### Create an Nx Workspace

```bash
# Create workspace with React preset
npx create-nx-workspace@latest my-company --preset=react-monorepo

# Or start empty and add what you need
npx create-nx-workspace@latest my-company --preset=apps
```

### Workspace Structure

```plaintext
my-company/
├── apps/
│   ├── web/                    # Main app
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   ├── admin/                  # Admin app
│   │   ├── src/
│   │   ├── project.json
│   │   └── tsconfig.json
│   └── docs/                   # Documentation (Storybook)
├── libs/
│   ├── shared/
│   │   ├── ui/                 # Shared components
│   │   ├── utils/              # Utilities
│   │   └── types/              # TypeScript types
│   ├── features/
│   │   ├── auth/               # Authentication feature
│   │   ├── products/           # Products feature
│   │   └── orders/             # Orders feature
│   └── data-access/
│       ├── api/                # API client
│       └── state/              # Global state
├── tools/
│   └── generators/             # Custom generators
├── nx.json
├── tsconfig.base.json
└── package.json
```

## Nx Configuration

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
      "@my-company/shared/ui": ["libs/shared/ui/src/index.ts"],
      "@my-company/shared/utils": ["libs/shared/utils/src/index.ts"],
      "@my-company/shared/types": ["libs/shared/types/src/index.ts"],
      "@my-company/features/auth": ["libs/features/auth/src/index.ts"],
      "@my-company/features/products": ["libs/features/products/src/index.ts"],
      "@my-company/data-access/api": ["libs/data-access/api/src/index.ts"],
      "@my-company/data-access/state": ["libs/data-access/state/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

## Generating Projects

### Create an Application

```bash
# Create React app with Vite
nx g @nx/react:app web --directory=apps/web --bundler=vite

# Create Next.js app
nx g @nx/next:app marketing --directory=apps/marketing
```

### Create Libraries

```bash
# UI component library
nx g @nx/react:lib ui --directory=libs/shared/ui --component=false

# Utility library (no React)
nx g @nx/js:lib utils --directory=libs/shared/utils --bundler=none

# Feature library
nx g @nx/react:lib auth --directory=libs/features/auth
```

### Create Components

```bash
# Component in UI library
nx g @nx/react:component Button --project=shared-ui --export

# Component in feature
nx g @nx/react:component LoginForm --project=features-auth
```

## Library Architecture

### Organization by Type

```plaintext
libs/
├── shared/           # Code shared between apps
│   ├── ui/          # Presentational components
│   ├── utils/       # Utility functions
│   └── types/       # Types and interfaces
├── features/        # Complete features
│   ├── auth/        # Login, registration, etc.
│   └── products/    # Product CRUD
└── data-access/     # Data access
    ├── api/         # HTTP client
    └── state/       # Zustand, Redux, etc.
```

### Boundaries and Tags

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

## UI Library Example

### Structure

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

### Button Component

```tsx
// libs/shared/ui/src/lib/Button/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@my-company/shared/utils';

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
// ... more components
```

## Feature Libraries

### Feature Structure

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

### Authentication Hook

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

## Caching and Performance

### Local Computation Caching

Nx automatically caches build and test results:

```bash
# First run: 45s
nx build web

# Second run (no changes): 0.5s
nx build web
# [local cache]
```

### Nx Cloud for CI

```bash
# Connect to Nx Cloud
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

      # Nx Cloud caches between CI runs
      - run: npx nx affected -t lint test build --parallel=3
```

### Affected Commands

Only run tasks for projects affected by changes:

```bash
# Only lint affected projects
nx affected -t lint

# Only test affected projects
nx affected -t test

# Only build affected projects
nx affected -t build

# See which projects are affected
nx affected --graph
```

## Custom Generators

### Create a Generator

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

  // Generate base library
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

  // Add template files
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

### Use the Generator

```bash
# Create complete feature
nx g @my-company/tools-generators:feature products --directory=commerce

# Generates:
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

## Deployment Strategies

### Deploy by App

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

      # Only build if web is affected
      - run: |
          if npx nx show projects --affected | grep -q "web"; then
            npx nx build web --configuration=production
            # Deploy to Vercel, AWS, etc.
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

## Workspace Visualization

### Dependency Graph

```bash
# View interactive graph
nx graph

# Graph of affected projects
nx affected --graph
```

### Project Details

```bash
# View project details
nx show project web

# View all available tasks
nx show project web --web
```

## Best Practices

### Keep Libraries Small and Focused

```plaintext
# ❌ Bad: monolithic library
libs/shared/
└── everything/    # Too large, affects everything

# ✅ Good: granular libraries
libs/shared/
├── ui/           # Only UI components
├── utils/        # Only utilities
├── hooks/        # Only shared hooks
└── types/        # Only types
```

### Use Tags to Enforce Boundaries

```json
// This prevents incorrect imports at compile time
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

### Cache Aggressively

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

## Conclusion

Nx has transformed how I organize React projects at scale. The combination of monorepo, smart caching, and generators makes maintaining multiple applications manageable.

**Key points:**

- ✅ Clear structure with apps and libs
- ✅ Boundaries enforced with tags
- ✅ Local and distributed caching
- ✅ Affected commands for efficient CI
- ✅ Generators for consistency

Are you already using Nx or another monorepo tool? What challenges have you encountered when scaling? 🏗️
