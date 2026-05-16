## Why

Lighthouse Performance score es 67-70 con un LCP de 10.6s — el texto del subtítulo del Hero tarda más de 10 segundos en ser visible. La causa raíz es doble: la fuente Inter se carga desde un CDN externo (`rsms.me`) como CSS bloqueante que fuerza la descarga de un woff2 de 344KB antes de pintar, y las animaciones de framer-motion retrasan el render del LCP ~2s adicionales. Adicionalmente, se cargan 366KB de JavaScript no usado en la home (recaptcha, markdown-vendor, data-vendor). Corregir esto puede llevar el LCP de 10.6s a <2.5s y Performance de 70 a >90.

## What Changes

- **Self-hosting de la fuente Inter**: eliminar dependencia externa de `rsms.me/inter/inter.css`, inlinear `@font-face` en el bundle CSS, preload del woff2 con `font-display: swap`.
- **Eliminar retraso de animación en el LCP**: el subtítulo del Hero se renderiza estático inmediatamente; la animación se dispara tras el primer paint sin bloquear el LCP.
- **Lazy loading de recaptcha**: mover `GoogleReCaptchaProvider` a la página Contact exclusivamente, usando `React.lazy` + dynamic `import()`.
- **Preconnects condicionales**: quitar preconnects de `fonts.googleapis.com`, `www.google.com`, `www.gstatic.com`, `formspree.io` del HTML global; solo se establecen en Contact.
- **Deshabilitar ParticlesBackground en móvil**: no ejecutar el canvas de partículas en viewports <640px para liberar CPU en dispositivos de gama baja.
- **Añadir i18n-vendor al performance budget**: el chunk de i18n ya existe en la configuración de splitting pero falta en el budget check.

## Capabilities

### New Capabilities

- `font-self-hosting`: La fuente Inter se sirve desde el propio dominio, eliminando la dependencia de CDN externo y el CSS bloqueante asociado.
- `lcp-render-optimization`: El elemento LCP (subtítulo del Hero) se renderiza estático en el primer paint; la animación se aplica después sin retrasar la métrica LCP.
- `conditional-vendor-loading`: Los bundles de terceros (recaptcha, markdown, data utilities) se cargan solo en las páginas que los necesitan, no globalmente.
- `adaptive-particles`: El fondo de partículas canvas se deshabilita automáticamente en viewports móviles para preservar CPU budget.

### Modified Capabilities

<!-- Ningún spec existente modifica sus requisitos. Todos los cambios son nuevas capacidades o mejoras de implementación que no alteran contratos de specs existentes. -->

## Impact

- **Affected code**: `index.html` (preconnects, enlace a inter.css), `src/styles/index.css` (nuevo @font-face), `src/main.tsx` (import de fuente, eliminar GoogleReCaptchaProvider global), `src/pages/Home/components/Hero.tsx` (LCP estático + animación diferida), `src/pages/Contact/index.tsx` (wrapper lazy de recaptcha), `src/components/ParticlesBackground.tsx` (deshabilitar en móvil), `scripts/check-performance-budget.mjs` (añadir i18n-vendor), `vite.config.ts` (plugin de font preloading).
- **New dependency**: `vite-plugin-beasties` (critical CSS + font preloading) — opcional, se evaluará si aporta suficiente valor.
- **Breaking changes**: Ninguno. Todos los cambios son internos y no afectan la API pública de rutas o componentes.
- **Bundle size**: Reducción de ~366KB de JS no usado en la carga inicial de la home. La fuente Inter pasa de ser un recurso externo bloqueante a un asset local con `font-display: swap`.
