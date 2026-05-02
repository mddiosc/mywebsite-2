## Context

El proyecto es un SPA estático desplegado via Nginx/Docker con React 19 + Vite 8. La auditoría de performance identificó cuatro fuentes de fricción tratables sin cambios arquitecturales:

1. **ReactQueryDevtools en producción**: se renderiza incondicionalmente dentro de `StrictMode` en `src/main.tsx`, incluyendo su código (~40-80KB gzip) en el bundle de producción.
2. **Delay artificial en useBlog**: `await new Promise((resolve) => setTimeout(resolve, 100))` en `src/hooks/useBlog.ts` retrasa la carga de blog sin valor UX.
3. **Tema resuelto en useEffect**: `useTheme` aplica la clase `dark`/`light` después del hydrate, causando un flash de color visible.
4. **resourcePreloading.ts sin usar**: funciones exportadas (`preloadFont`, `preinitStylesheet`, etc.) nunca se invocan desde `initializeCriticalResources`.

El script `check-performance-budget.mjs` ya vigila chunks gzip. Lighthouse CI ya tiene assertions. No hay SSR.

## Goals / Non-Goals

**Goals:**

- Eliminar ReactQueryDevtools del bundle de producción
- Eliminar delay artificial en blog
- Resolver el tema antes del primer paint para eliminar flash de color
- Activar preconnect/prefetch estático en index.html para terceros
- Detectar y conectar o eliminar funciones huérfanas en resourcePreloading.ts

**Non-Goals:**

- No migrar a SSR ni introduce frameworks de rendering
- No modificar la lógica de routing ni i18n
- No cambiar la arquitectura de estado (Context + React Query se mantienen)
- No implementar service workers ni caching strategies
- No tocar animaciones, CLS por layout shift u otras optimizaciones de runtime

## Decisions

### D1: Condicionalizar Devtools con `import.meta.env.DEV`

**Decisión**: Envolver `<ReactQueryDevtools />` con `import.meta.env.DEV`.

**Alternativas**:

- `process.env.NODE_ENV !== 'production'`: no funciona igual en Vite — los builds de Vite usan `import.meta.env` globals, no `process.env`.
- Build plugin de Rollup para eliminar el import: overkill para una línea.

**rationale**: Vite ya define `import.meta.env.DEV = true` solo en dev. En preview/build es `false`. El tree-shaking de Rolldown elimina el código del branch muerto en producción.

### D2: Script inline de tema como primer elemento en `<head>`

**Decisión**: Insertar un IIFE síncrono en `index.html` como primer hijo de `<head>` (antes de cualquier `<link>` o `<script>`) que lea `localStorage`, resuelva `system` con `matchMedia`, y aplique `dark` o `light` a `<html>`.

**Alternativas**:

- Inline style en `<html>` con valor por defecto: no resuelve `system`, siempre需要一个 fallback fijo.
- CSS custom property en `:root`: la clase `.dark` en `<html>` es el mecanismo actual; replicar con CSS variable requiere cambiar la estrategia de tema existente.
- `React 19 useId` + blocking resource: no aplica — el tema es síncrono.

**rationale**: El script síncrono garantiza que cuando React hydrate, la clase ya está aplicada. No hay flash porque no hay intervalo entre página blanca y color resuelto.

### D3: useTheme no duplica trabajo cuando la clase ya existe

**Decisión**: `useTheme` verifica en su inicialización si `<html>` ya tiene la clase `dark` o `light`. Si la tiene (aplicada por el script inline), usa ese valor como estado inicial sin escribir en localStorage ni volver a aplicar la clase.

**Alternativas**:

- Eliminar el `classList.add/remove` de `useTheme`: rompería el cambio de tema en runtime.
- Hacer que `useTheme` solo lea y never escriba: el toggle de tema necesita escribir.

**rationale**: El script inline ya hizo el trabajo de arranque. `useTheme` puede leer el estado actual sin necesidad de re-aplicarlo si ya está correcto.

### D4: preconnect estático en index.html

**Decisión**: Añadir `<link rel="preconnect">` para google fonts, gstatic, formspree, umami dentro del `<head>` existente, complementando lo que `preconnectToOrigins()` hace en runtime.

**Alternativas**:

- Solo runtime via `preconnectToOrigins()`: ya se llama desde `initializeCriticalResources()`, pero solo después de que React carga. Los hints estáticos resuelven antes.
- Vite plugin para inyectar hints: innecesario — es HTML estático.

**rationale**: El HTML estático es lo primero que llega. Los hints de preconnect早点 aplican, reducen DNS/TLS handshake time para terceros.

### D5: Auditoria de resourcePreloading.ts

**Decisión**: Recorrer todos los exports de `src/lib/resourcePreloading.ts` y verificar cuáles tienen callers en el codebase. Los que no tengan se marcan como dead code o se conectan donde aplique (por ejemplo, `preloadImage` para el logo del navbar).

**Alternativas**:

- Eliminar todo sin usar: perdería funciones que podrían tener uso futuro.
- Dejar como está: ensucia el codebase.

**rationale**: Un cambio pequeño pero de mantenimiento — mantener la utilidad coherente con su uso real.

## Risks / Trade-offs

- **[Riesgo] Tema inline puede desfasarse con localStorage**: si el usuario cambia el tema en otra pestaña y luego vuelve, el script inline siempre leerá el valor original. **Mitigación**: el script solo aplica al奶油 inicial. Los cambios en runtime son manejados por `useTheme` como antes. No hay conflicto.
- **[Riesgo] Quitar el delay de blog puede hacer imperceptible el loading state**: si el tiempo de carga real es menor que 100ms, el spinner parpadea. **Mitigación**: verificar con Playwright que el estado de carga se renderiza y desaparece correctamente.
- **[Riesgo] Devtools eliminado afecta debugging en staging**: si alguien quiere inspeccionar queries en staging. **Mitigación**: staging es `import.meta.env.DEV = false` por defecto en preview. Para debugging real, se puede usar `pnpm dev`.

## Open Questions

- **¿Hay imágenes hero que requieran `preloadImage` de React 19?** La auditoría no inspeccionó `src/assets`. Se asume que si las hay, se agregarán en una fase posterior. Este change no las incluye.
- **¿El script inline de tema debealso also apply `data-theme` attribute?** El sistema actual usa clase `.dark`/`.light`. No se debe cambiar a `data-theme` a menos que haya una razón. El script usa clases para mantener compatibilidad.
