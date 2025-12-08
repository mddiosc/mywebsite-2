---
title: "Micro-frontends with Shared Design Systems: Visual consistency in distributed architectures"
description: "I explore proven strategies for implementing shared design systems in micro-frontend architectures, from Module Federation to monorepos, ensuring visual coherence without sacrificing team autonomy."
date: "2025-05-15"
tags: ["micro-frontends", "design-systems", "module-federation", "monorepo", "architecture", "enterprise"]
author: "Miguel Ángel de Dios"
slug: "micro-frontends-shared-design-systems"
featured: true
---

As I promised in my previous post about design systems, today we'll tackle one of the most complex challenges I've faced in enterprise architectures: **maintaining visual consistency when your application is composed of multiple micro-frontends developed by independent teams**.

## The real problem: Visual fragmentation at scale

### When each team has their own "blue"

In my experience leading micro-frontend migrations, the first symptom of problems is always visual. Imagine this situation:

- **Team A** uses `#3b82f6` for primary buttons
- **Team B** decided that `#2563eb` was "more professional"
- **Team C** simply copied the color from old documentation: `#1d4ed8`

The result: users feeling like they're navigating between three different applications.

```tsx
// ❌ Reality without shared design system
// micro-frontend-checkout
const CheckoutButton = () => (
  <button className="bg-[#3b82f6] hover:bg-[#2563eb]">
    Complete purchase
  </button>
);

// micro-frontend-catalog
const AddToCartButton = () => (
  <button style={{ backgroundColor: '#2563eb' }}>
    Add to cart
  </button>
);

// micro-frontend-profile
const SaveButton = () => (
  <button className="bg-blue-700"> {/* Tailwind default */}
    Save changes
  </button>
);
```

## Distribution strategies: The heart of the problem

### Option 1: NPM Package (The classic)

The most common approach is publishing the design system as an npm package:

```typescript
// @company/design-system/package.json
{
  "name": "@company/design-system",
  "version": "2.4.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./tokens": {
      "import": "./dist/tokens.mjs",
      "require": "./dist/tokens.js"
    },
    "./css": "./dist/styles.css"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

```typescript
// @company/design-system/src/index.ts
// Granular exports for optimal tree-shaking
export { Button, type ButtonProps } from './components/Button';
export { Input, type InputProps } from './components/Input';
export { Card, type CardProps } from './components/Card';
export { Modal, type ModalProps } from './components/Modal';

// Tokens as constants
export { designTokens } from './tokens';
export type { DesignTokens } from './tokens';

// Utilities
export { cn } from './utils/cn';
export { createTheme } from './utils/theme';
```

**Pros:**

- ✅ Clear semantic versioning
- ✅ Each micro-frontend controls when to update
- ✅ Works with any bundler

**Cons:**

- ❌ Code duplication if multiple micro-frontends use different versions
- ❌ "Dependency hell" in coordinated updates
- ❌ Bundle size increases with each micro-frontend

### Option 2: Module Federation (The modern)

Webpack 5 and Vite (with plugins) allow sharing modules at runtime:

```typescript
// shell-app/vite.config.ts
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        checkout: 'http://localhost:3001/assets/remoteEntry.js',
        catalog: 'http://localhost:3002/assets/remoteEntry.js',
        profile: 'http://localhost:3003/assets/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@company/design-system': { 
          singleton: true, 
          requiredVersion: '^2.4.0',
          eager: true // Immediate loading to avoid FOUC
        }
      }
    })
  ]
});
```

```typescript
// micro-frontend-checkout/vite.config.ts
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './CheckoutFlow': './src/CheckoutFlow.tsx',
        './CartSummary': './src/CartSummary.tsx'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@company/design-system': { singleton: true }
      }
    })
  ]
});
```

**The magic: A single instance of the design system shared between all micro-frontends.**

```typescript
// shell-app/src/App.tsx
import { Suspense, lazy } from 'react';
import { ThemeProvider, LoadingSpinner } from '@company/design-system';

// Dynamic loading of micro-frontends
const CheckoutFlow = lazy(() => import('checkout/CheckoutFlow'));
const ProductCatalog = lazy(() => import('catalog/ProductCatalog'));
const UserProfile = lazy(() => import('profile/UserProfile'));

