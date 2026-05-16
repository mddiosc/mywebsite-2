## Context

Actualmente la web tiene un Lighthouse Performance score de 67-70 con LCP de 10.6s. El diagnóstico detallado revela:

- **Font blocking**: `rsms.me/inter/inter.css` es CSS externo bloqueante que descarga `InterVariable.woff2` (344KB). La cadena de dependencia: HTML → inter.css → woff2 = 414ms + render-block.
- **Animation delay on LCP**: El subtítulo del Hero (`<motion.p>`) es el elemento LCP y aparece con ~2s de delay por animaciones de framer-motion.
- **Unused JS**: 366KB de JavaScript cargado en la home que no se usa (recaptcha 214KB, markdown-vendor 63KB, data-vendor 41KB, animation-vendor 22KB, ui-vendor 27KB).
- **Preconnects inútiles**: 6 preconnects en `index.html`, varios no usados en la home (`fonts.googleapis.com`, `www.google.com`, `www.gstatic.com`, `formspree.io`).
- **Particles canvas**: 60fps en todas las páginas, incluyendo móviles de gama baja.

## Goals / Non-Goals

**Goals:**

- LCP < 2.5s (desde 10.6s actual)
- Lighthouse Performance > 90 (desde 67-70)
- Eliminar CSS bloqueante externo
- Reducir JS no usado en carga inicial de la home en >300KB
- Mantener la calidad visual y UX actual (animaciones, tipografía)

**Non-Goals:**

- No cambiar la fuente (seguimos con Inter)
- No eliminar animaciones — solo diferirlas tras el primer paint
- No introducir SSR/SSG/backend rendering — seguimos como SPA estática
- No modificar Tailwind 4 ni la estrategia de estilos
- No tocar Umami analytics (ya está con `defer`, no afecta)

## Decisions

### D1: Self-hosting de Inter — descargar woff2, importar en JS, @font-face en CSS

**Alternativas consideradas:**

- `@fontsource/inter`: empaqueta la fuente como dependencia npm con múltiples weights. Rechazado: añade complejidad de dependencia y archivos extra.
- `vite-plugin-google-fonts`: auto-descarga Google Fonts. Rechazado: Inter se sirve desde rsms.me, no Google Fonts.
- **Elegido**: Descargar manualmente `InterVariable.woff2` de rsms.me, importarlo en `main.tsx` (para que Vite lo hashee y sirva), definir `@font-face` en `index.css` con `font-display: swap`, y preload en `index.html`.

**Rationale**: Control total, cero dependencias externas en runtime, Vite optimiza el asset automáticamente.

### D2: LCP estático + animación diferida — renderizar clon estático del subtítulo, luego animar

**Alternativas consideradas:**

- `useEffect` + `requestAnimationFrame` para disparar animación tras primer paint. Elegido: simple, fiable, sin dependencias nuevas.
- CSS `content-visibility: auto` en elementos below-fold. Complementario pero no resuelve el LCP.
- `IntersectionObserver`. Rechazado: el LCP está above-the-fold siempre visible, no aplica.

**Implementación**: El `<motion.p>` del subtítulo se duplica: una versión `<p>` estática con `opacity: 1` y `aria-hidden="true"` (visible inmediatamente), y la versión animada con `opacity: 0` inicial que transiciona a `opacity: 1` vía `useEffect` + `rAF`. Cero CLS porque ambas ocupan el mismo espacio.

### D3: Recaptcha lazy — React.lazy + Provider solo en Contact

**Alternativas consideradas:**

- Inyección condicional de `<script>`: frágil, difícil de manejar con el ciclo de vida de React.
- **Elegido**: `React.lazy(() => import('react-google-recaptcha-v3'))` wrapper alrededor de `GoogleReCaptchaProvider` solo en `Contact/index.tsx`. La página de Contact ya maneja `executeRecaptcha` como opcional (graceful degradation).

**Rationale**: Vite automáticamente code-splittea el import dinámico. El componente Contact se carga lazy desde `routes.tsx` (ya lo está), así que el recaptcha solo se descarga cuando el usuario navega a Contact.

### D4: Preconnects condicionales — quitar de index.html, añadir solo en Contact

**Implementación**: Eliminar de `index.html` los `<link rel="preconnect">` para `fonts.googleapis.com`, `www.google.com`, `www.gstatic.com`, `formspree.io`. En `Contact/index.tsx` (o un hook del componente), usar `document.head.appendChild` para añadir los preconnects de `www.google.com`, `www.gstatic.com` y `formspree.io` solo cuando se monta la página.

### D5: ParticlesBackground — deshabilitar en viewport < 640px

**Implementación**: Añadir un `useState` inicializado con `window.innerWidth >= 640` y un `useEffect` con listener de `resize`. Si el ancho es <640px, retornar `null` en lugar del canvas. El componente ya está optimizado (scaling de partículas, `passive: true` en listeners), pero eliminar el rAF loop en móvil libera CPU significativo.

### D6: No a critical CSS inlining para Tailwind 4

**Decisión explícita de NO hacer**: Tailwind 4 genera un archivo CSS atómico completo. Intentar extraer "critical CSS" resultaría en inlinear una porción grande y específica de la página que cambiaría por ruta. En su lugar, mantener el `<link rel="stylesheet">` actual que Vite ya optimiza con hashing y cache. Si hiciera falta un boost adicional, usar `<link rel="preload" as="style">` en el bundle CSS.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| **FOUT (flash of unstyled text)** con `font-display: swap` | Usar `system-ui` como fallback en la stack de fuentes. La diferencia visual es mínima (Inter es muy similar a system-ui). El FOUT es preferible al FOIT (texto invisible) para LCP. |
| **Regresión visual en animación LCP** — usuarios ven texto estático y luego "salta" a animado | El overlay animado usa `opacity: 0→1` sobre el texto estático. Transición suave, sin salto de layout. |
| **Recaptcha no carga si el usuario va directo a Contact** | La página Contact ya maneja `executeRecaptcha` como opcional. Si el import lazy falla, el formulario sigue funcionando sin captcha. |
| **Variable font de 344KB sigue siendo grande** | Con `font-display: swap` + preload, el navegador muestra texto inmediatamente con la fuente de fallback. El woff2 empieza a renderizar el primer weight tras ~50KB descargados. Subsetting no es viable para variable fonts sin perder interpolación de pesos. |
| **Los preconnects en Contact se añaden tarde** (cuando el componente monta) | Aceptable: el usuario tiene que navegar a Contact primero, y el formulario no se envía inmediatamente. Los pocos ms de diferencia no son críticos para una página de contacto. |
