---
title: "React Performance Optimization: Metrics that matter"
description: "A practical guide on how to measure and optimize performance in React applications. Tools, techniques, and metrics that truly impact user experience."
date: "2025-03-01"
tags: ["performance", "optimization", "react", "metrics", "web-vitals"]
author: "Miguel Ángel de Dios"
slug: "react-performance-optimization"
featured: true
---

Performance isn't just a technical metric—it's the difference between a user who stays and one who abandons your application. In this post, I'll share the techniques and tools I use to measure and optimize performance in React, with practical examples from my portfolio.

## Metrics that really matter

Before optimizing, you need to measure. These are the fundamental metrics I monitor:

### **Core Web Vitals**

Google defines three key metrics that directly impact SEO and UX:

```typescript
// Example of measuring with Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics({ name, delta, value, id }) {
  // Send metrics to your analytics service
  console.log({ name, delta, value, id })
}

// Measure automatically
getCLS(sendToAnalytics)  // Cumulative Layout Shift
getFID(sendToAnalytics)  // First Input Delay  
getFCP(sendToAnalytics)  // First Contentful Paint
getLCP(sendToAnalytics)  // Largest Contentful Paint
getTTFB(sendToAnalytics) // Time to First Byte
```

**Targets:**

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### **React-specific metrics**

```typescript
// Measure component rendering time
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

## Bundle optimizations

### **Smart code splitting**

Lazy loading routes is fundamental, but you can also apply it to heavy components:

```typescript
// Route lazy loading
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))

// Heavy component lazy loading
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

### **Effective tree shaking**

Make sure to import only what you need:

```typescript
// ❌ Bad: Imports entire library
import * as _ from 'lodash'
import { motion } from 'framer-motion'

// ✅ Good: Imports only specific functions
import { debounce } from 'lodash-es'
import { m } from 'framer-motion' // optimized version
```

### **Bundle analysis**

```bash
# Analyze bundle size
pnpm build
npx vite-bundle-analyzer dist
```

In my portfolio, this helped me identify that `framer-motion` was 40% of the bundle. The solution:

```typescript
// Before: 85kb
import { motion, AnimatePresence } from 'framer-motion'

// After: 23kb - using mini version
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

## React optimizations

### **Strategic memoization**

Don't use `memo()` everywhere, use it strategically:

```typescript
// ✅ Good: Component that receives complex props and re-renders frequently
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

// ✅ Good: Prevent re-renders from recreated callback
const ParentComponent = () => {
  const [items, setItems] = useState([])
  
  const handleItemClick = useCallback((id) => {
    // handle click
  }, [])
  
  return <ExpensiveList items={items} onItemClick={handleItemClick} />
}
```

### **Virtualization for long lists**

```typescript
// For lists of +100 items, use virtualization
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

### **State optimization**

```typescript
// ❌ Bad: State that causes unnecessary re-renders
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: '',
  metadata: { lastUpdated: Date.now() }
})

// ✅ Good: Separate frequently changing state
const [formData, setFormData] = useState({ name: '', email: '', message: '' })
const [lastUpdated, setLastUpdated] = useState(Date.now())
```

## Image optimization

### **Modern formats**

```typescript
// Optimized image component
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

### **Smart lazy loading**

```typescript
// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      rootMargin: '50px', // Load 50px before being visible
      ...options
    })

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return [targetRef, isIntersecting]
}

// Usage in component
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

## Monitoring tools

### **Performance profiling in development**

```typescript
// Component to measure performance in development
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

## Advanced techniques

### **Strategic preloading**

```typescript
// Preload critical resources
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

// In navigation component
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => preloadRoute(to)} // Preload on hover
    >
      {children}
    </Link>
  )
}
```

### **Web Workers for heavy tasks**

```typescript
// utils/webWorker.ts
export function createWorker(fn: Function) {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

// Usage for heavy processing
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

## Results in my portfolio

Applying these techniques to my portfolio:

**Before optimization:**

- LCP: 3.2s
- FID: 150ms
- Bundle size: 245kb
- Lighthouse score: 76

**After optimization:**

- LCP: 1.8s (-44%)
- FID: 45ms (-70%)
- Bundle size: 145kb (-41%)
- Lighthouse score: 97

### **Most impactful changes:**

1. **Route code splitting**: -35% initial bundle
2. **Optimized Framer Motion**: -62kb
3. **WebP/AVIF images**: -60% image weight
4. **Strategic memoization**: -30% re-renders
5. **Preloading on hover**: +50% perceived performance

## Recommended tools

### **For development:**

```bash
# Performance monitoring
pnpm add web-vitals
pnpm add --dev @vitejs/plugin-legacy

# Bundle analysis
pnpm add --dev vite-bundle-analyzer

# Image optimization
pnpm add --dev @squoosh/lib
```

### **For production:**

- **Vercel Analytics**: Real user metrics
- **Sentry Performance**: Error and performance monitoring
- **Google PageSpeed Insights**: Automated audits

## Optimization philosophy

My approach to optimization:

1. **Measure first**: Don't optimize without data
2. **User first**: Focus on metrics that impact UX
3. **Iterative**: Optimize, measure, repeat
4. **Pragmatic**: Don't over-optimize simple code

### **Performance checklist**

```typescript
// Performance checklist for each feature
const performanceChecklist = {
  bundle: 'Code splitting implemented?',
  images: 'Modern formats and lazy loading?',
  rendering: 'Necessary memoization implemented?',
  network: 'Requests optimized and cached?',
  monitoring: 'Metrics implemented?'
}
```

## Conclusion

Performance optimization in React isn't a one-time task, but a continuous process. The most effective techniques are usually the simplest: code splitting, image optimization, and strategic memoization.

The key is to **constantly measure** and **optimize based on real user data**, not micro-benchmarks.

What optimization techniques have you found most effective in your projects? Are there specific metrics you monitor? I'd love to hear about your experience through the [contact form](/contact).

---

**Recommended resources:**

- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [React Profiler Guide](https://react.dev/reference/react/Profiler)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Bundle Analyzer Tools](https://github.com/webpack-contrib/webpack-bundle-analyzer)
