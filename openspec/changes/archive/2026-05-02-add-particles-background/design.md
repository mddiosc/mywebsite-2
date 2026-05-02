## Context

The portfolio is a multi-page React SPA with routes for Home, Projects, Blog, About, and Contact. The original plan was to add a 3D icosahedron to the Hero section using React Three Fiber, but after implementation decisions, the team chose a lighter-weight approach: a 2D canvas particle system that runs across all pages.

This approach avoids adding ~200KB+ of three.js/R3F dependencies while still providing visual depth and mouse interactivity. The particles render behind all content at `z-0` and do not interfere with user interaction (`pointer-events-none`).

## Goals / Non-Goals

**Goals:**

- Add an animated particle background to all pages via `Layout.tsx`
- 80 particles with connecting lines between nearby particles
- Mouse repulsion effect for interactivity
- Theme-aware particle color (reads CSS `--color-primary`)
- Respect `prefers-reduced-motion` for accessibility
- Zero new dependencies (Canvas 2D API + React only)

**Non-Goals:**

- No 3D rendering or WebGL
- No physics simulations beyond simple velocity + repulsion
- No mobile-specific gesture handling
- No particle customization or configuration UI
- No changes to existing page layouts or content

## Decisions

### Decision 1: Canvas 2D over WebGL / Three.js

**Chosen**: Plain Canvas 2D rendering via `useRef` + `useEffect` with `requestAnimationFrame`.

**Rationale**: A 3D library adds significant bundle weight (~200KB+ gzipped for three.js + R3F). A 2D canvas with simple geometric primitives (circles + lines) achieves the same "ambient background" effect at a fraction of the cost. The particle system is lightweight enough to run site-wide, not just in the Hero section.

**Alternative considered**: React Three Fiber with an icosahedron. Rejected due to bundle size and the fact that a 2D particle field provides similar visual depth without the complexity.

### Decision 2: Global Placement via Layout

**Chosen**: Render `ParticlesBackground` in `Layout.tsx` at the page root level, so it appears on all routes.

**Rationale**: The particle system is designed as an ambient background layer — it's subtle enough (opacity 60% light / 40% dark) that it works everywhere without being distracting. Placing it in Layout avoids duplicating the component on every page.

### Decision 3: Mouse Repulsion (not Attraction)

**Chosen**: Particles move away from the cursor within a 160px radius, with force proportional to distance.

**Rationale**: Repulsion creates a "parting" effect that feels natural and doesn't obstruct content the user is trying to interact with. Attraction would cluster particles near the cursor, potentially obscuring text.

### Decision 4: Inline Mouse Tracking (no separate hook)

**Chosen**: Mouse position is tracked via `addEventListener('mousemove')` inside the component's `useEffect`, stored in a mutable `mouse` object.

**Rationale**: The mouse tracking is simple enough (just `clientX`/`clientY`) that a separate hook would be overkill. The mutable object avoids re-renders and keeps the animation loop performant.

### Decision 5: Reduced Motion = Single Static Frame

**Chosen**: When `prefers-reduced-motion` is true, `tick()` is called once and never looped.

**Rationale**: Users who prefer reduced motion get a static particle field — still visually present but with no animation. This is better than hiding the component entirely, which would create a layout shift.

### Decision 6: Theme Color via CSS Custom Property

**Chosen**: Particle color is read from `--color-primary` CSS variable via `getComputedStyle` at render time.

**Rationale**: This ties particle color to the existing theme system without adding dependencies or prop drilling. Light/dark mode opacity is handled via Tailwind classes (`opacity-60 dark:opacity-40`).

## Risks / Trade-offs

**[Risk] O(n²) line drawing between particles**
→ Mitigation: Particle count is capped at 80, resulting in ~3,160 distance checks per frame. On modern devices this is negligible. If performance issues arise, reduce particle count or add spatial hashing.

**[Risk] Global placement means continuous CPU usage**
→ The rAF loop runs on every page, not just Hero. This is intentional for visual consistency but adds ongoing CPU/GPU cost. Acceptable given the lightweight nature of the animation.

**[Trade-off] Static color on theme change**
→ Particle color is computed once per effect run (when `isDark` changes). Particles don't dynamically track intermediate theme transitions, but the effect re-run ensures correct color on toggle.

## Migration Plan

1. Create `src/components/ParticlesBackground.tsx` with canvas particle system
2. Export from `src/components/index.ts`
3. Integrate into `src/components/Layout.tsx` at page root
4. Add ESLint rules for future 3D components (prep work)
5. Verify reduced-motion behavior
6. Test theme switching (light/dark mode)
7. Test on mobile viewport sizes

## Open Questions

- None blocking. Future improvements tracked as known risks above.
