## Context

The portfolio's hero section (`src/pages/Home/components/Hero.tsx`) is currently a text-driven landing area with animated typography, a status badge, and a scroll indicator. It uses Framer Motion for entrance animations and has a clean, minimalist aesthetic with a gradient text effect.

The goal is to add a subtle, interactive 3D element that enhances the visual appeal without distracting from the primary content (name, title, availability status). The 3D element must feel like a natural extension of the existing design language.

## Goals / Non-Goals

**Goals:**

- Add a lightweight, abstract 3D shape to the Hero section
- Make the 3D element respond to mouse movement (parallax effect)
- Integrate smoothly with existing Framer Motion entrance animations
- Use `@react-three/fiber` and `@react-three/drei` for rendering
- Lazy-load the 3D component to avoid impacting initial bundle size
- Provide a graceful fallback for devices/browsers without WebGL support

**Non-Goals:**

- Complex 3D scenes, multiple objects, or game-like interactions
- Physics simulations or particle systems
- Mobile-specific 3D gestures (device orientation is optional, mouse is primary)
- Changes to the existing Hero text content or animation timing
- Changes to the overall page layout or routing

## Decisions

### Decision 1: Abstract Geometric Shape (Icosahedron)

**Chosen**: A wireframe/low-poly icosahedron with a subtle rotating animation.

**Rationale**: An icosahedron is visually interesting, mathematically elegant, and lightweight (low vertex count). A wireframe or low-poly style aligns with the modern, technical aesthetic of a developer portfolio. It is abstract enough to not distract, yet distinctive enough to be memorable.

**Alternative considered**: A torus knot or sphere. Rejected because the icosahedron's angular geometry feels more "technical" and modern.

### Decision 2: Mouse Parallax via Custom Hook

**Chosen**: A custom hook `useMousePosition` that tracks normalized mouse coordinates relative to the viewport center and feeds them into the R3F scene via a context or ref.

**Rationale**: R3F's `useFrame` is the most performant way to update rotation/position based on external input. Normalizing mouse coordinates (-1 to 1) makes the math simple and the effect consistent across screen sizes.

### Decision 3: Lazy Load with React.lazy + Suspense

**Chosen**: Wrap the Canvas and 3D component in `React.lazy()` and render with a `<Suspense>` boundary that shows nothing (or the existing background) while loading.

**Rationale**: `three` and `@react-three/fiber` are large packages. Lazy loading ensures they are fetched only when the Hero section is rendered, keeping the initial JS bundle small and preserving the site's fast initial paint.

### Decision 4: Coordinate with Framer Motion via `onCreated`

**Chosen**: Use Framer Motion's `motion` props on a wrapper div around the Canvas, and keep the 3D object's internal animation independent but time-synced via `useFrame`.

**Rationale**: R3F's Canvas creates its own render loop. Framer Motion controls the DOM wrapper. By delaying the Canvas's opacity fade-in until after the text animations start, we create a coordinated entrance.

### Decision 5: Graceful Degradation via Error Boundary

**Chosen**: Wrap the lazy-loaded 3D component in a React error boundary. If WebGL fails or the Canvas crashes, the hero section reverts to its original text-only appearance.

**Rationale**: WebGL can fail on older devices, virtual machines, or browsers with hardware acceleration disabled. An error boundary ensures the site never breaks completely.

## Risks / Trade-offs

**[Risk] Increased bundle size from Three.js**
→ Mitigation: Lazy loading via `React.lazy()` splits the 3D code into a separate chunk. The main bundle only pays for the wrapper component (~1KB).

**[Risk] Performance impact on low-end devices**
→ Mitigation: Use a low-poly geometry (icosahedron detail level 1), simple mesh basic material (no lighting calculations), and limit the pixel ratio via `dpr` prop on `<Canvas>`. The animation is also subtle (slow rotation).

**[Risk] Hydration mismatch with R3F Canvas**
→ Mitigation: The Canvas is rendered client-side only. No SSR concerns as this is a Vite SPA, but we ensure it mounts after initial paint.

**[Trade-off] Visual complexity vs. distraction**
→ The 3D element is positioned behind the text (lower z-index) and uses muted colors from the existing theme. It enhances but does not compete.

## Migration Plan

1. Install dependencies: `three`, `@react-three/fiber`, `@react-three/drei`
2. Add `@types/three` as dev dependency
3. Create `src/components/3d/IcosahedronScene.tsx` with the 3D shape and mouse interaction
4. Create `src/components/3d/index.ts` for clean exports
5. Create `src/hooks/useMousePosition.ts` for normalized mouse tracking
6. Modify `src/pages/Home/components/Hero.tsx` to integrate the lazy-loaded 3D background
7. Run build and verify chunk splitting
8. Run visual checks in browser

## Open Questions

- None blocking. Exact color palette for the 3D element will be derived from the existing Tailwind theme tokens.
