---
title: "Building my Portfolio: Architecture decisions and tech stack"
description: "A detailed analysis of the technical decisions behind my personal portfolio: why I chose Vite over Create React App, how I structured the project, and lessons learned."
date: "2025-02-01"
tags: ["architecture", "vite", "portfolio", "technical-decisions", "react"]
author: "Miguel Ángel de Dios"
slug: "portfolio-architecture-decisions"
featured: true
---

After years working with complex systems in the tourism industry, building my personal portfolio was a unique opportunity to apply everything I learned without the constraints of legacy systems. In this post, I'll share the technical decisions I made and the reasoning behind each one.

As I mentioned in my [transition from GDS to React](/blog/gds-to-react), my experience with critical systems strongly influenced how I approach software architecture. This portfolio isn't just a skills showcase, but a laboratory where I experiment with modern best practices.

## The fundamental decision: Why Vite?

The first major decision was choosing between Create React App (CRA), Next.js, or Vite. After evaluating the options, Vite was the clear choice:

### **Development performance**

In my years with Amadeus, I learned that feedback speed is crucial for productivity. Vite offers:

```bash
# Startup time
Create React App: ~15-30 seconds
Next.js (dev): ~8-15 seconds  
Vite: ~2-5 seconds
```

**Instant Hot Module Replacement (HMR)** means I see changes immediately, something I value after working with systems where compiling could take minutes.

### **Granular control over the build**

Unlike CRA, Vite allows me:

```typescript
// vite.config.ts - Full control over configuration
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react-i18next', '@tanstack/react-query']
  }
})
```

This level of control allows me to optimize specifically for my use case, something I appreciate coming from systems where every millisecond matters.

## Project architecture: Domain-driven organization

One of the most valuable lessons from working with Amadeus was the importance of clear architecture. I organized the project by **functional domains** rather than by file types:

```text
src/
├── components/          # Shared components
├── pages/              # Main pages
│   ├── Home/
│   │   ├── index.tsx
│   │   ├── components/ # Home-specific components
│   │   ├── hooks/      # Home-specific logic
│   │   └── types.ts    # Home-specific types
│   ├── About/
│   ├── Projects/
│   └── Contact/
├── hooks/              # Shared hooks
├── lib/                # Utilities and configurations
└── types/              # Global types
```

### **Why this structure?**

In complex systems like GDS, **cohesion** is fundamental. I prefer having all logic related to a page in the same place:

```typescript
// pages/Contact/hooks/useContactForm.ts
export const useContactForm = () => {
  // All contact form specific logic
  // is encapsulated here, close to where it's used
}

// pages/Contact/components/ContactForm.tsx  
import { useContactForm } from '../hooks/useContactForm'
```

This reduces **cognitive load** - I don't have to jump between multiple folders to understand how a feature works.

## Tech stack: Pragmatic decisions

### **State: Zustand + React Query**

After working with Redux on complex projects, I chose a simpler approach:

```typescript
// stores/useLanguageStore.ts
import { create } from 'zustand'

interface LanguageState {
  language: 'es' | 'en'
  setLanguage: (lang: 'es' | 'en') => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'es',
  setLanguage: (lang) => set({ language: lang })
}))
```

**Zustand** for simple local state and **React Query** for server state. This combination eliminates ~80% of the boilerplate I would have with Redux.

### **Styling: Tailwind CSS**

Coming from systems where CSS could become unmanageable, Tailwind offers:

1. **Consistency**: Integrated design tokens
2. **Performance**: Only the CSS I use is included in the bundle
3. **Development speed**: No context switching between files

```tsx
// Before: Multiple CSS files, naming conflicts
<div className="hero-section">
  <h1 className="hero-title">Title</h1>
</div>

// Now: Everything in the component, no naming conflicts
<div className="flex flex-col items-center justify-center min-h-screen">
  <h1 className="text-4xl font-bold text-gray-900">Title</h1>
</div>
```

### **Animations: Framer Motion**

For animations I chose Framer Motion for its **declarative API** and excellent performance:

```typescript
// constants/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// In any component
<motion.div {...fadeInUp}>
  Animated content
</motion.div>
```

## Internationalization: Thinking globally

I implemented i18n from day one using **react-i18next**:

```typescript
// i18n/i18n.ts
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation }
    },
    lng: 'es',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })
```

The structure allows for easy expansion:

```text
locales/
├── en/
│   └── translation.json
└── es/
    └── translation.json
```

## Routing: Simplicity with React Router

For a portfolio, Next.js would have been overkill. React Router DOM gives me the control I need:

```typescript
// router/routes.tsx
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'contact', element: <Contact /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> }
    ]
  }
])
```

## Testing: Pragmatic strategy

I implemented testing with **Vitest** and **React Testing Library**:

```typescript
// test/setup.ts
import '@testing-library/jest-dom'
import './i18n-for-tests'

// Test-specific configuration
```

My philosophy: **test what matters**. Mainly:

- Business logic (custom hooks)
- Components with complex interactions
- Critical utilities

## Deployment: Vercel for simplicity

For deployment I chose **Vercel** because:

1. **Zero-config**: Automatically detects Vite
2. **Performance**: Global CDN included
3. **DX**: Automatic preview deployments on PRs

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Lessons learned

### **1. Architecture matters from day one**

Don't underestimate the importance of a clear structure. It's easier to maintain this organization from the start than to refactor later.

### **2. Modern tools are incredibly productive**

The modern stack (Vite + TypeScript + Tailwind) allows me to iterate much faster than older tools.

### **3. Previous experience in complex systems is an asset**

The principles I learned at Amadeus (modularity, testing, performance) apply perfectly to frontend development.

## Next steps

This portfolio is a **living project**. Upcoming planned improvements:

- **Analytics**: Implement user tracking
- **CMS**: Possible blog migration to headless CMS
- **PWA**: Offline capabilities for the blog
- **Visual testing**: Integration with Chromatic

## Conclusion

Building this portfolio allowed me to apply years of experience in critical systems to the modern frontend world. Each technical decision reflects lessons learned working with systems that process millions of transactions.

The key isn't using the newest technologies, but choosing the tools that best fit your specific needs and previous experience.

Have you faced similar decisions in your projects? I'd love to hear your perspective in the comments or through the [contact form](/contact).

---

**Additional resources:**

- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [This portfolio's repository](https://github.com/mddiosc/mywebsite-2)
