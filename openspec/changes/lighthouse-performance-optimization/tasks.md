## 1. Setup

- [x] 1.1 Crear rama `codex/lighthouse-performance-optimization` desde `main`
- [x] 1.2 Verificar que `pnpm build && pnpm preview` funciona en el estado actual (baseline)

## 2. Self-Hosting de Inter

- [x] 2.1 Descargar `InterVariable.woff2` desde `https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1` a `public/fonts/InterVariable.woff2`
- [x] 2.2 Importar la fuente en `src/main.tsx` (`import './styles/fonts.css'`) para que Vite la procese
- [x] 2.3 Crear `src/styles/fonts.css` con `@font-face` declarando `font-family: Inter`, `font-display: swap`, `src: url('/fonts/InterVariable.woff2')`
- [x] 2.4 Añadir `<link rel="preload" as="font" type="font/woff2" crossorigin>` para el woff2 en `index.html`
- [x] 2.5 Eliminar `<link rel="stylesheet" href="https://rsms.me/inter/inter.css">` de `index.html`
- [x] 2.6 Verificar que la fuente se carga desde local (`/fonts/InterVariable.woff2`) y no desde `rsms.me`

## 3. LCP Render Optimization (Hero)

- [x] 3.1 En `Hero.tsx`, renderizar un `<p>` estático con `aria-hidden="true"` junto al `<motion.p>` animado — mismo contenido, mismas clases, `opacity: 1` inmediato
- [x] 3.2 Envolver el `<motion.p>` con estado `shouldAnimate` iniciado en `false`
- [x] 3.3 Añadir `useEffect` + `requestAnimationFrame` que active `shouldAnimate = true` tras el primer paint
- [x] 3.4 Estilar el `<motion.p>` con `opacity: 0` inicial y transición `opacity: 1` cuando `shouldAnimate` sea true, overlayeado sobre el texto estático
- [x] 3.5 Respetar `prefers-reduced-motion`: si está activo, no hacer swap (dejar solo versión estática)
- [x] 3.6 Verificar visualmente: el subtítulo debe ser legible inmediatamente, sin salto de layout

## 4. Conditional Vendor Loading

- [x] 4.1 Mover `GoogleReCaptchaProvider` de `src/main.tsx` a un wrapper lazy en `src/pages/Contact/index.tsx`
- [x] 4.2 Usar `React.lazy(() => import('react-google-recaptcha-v3'))` para cargar el provider solo en Contact
- [x] 4.3 Envolver el contenido de Contact con `<Suspense fallback={<ContactContent />}>` para que el formulario funcione sin recaptcha durante la carga
- [x] 4.4 Eliminar preconnects del HTML global: `fonts.googleapis.com`, `www.google.com`, `www.gstatic.com` de `index.html`
- [x] 4.5 Mantener preconnect de `fonts.gstatic.com` y `formspree.io` en `index.html` (necesarios para fuentes del sistema y Contact)
- [x] 4.6 Añadir preconnects condicionales en `Contact/index.tsx`: `www.google.com`, `www.gstatic.com` (recaptcha) y `formspree.io` (formulario) al montar el componente
- [x] 4.7 Verificar que en Home NO se descarga recaptcha (`recaptcha__es.js` no aparece en Network)

## 5. Adaptive Particles

- [x] 5.1 En `ParticlesBackground.tsx`, añadir estado `isMobile` inicializado con `window.innerWidth < 640`
- [x] 5.2 Añadir `useEffect` con listener de `resize` (pasivo) que actualice `isMobile`
- [x] 5.3 Si `isMobile` es true, retornar `null` en lugar del canvas
- [x] 5.4 Si `prefersReducedMotion` es true, mantener comportamiento actual (un tick y stop)

## 6. Performance Budget

- [x] 6.1 Añadir entrada para `i18n-vendor` en `scripts/check-performance-budget.mjs` con límite coherente (~50KB gzip)
- [x] 6.2 Ejecutar `pnpm performance:budget` y verificar que pasa

## 7. Verification

- [x] 7.1 Ejecutar `pnpm build` y confirmar que el bundle de la home NO incluye `recaptcha__es.js` ni `markdown-vendor`
- [x] 7.2 Ejecutar `pnpm preview` y correr Lighthouse contra `http://127.0.0.1:4173/es/` — verificar LCP < 3s y Performance > 85
- [x] 7.3 Ejecutar `pnpm preview` y correr Lighthouse contra `http://127.0.0.1:4173/es/contact` — verificar que recaptcha carga correctamente y el formulario funciona
- [x] 7.4 Ejecutar `pnpm test` y verificar que todos los tests existentes pasan
- [x] 7.5 Ejecutar `pnpm test:e2e` y verificar que los tests e2e pasan
- [x] 7.6 Verificar visualmente en móvil (o viewport <640px) que ParticlesBackground no se renderiza
- [x] 7.7 Verificar dark mode: la fuente Inter debe funcionar correctamente en ambos temas
