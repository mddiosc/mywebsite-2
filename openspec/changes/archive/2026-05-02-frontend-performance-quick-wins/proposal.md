## Why

El proyecto tiene una base sólida de performance (lazy routes, vendor split, budgets gzip, Lighthouse CI), pero durante una auditoría se identificaron fricciones medibles en arranque, runtime y render que penalizan métricas de Core Web Vitals sin aportar valor al usuario. Estas son correcciones locales, de bajo riesgo y alto impacto que pueden validarse con la infraestructura existente.

## What Changes

- Excluir `ReactQueryDevtools` del bundle de producción en `src/main.tsx`
- Eliminar el delay artificial de 100ms en `src/hooks/useBlog.ts`
- Añadir `preconnect` estático en `index.html` para Google Fonts, gstatic, formspree y umami
- Implementar script inline de tema en `index.html` para eliminar flash de tema antes del primer paint
- Ajustar `useTheme` para evitar trabajo duplicado si el tema ya está aplicado por el script inline
- Conectar funciones de `src/lib/resourcePreloading.ts` que hoy no tienen callers o verificar cuáles están huérfanas

## Capabilities

### New Capabilities

- `performance-boot-optimization`: optimizaciones de arranque que reducen bundle innecesario, eliminan delays artificiales y mejoran LCP/CLS sin cambios arquitecturales
- `theme-anti-flash`: estrategia de script inline en `index.html` que resuelve el tema antes del primer paint, eliminando el flash de color
- `resource-hints-activation`: uso efectivo de `preconnect`/`dns-prefetch` estáticos en el HTML para terceros conocidos

### Modified Capabilities

- Ninguna — todas las capacidades son optimizations del estado actual, no cambios de requisito

## Impact

- **Código afectado**: `src/main.tsx`, `src/hooks/useBlog.ts`, `index.html`, `src/hooks/useTheme.ts`, `src/lib/resourcePreloading.ts`
- **Métricas esperadas**: mejora en Lighthouse performance score (objetivo ≥ 0.70 desde 0.65), reducción de TTI, eliminación de CLS por flash de tema
- **Dependencias**: ninguna nueva; usa infraestructura existente (`performance:budget`, Lighthouse CI, Vitest, Playwright)
- **No afecta**: routing, i18n, contenido, APIs, formas de contacto, SEO metadata existente
