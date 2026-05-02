# Change: Add Particles Background

## What

Add an animated 2D particle system as a global background layer across all pages. The particles are rendered on a full-screen canvas with mouse-repulsion physics, connecting lines between nearby particles, and theme-aware colors.

## Why

- Adds visual depth and interactivity to the site without the bundle weight of a 3D library (three.js + R3F = ~200KB+ gzipped)
- Canvas 2D particles are lightweight enough to run site-wide, not just in the Hero section
- Mouse interaction provides subtle engagement without being distracting
- Respects `prefers-reduced-motion` for accessibility

## Impact

- **New component**: `src/components/ParticlesBackground.tsx` — 80-particle canvas system
- **Layout change**: Particles rendered in `Layout.tsx` at page root level (appears on all routes)
- **No new dependencies** — uses only React built-ins + existing hooks
- **Performance**: O(n²) line drawing between particles, mitigated by low particle count (80) and `requestAnimationFrame`
- **Accessibility**: `aria-hidden="true"`, `pointer-events-none`, reduced-motion support

## Non-Goals

- No 3D rendering or WebGL (that was a different approach that was replaced)
- No physics simulations beyond simple velocity + repulsion
- No mobile-specific gesture handling
- No particle customization or configuration UI
