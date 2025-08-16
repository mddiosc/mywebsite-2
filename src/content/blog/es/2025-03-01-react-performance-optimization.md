---
title: "Optimización de performance en React: Métricas que importan"
description: "Una guía práctica sobre cómo medir y optimizar el rendimiento en aplicaciones React. Herramientas, técnicas y métricas que realmente impactan la experiencia del usuario."
date: "2025-03-01"
tags: ["performance", "optimización", "react", "métricas", "web-vitals"]
author: "Miguel Ángel de Dios"
slug: "react-performance-optimization"
featured: false
---

La performance no es solo una métrica técnica, es la diferencia entre un usuario que se queda o uno que abandona tu aplicación. En este post, compartiré las técnicas y herramientas que uso para medir y optimizar el rendimiento en React, con ejemplos prácticos de mi portfolio.

## Las métricas que realmente importan

Antes de optimizar, necesitas medir. Estas son las métricas fundamentales que monitoreo:

### **Core Web Vitals**

Google define tres métricas clave que impactan directamente el SEO y la UX:

```typescript
// Ejemplo de medición con Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics({ name, delta, value, id }) {
  // Enviar métricas a tu servicio de analytics
  console.log({ name, delta, value, id })
}

// Medir automáticamente
getCLS(sendToAnalytics)  // Cumulative Layout Shift
getFID(sendToAnalytics)  // First Input Delay  
getFCP(sendToAnalytics)  // First Contentful Paint
getLCP(sendToAnalytics)  // Largest Contentful Paint
getTTFB(sendToAnalytics) // Time to First Byte
```

**Objetivos:**

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### **React-specific metrics**

```typescript
// Medir tiempo de renderizado de componentes
import { Profiler } from 'react'

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  if (actualDuration > 16) { // > 60fps
    console.warn(`Slow render: ${id} took ${actualDuration}ms`)
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MyComponents />
    </Profiler>
  )
}
```

## Optimizaciones en el bundle

### **Code splitting inteligente**

La carga lazy de rutas es fundamental, pero también puedes aplicarla a componentes pesados:

```typescript
// Lazy loading de rutas
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))

// Lazy loading de componentes pesados
const HeavyChart = lazy(() => import('./components/HeavyChart'))

function Dashboard() {
  const [showChart, setShowChart] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  )
}
```

### **Tree shaking efectivo**

Asegúrate de importar solo lo que necesitas:

```typescript
// ❌ Malo: Importa toda la librería
import * as _ from 'lodash'
import { motion } from 'framer-motion'

// ✅ Bueno: Importa solo las funciones específicas
import { debounce } from 'lodash-es'
import { m } from 'framer-motion' // versión optimizada
```

### **Análisis del bundle**

```bash
# Analizar el tamaño del bundle
pnpm build
npx vite-bundle-analyzer dist
```

En mi portfolio, esto me ayudó a identificar que `framer-motion` era el 40% del bundle. La solución:

```typescript
// Antes: 85kb
import { motion, AnimatePresence } from 'framer-motion'

// Después: 23kb - usando la versión mini
import { m, LazyMotion, domAnimation } from 'framer-motion'

function AnimatedComponent() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ opacity: 1 }}>
        Content
      </m.div>
    </LazyMotion>
  )
}
```

## Optimizaciones en React

### **Memoización estratégica**

No uses `memo()` en todo, úsalo estratégicamente:

```typescript
// ✅ Bueno: Componente que recibe props complejas y re-renderiza frecuentemente
const ExpensiveList = memo(({ items, onItemClick }) => {
  return (
    <div>
      {items.map(item => (
        <ExpensiveItem 
          key={item.id} 
          item={item} 
          onClick={onItemClick}
        />
      ))}
    </div>
  )
})

// ✅ Bueno: Prevenir re-renders por callback recreado
const ParentComponent = () => {
  const [items, setItems] = useState([])
  
  const handleItemClick = useCallback((id) => {
    // handle click
  }, [])
  
  return <ExpensiveList items={items} onItemClick={handleItemClick} />
}
```

### **Virtualizacion para listas largas**

```typescript
// Para listas de +100 items, usa virtualización
import { FixedSizeList as List } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Item data={items[index]} />
    </div>
  )

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### **Optimización de estado**

```typescript
// ❌ Malo: Estado que causa re-renders innecesarios
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: '',
  metadata: { lastUpdated: Date.now() }
})

// ✅ Bueno: Separar estado que cambia frecuentemente
const [formData, setFormData] = useState({ name: '', email: '', message: '' })
const [lastUpdated, setLastUpdated] = useState(Date.now())
```

## Optimización de imágenes

### **Formatos modernos**

```typescript
// Componente optimizado para imágenes
interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
}