export const App = () => {
  return (
    <ThemeProvider theme="light">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/checkout/*" element={<CheckoutFlow />} />
          <Route path="/catalog/*" element={<ProductCatalog />} />
          <Route path="/profile/*" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};
```

### Option 3: Monorepo with Turborepo/Nx (The enterprise)

For large organizations, a monorepo offers the best developer experience:

```text
packages/
├── design-system/           # The design system
│   ├── src/
│   │   ├── components/
│   │   ├── tokens/
│   │   └── utils/
│   └── package.json
├── shared-utils/            # Shared utilities
│   └── package.json
apps/
├── shell/                   # Container app
├── checkout/                # Micro-frontend
├── catalog/                 # Micro-frontend
└── profile/                 # Micro-frontend
```

```typescript
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

```typescript
// packages/design-system/package.json
{
  "name": "@company/design-system",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "lint": "eslint src/",
    "test": "vitest run"
  }
}
```

```typescript
// apps/checkout/package.json
{
  "name": "@company/checkout",
  "dependencies": {
    "@company/design-system": "workspace:*",
    "@company/shared-utils": "workspace:*"
  }
}
```

**Pros:**

- ✅ Atomic changes: update the design system and all consumers in a single PR
- ✅ Exceptional developer experience with hot reload
- ✅ Integrated testing between packages
- ✅ No version conflicts

**Cons:**

- ❌ Requires more complex CI/CD infrastructure
- ❌ All teams work in the same repo
- ❌ Initial learning curve

## Design System Architecture for Micro-frontends

### The token layer: Immutable and shared

```typescript
// packages/design-system/src/tokens/index.ts
export const tokens = {
  colors: {
    // Brand colors - NEVER change without major version
    brand: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4'
    },
    // Semantic colors - Consistent across the app
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9'
    },
    // Neutrals - The foundation of everything
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    }
  },
  typography: {
    fontFamilies: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace']
    },
    fontSizes: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease'
  }
} as const;

export type Tokens = typeof tokens;
```

### Headless components with variants

For maximum flexibility between micro-frontends, I use the headless component pattern with class-variance-authority:

```typescript
// packages/design-system/src/components/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  // Base styles - Shared by all variants
  [
    'inline-flex items-center justify-center',
    'font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50'
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-primary text-white',
          'hover:bg-blue-600 active:bg-blue-700',
          'focus-visible:ring-brand-primary'
        ],
        secondary: [
          'bg-neutral-100 text-neutral-900',
          'hover:bg-neutral-200 active:bg-neutral-300',
          'focus-visible:ring-neutral-500'
        ],
        outline: [
          'border-2 border-brand-primary text-brand-primary bg-transparent',
          'hover:bg-brand-primary hover:text-white',
          'focus-visible:ring-brand-primary'
        ],
        ghost: [
          'text-neutral-700 bg-transparent',
          'hover:bg-neutral-100 active:bg-neutral-200',
          'focus-visible:ring-neutral-500'
        ],
        destructive: [
          'bg-semantic-error text-white',
          'hover:bg-red-600 active:bg-red-700',
          'focus-visible:ring-semantic-error'
        ]
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
        md: 'h-10 px-4 text-sm rounded-lg gap-2',
        lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
        xl: 'h-14 px-8 text-lg rounded-xl gap-3'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner className="w-4 h-4" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        
        {children}
        
        {rightIcon && !isLoading && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Context Provider for theming

```typescript
// packages/design-system/src/providers/ThemeProvider.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'ds-theme'
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    
    const resolved = theme === 'system' ? systemTheme : theme;
    setResolvedTheme(resolved);
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Communication patterns between micro-frontends

### Event Bus for visual state synchronization

```typescript
// packages/shared-utils/src/eventBus.ts
type EventCallback<T = unknown> = (data: T) => void;

class DesignSystemEventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.add(callback as EventCallback);
    
    // Returns cleanup function
    return () => {
      callbacks.delete(callback as EventCallback);
    };
  }

  emit<T>(event: string, data: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Predefined events for design system
  emitThemeChange(theme: 'light' | 'dark') {
    this.emit('ds:theme-change', { theme });
  }

  onThemeChange(callback: (data: { theme: 'light' | 'dark' }) => void) {
    return this.on('ds:theme-change', callback);
  }
}

// Global singleton - shared between micro-frontends
export const dsEventBus = new DesignSystemEventBus();

// Ensure it's the same across all micro-frontends
if (typeof window !== 'undefined') {
  (window as any).__DS_EVENT_BUS__ = (window as any).__DS_EVENT_BUS__ || dsEventBus;
}

export const getEventBus = (): DesignSystemEventBus => {
  if (typeof window !== 'undefined') {
    return (window as any).__DS_EVENT_BUS__;
  }
  return dsEventBus;
};
```

### Usage in micro-frontends

```typescript
// shell-app/src/ThemeToggle.tsx
import { Button, useTheme } from '@company/design-system';
import { getEventBus } from '@company/shared-utils';

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const eventBus = getEventBus();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Notify all micro-frontends
    eventBus.emitThemeChange(newTheme);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {resolvedTheme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};
```

```typescript
// micro-frontend-checkout/src/hooks/useSyncTheme.ts
import { useEffect } from 'react';
import { useTheme } from '@company/design-system';
import { getEventBus } from '@company/shared-utils';

export const useSyncTheme = () => {
  const { setTheme } = useTheme();
  const eventBus = getEventBus();

  useEffect(() => {
    const unsubscribe = eventBus.onThemeChange(({ theme }) => {
      setTheme(theme);
    });

    return unsubscribe;
  }, [setTheme, eventBus]);
};
```

## Testing in distributed architectures

### Visual integration tests

```typescript
// packages/design-system/src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  describe('Rendering', () => {
    it('renders all variants correctly', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
      
      variants.forEach(variant => {
        const { unmount } = render(
          <Button variant={variant}>Click me</Button>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    it('renders all sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      
      sizes.forEach(size => {
        const { unmount } = render(
          <Button size={size}>Click me</Button>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Interactions', () => {
    it('handles click events', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when loading', async () => {
      const onClick = vi.fn();
      render(<Button isLoading onClick={onClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Enter</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await userEvent.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
      
      await userEvent.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });
});
```

### Visual regression testing with Chromatic

```yaml
# .github/workflows/design-system-ci.yml
name: Design System CI

on:
  push:
    paths:
      - 'packages/design-system/**'
  pull_request:
    paths:
      - 'packages/design-system/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install

      - name: Run unit tests
        run: pnpm --filter @company/design-system test

      - name: Build Storybook
        run: pnpm --filter @company/design-system build-storybook

      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          workingDir: packages/design-system
          buildScriptName: build-storybook
          onlyChanged: true
```

## Version management: The key to success

### Strict Semantic Versioning

```typescript
// scripts/version-check.ts
interface VersionRule {
  type: 'major' | 'minor' | 'patch';
  patterns: RegExp[];
  description: string;
}

const versionRules: VersionRule[] = [
  {
    type: 'major',
    patterns: [
      /BREAKING CHANGE:/i,
      /^feat!:/,
      /^fix!:/,
      /^refactor!:/
    ],
    description: 'Breaking changes: API changes, token removals, component signature changes'
  },
  {
    type: 'minor',
    patterns: [
      /^feat:/,
      /^feat\(.+\):/
    ],
    description: 'New features: new components, new variants, new tokens'
  },
  {
    type: 'patch',
    patterns: [
      /^fix:/,
      /^fix\(.+\):/,
      /^docs:/,
      /^style:/,
      /^refactor:/,
      /^perf:/,
      /^test:/
    ],
    description: 'Bug fixes, documentation, performance improvements'
  }
];

// Automatic changelog based on commits
export const generateChangelog = (commits: string[]): string => {
  const sections = {
    breaking: [] as string[],
    features: [] as string[],
    fixes: [] as string[],
    other: [] as string[]
  };

  commits.forEach(commit => {
    if (commit.includes('BREAKING CHANGE:') || commit.includes('!:')) {
      sections.breaking.push(commit);
    } else if (commit.startsWith('feat')) {
      sections.features.push(commit);
    } else if (commit.startsWith('fix')) {
      sections.fixes.push(commit);
    } else {
      sections.other.push(commit);
    }
  });

  let changelog = '';
  
  if (sections.breaking.length) {
    changelog += '## ⚠️ Breaking Changes\n\n';
    sections.breaking.forEach(c => changelog += `- ${c}\n`);
  }
  
  if (sections.features.length) {
    changelog += '\n## ✨ Features\n\n';
    sections.features.forEach(c => changelog += `- ${c}\n`);
  }
  
  if (sections.fixes.length) {
    changelog += '\n## 🐛 Bug Fixes\n\n';
    sections.fixes.forEach(c => changelog += `- ${c}\n`);
  }

  return changelog;
};
```

### Automatic migration guides

```typescript
// packages/design-system/migrations/v2-to-v3.ts
export const migrationGuide = {
  version: '3.0.0',
  fromVersion: '2.x',
  changes: [
    {
      type: 'component-rename',
      before: 'PrimaryButton',
      after: 'Button variant="primary"',
      codemod: `
        // Before
        import { PrimaryButton } from '@company/design-system';
        <PrimaryButton>Click</PrimaryButton>
        
        // After
        import { Button } from '@company/design-system';
        <Button variant="primary">Click</Button>
      `
    },
    {
      type: 'token-change',
      before: 'colors.blue.500',
      after: 'colors.brand.primary',
      codemod: `
        // tailwind.config.js - update references
        // bg-blue-500 -> bg-brand-primary
      `
    },
    {
      type: 'prop-rename',
      component: 'Button',
      before: 'loading',
      after: 'isLoading',
      codemod: `
        // Before
        <Button loading>Saving...</Button>
        
        // After
        <Button isLoading>Saving...</Button>
      `
    }
  ]
};

// Automatic codemod with jscodeshift
export const runMigration = async (targetDir: string) => {
  const { execSync } = await import('child_process');
  
  migrationGuide.changes.forEach(change => {
    if (change.type === 'component-rename') {
      execSync(
        `npx jscodeshift -t ./codemods/rename-component.ts ${targetDir} --component=${change.before} --newName=${change.after}`,
        { stdio: 'inherit' }
      );
    }
  });
};
```

## Metrics and observability

### Component usage tracking

```typescript
// packages/design-system/src/utils/analytics.ts
interface ComponentUsageEvent {
  component: string;
  variant?: string;
  size?: string;
  microFrontend: string;
  timestamp: number;
}

class DesignSystemAnalytics {
  private buffer: ComponentUsageEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  track(event: Omit<ComponentUsageEvent, 'timestamp' | 'microFrontend'>) {
    this.buffer.push({
      ...event,
      microFrontend: this.getMicroFrontendName(),
      timestamp: Date.now()
    });
  }

  private getMicroFrontendName(): string {
    // Detect current micro-frontend
    return (window as any).__MF_NAME__ || 'unknown';
  }

  private async flush() {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      await fetch('/api/design-system-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      // Re-add events if sending fails
      this.buffer = [...events, ...this.buffer];
    }
  }
}

export const dsAnalytics = new DesignSystemAnalytics();

// HOC for automatic tracking
export const withAnalytics = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    useEffect(() => {
      dsAnalytics.track({
        component: componentName,
        variant: (props as any).variant,
        size: (props as any).size
      });
    }, []);

    return <WrappedComponent {...props} />;
  };
};
```

## Conclusion: The balance between autonomy and consistency

After implementing shared design systems in multiple micro-frontend architectures, my recommendation is clear:

1. **Start with Module Federation** if you're already using Webpack 5 or Vite - the bundle size reduction is significant
2. **Consider a monorepo** if your organization can handle the CI/CD complexity
3. **Invest in tokens from day 1** - they're the foundation of everything
4. **Automate migrations** - codemods are your best friend
5. **Measure adoption** - what isn't measured, doesn't improve

The secret is finding the balance: enough structure to guarantee consistency, but enough flexibility for each team to iterate quickly.

Have you implemented micro-frontends in your organization? What strategy do you use to maintain visual consistency? I'd love to hear about your experience in the comments.
