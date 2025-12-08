---
title: "Construyendo mi Portfolio: Decisiones de arquitectura y stack tecnológico"
description: "Un análisis detallado de las decisiones técnicas detrás de mi portfolio personal: por qué elegí Vite sobre Create React App, cómo estructuré el proyecto y las lecciones aprendidas."
date: "2025-02-01"
tags: ["arquitectura", "vite", "portfolio", "decisiones-técnicas", "react"]
author: "Miguel Ángel de Dios"
slug: "portfolio-architecture-decisions"
featured: false
---

Después de años trabajando con sistemas complejos en la industria del turismo, construir mi portfolio personal fue una oportunidad única para aplicar todo lo aprendido sin las limitaciones de sistemas legacy. En este post, compartiré las decisiones técnicas que tomé y el razonamiento detrás de cada una.

Como mencioné en mi [transición de GDS a React](/blog/gds-to-react), mi experiencia con sistemas críticos influyó fuertemente en cómo abordo la arquitectura de software. Este portfolio no es solo una vitrina de habilidades, sino un laboratorio donde experimento con las mejores prácticas modernas.

## La decisión fundamental: ¿Por qué Vite?

La primera gran decisión fue elegir entre Create React App (CRA), Next.js, o Vite. Después de evaluar las opciones, Vite fue la elección clara:

### **Performance de desarrollo**

En mis años con Amadeus, aprendí que la velocidad de feedback es crucial para la productividad. Vite ofrece:

```bash
# Tiempo de inicio
Create React App: ~15-30 segundos
Next.js (dev): ~8-15 segundos  
Vite: ~2-5 segundos
```

**Hot Module Replacement (HMR) instantáneo** significa que veo cambios inmediatamente, algo que valoro después de trabajar con sistemas donde compilar podía tomar minutos.

### **Control granular sobre el build**

A diferencia de CRA, Vite me permite:

```typescript
// vite.config.ts - Control total sobre la configuración
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

Este nivel de control me permite optimizar específicamente para mi caso de uso, algo que aprecio viniendo de sistemas donde cada milisegundo importa.

## Arquitectura del proyecto: Separación por dominio

Una de las lecciones más valiosas de trabajar con Amadeus fue la importancia de una arquitectura clara. Organicé el proyecto por **dominios funcionales** en lugar de por tipos de archivos:

```text
src/
├── components/          # Componentes compartidos
├── pages/              # Páginas principales
│   ├── Home/
│   │   ├── index.tsx
│   │   ├── components/ # Componentes específicos de Home
│   │   ├── hooks/      # Lógica específica de Home
│   │   └── types.ts    # Tipos específicos de Home
│   ├── About/
│   ├── Projects/
│   └── Contact/
├── hooks/              # Hooks compartidos
├── lib/                # Utilidades y configuraciones
└── types/              # Tipos globales
```

### **¿Por qué esta estructura?**

En sistemas complejos como los GDS, la **cohesión** es fundamental. Prefiero tener toda la lógica relacionada con una página en el mismo lugar:

```typescript
// pages/Contact/hooks/useContactForm.ts
export const useContactForm = () => {
  // Toda la lógica específica del formulario de contacto
  // está encapsulada aquí, cerca de donde se usa
}

// pages/Contact/components/ContactForm.tsx  
import { useContactForm } from '../hooks/useContactForm'
```

Esto reduce la **carga cognitiva** - no tengo que saltar entre múltiples carpetas para entender cómo funciona una feature.

## Stack tecnológico: Decisiones pragmáticas

### **Estado: Zustand + React Query**

Después de trabajar con Redux en proyectos complejos, elegí una aproximación más simple:

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

**Zustand** para estado local simple y **React Query** para estado del servidor. Esta combinación elimina ~80% del boilerplate que tendría con Redux.

### **Styling: Tailwind CSS**

Viniendo de sistemas donde el CSS podía volverse inmanejable, Tailwind ofrece:

1. **Consistencia**: Design tokens integrados
2. **Performance**: Solo el CSS que uso se incluye en el bundle
3. **Velocidad de desarrollo**: No context switching entre archivos

```tsx
// Antes: Múltiples archivos CSS, naming conflicts
<div className="hero-section">
  <h1 className="hero-title">Título</h1>
</div>

// Ahora: Todo en el componente, sin naming conflicts
<div className="flex flex-col items-center justify-center min-h-screen">
  <h1 className="text-4xl font-bold text-gray-900">Título</h1>
</div>
```

### **Animaciones: Framer Motion**

Para las animaciones elegí Framer Motion por su **declarative API** y excelente performance:

```typescript
// constants/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// En cualquier componente
<motion.div {...fadeInUp}>
  Contenido animado
</motion.div>
```

## Internacionalización: Pensando globalmente

Implementé i18n desde el día uno usando **react-i18next**:

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

La estructura permite fácil expansión:

```text
locales/
├── en/
│   └── translation.json
└── es/
    └── translation.json
```

## Routing: Simplicidad con React Router

Para un portfolio, Next.js hubiera sido overkill. React Router DOM me da el control que necesito:

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

## Testing: Estrategia pragmática

Implementé testing con **Vitest** y **React Testing Library**:

```typescript
// test/setup.ts
import '@testing-library/jest-dom'
import './i18n-for-tests'

// Configuración específica para tests
```

Mi filosofía: **testo lo que importa**. Principalmente:

- Lógica de negocio (hooks personalizados)
- Componentes con interacciones complejas
- Utilidades críticas

## Deployment: Vercel por simplicidad

Para deployment elegí **Vercel** por:

1. **Zero-config**: Detecta Vite automáticamente
2. **Performance**: CDN global incluido
3. **DX**: Preview deployments automáticos en PRs

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Lecciones aprendidas

### **1. La arquitectura importa desde el día uno**

No subestimes la importancia de una estructura clara. Es más fácil mantener esta organización desde el inicio que refactorizar después.

### **2. Las herramientas modernas son increíblemente productivas**

El stack moderno (Vite + TypeScript + Tailwind) me permite iterar mucho más rápido que herramientas más antiguas.

### **3. La experiencia previa en sistemas complejos es un activo**

Los principios que aprendí en Amadeus (modularidad, testing, performance) se aplican perfectamente al desarrollo frontend.

## Próximos pasos

Este portfolio es un **living project**. Próximas mejoras planeadas:

- **Analytics**: Implementar tracking de usuario
- **CMS**: Posible migración del blog a un CMS headless
- **PWA**: Capacidades offline para el blog
- **Testing visual**: Integración con Chromatic

## Conclusión

Construir este portfolio me permitió aplicar años de experiencia en sistemas críticos al mundo del frontend moderno. Cada decisión técnica refleja lecciones aprendidas trabajando con sistemas que procesan millones de transacciones.

La clave no está en usar las tecnologías más nuevas, sino en elegir las herramientas que mejor se adapten a tus necesidades específicas y experiencia previa.

¿Has enfrentado decisiones similares en tus proyectos? Me encantaría conocer tu perspectiva en los comentarios o a través del [formulario de contacto](/contact).

---

**Recursos adicionales:**

- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Repository de este portfolio](https://github.com/mddiosc/mywebsite-2)