function OptimizedImage({ src, alt, width, height }: OptimizedImageProps) {
  return (
    <picture>
      <source 
        srcSet={`${src}.avif`} 
        type="image/avif" 
      />
      <source 
        srcSet={`${src}.webp`} 
        type="image/webp" 
      />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
```

### **Lazy loading inteligente**

```typescript
// Hook personalizado para intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      rootMargin: '50px', // Cargar 50px antes de ser visible
      ...options
    })

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return [targetRef, isIntersecting]
}

// Uso en componente
function LazyImage({ src, alt }) {
  const [ref, isVisible] = useIntersectionObserver()
  
  return (
    <div ref={ref}>
      {isVisible ? (
        <OptimizedImage src={src} alt={alt} />
      ) : (
        <div className="bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

## Herramientas de monitoreo

### **Performance profiling en desarrollo**

```typescript
// Componente para medir performance en desarrollo
function PerformanceMonitor({ children, name }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-start`)
      
      return () => {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)
        
        const measure = performance.getEntriesByName(name)[0]
        if (measure.duration > 16) {
          console.warn(`${name} took ${measure.duration.toFixed(2)}ms`)
        }
      }
    }
  }, [name])

  return children
}
```

### **Lighthouse CI**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Audit URLs using Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          uploadDir: './lighthouse-results'
          configPath: './lighthouserc.json'
```

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## Técnicas avanzadas

### **Preloading estratégico**

```typescript
// Precargar recursos críticos
function preloadRoute(routePath: string) {
  const moduleMap = {
    '/about': () => import('./pages/About'),
    '/projects': () => import('./pages/Projects'),
    '/contact': () => import('./pages/Contact')
  }
  
  if (moduleMap[routePath]) {
    moduleMap[routePath]()
  }
}

// En el componente de navegación
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => preloadRoute(to)} // Precargar al hover
    >
      {children}
    </Link>
  )
}
```

### **Web Workers para tareas pesadas**

```typescript
// utils/webWorker.ts
export function createWorker(fn: Function) {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

// Uso para procesamiento pesado
function useHeavyCalculation(data) {
  const [result, setResult] = useState(null)
  
  useEffect(() => {
    const worker = createWorker(() => {
      self.onmessage = function(e) {
        const result = expensiveCalculation(e.data)
        self.postMessage(result)
      }
    })
    
    worker.postMessage(data)
    worker.onmessage = (e) => setResult(e.data)
    
    return () => worker.terminate()
  }, [data])
  
  return result
}
```

## Resultados en mi portfolio

Aplicando estas técnicas en mi portfolio:

**Antes de optimización:**

- LCP: 3.2s
- FID: 150ms
- Bundle size: 245kb
- Lighthouse score: 76

**Después de optimización:**

- LCP: 1.8s (-44%)
- FID: 45ms (-70%)
- Bundle size: 145kb (-41%)
- Lighthouse score: 97

### **Cambios más impactantes:**

1. **Code splitting por rutas**: -35% bundle inicial
2. **Framer Motion optimizado**: -62kb
3. **Imágenes WebP/AVIF**: -60% peso imágenes
4. **Memoización estratégica**: -30% re-renders
5. **Preloading on hover**: +50% perceived performance

## Herramientas recomendadas

### **Para desarrollo:**

```bash
# Performance monitoring
pnpm add web-vitals
pnpm add --dev @vitejs/plugin-legacy

# Bundle analysis
pnpm add --dev vite-bundle-analyzer

# Image optimization
pnpm add --dev @squoosh/lib
```

### **Para producción:**

- **Vercel Analytics**: Métricas reales de usuarios
- **Sentry Performance**: Monitoreo de errores y performance
- **Google PageSpeed Insights**: Auditorías automáticas

## Filosofía de optimización

Mi enfoque para optimización:

1. **Medir primero**: No optimices sin datos
2. **Usuario primero**: Enfócate en métricas que impactan UX
3. **Iterativo**: Optimiza, mide, repite
4. **Pragmático**: No sobre-optimices código simple

### **Checklist de performance**

```typescript
// Performance checklist para cada feature
const performanceChecklist = {
  bundle: 'Code splitting implementado?',
  images: 'Formatos modernos y lazy loading?',
  rendering: 'Memoización necesaria implementada?',
  network: 'Requests optimizados y cacheados?',
  monitoring: 'Métricas implementadas?'
}
```

## Conclusión

La optimización de performance en React no es una tarea única, sino un proceso continuo. Las técnicas más efectivas suelen ser las más simples: code splitting, optimización de imágenes y memoización estratégica.

La clave está en **medir constantemente** y **optimizar basándose en datos reales** de usuarios, no en micro-benchmarks.

¿Qué técnicas de optimización has encontrado más efectivas en tus proyectos? ¿Hay alguna métrica específica que monitoreas? Me encantaría conocer tu experiencia a través del [formulario de contacto](/contact).

---

**Recursos recomendados:**

- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [React Profiler Guide](https://react.dev/reference/react/Profiler)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Bundle Analyzer Tools](https://github.com/webpack-contrib/webpack-bundle-analyzer)
