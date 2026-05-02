## 1. Create ParticlesBackground Component

- [x] 1.1 Create `src/components/ParticlesBackground.tsx`
- [x] 1.2 Implement canvas setup with `useRef` + `useEffect`
- [x] 1.3 Implement `createParticles()` with 80 particles (random position, velocity, radius, opacity)
- [x] 1.4 Implement particle movement loop with `requestAnimationFrame`
- [x] 1.5 Implement edge wrapping (left→right, top→bottom)
- [x] 1.6 Implement connecting lines between particles within 130px
- [x] 1.7 Implement mouse repulsion (160px radius, force proportional to distance)
- [x] 1.8 Implement velocity damping (0.99) and speed clamping (3× base)
- [x] 1.9 Add `aria-hidden="true"` and `pointer-events-none` to canvas

## 2. Theme Integration

- [x] 2.1 Import and use `useTheme()` hook for theme awareness
- [x] 2.2 Read particle color from CSS `--color-primary` via `getComputedStyle`
- [x] 2.3 Apply `opacity-60` for light mode, `dark:opacity-40` for dark mode
- [x] 2.4 Verify particles render correctly in both themes

## 3. Accessibility

- [x] 3.1 Import and use `useReducedMotion()` hook
- [x] 3.2 Implement single-frame static render when `prefers-reduced-motion: reduce`
- [x] 3.3 Verify no animation loop runs for reduced-motion users

## 4. Layout Integration

- [x] 4.1 Export `ParticlesBackground` from `src/components/index.ts`
- [x] 4.2 Import and render `<ParticlesBackground />` in `src/components/Layout.tsx`
- [x] 4.3 Position as first child of root div (before SkipLinks, Navbar, main)
- [x] 4.4 Verify particles appear on all routes (Home, Projects, Blog, About, Contact)

## 5. Resize Handling

- [x] 5.1 Add `resize` event listener on `window` with `{ passive: true }`
- [x] 5.2 Update canvas width/height to match `window.innerWidth/innerHeight`
- [x] 5.3 Remove event listener on unmount

## 6. Event Listeners and Cleanup

- [x] 6.1 Add `mousemove` event listener for mouse tracking
- [x] 6.2 Add `mouseleave` event listener on `document` for mouse reset
- [x] 6.3 Cancel `requestAnimationFrame` on unmount
- [x] 6.4 Remove all event listeners on unmount
- [x] 6.5 Include `prefersReducedMotion` and `isDark` in useEffect dependencies

## 7. Supporting Changes

- [x] 7.1 Add ESLint rules for `src/components/3d/**/*.{ts,tsx}` (prep for future work)
- [x] 7.2 Update `.gitignore` with `.agents/`, `skills-lock.json`, `.playwright*`
- [x] 7.3 Update logo SVG viewBox in `public/logo_positive.svg` and `public/logo_negative.svg`
- [x] 7.4 Update Navbar logo height to `h-8`

## 8. Verification

- [x] 8.1 Verify particles render correctly on desktop viewport
- [x] 8.2 Verify mouse repulsion works as expected
- [x] 8.3 Verify connecting lines appear between nearby particles
- [x] 8.4 Verify theme switching updates particle color
- [x] 8.5 Verify reduced-motion shows static frame
- [x] 8.6 Verify particles appear on all routes, not just Hero

## 9. Critical Bug Fixes

- [x] 9.1 Fix: recreate particles on window resize (particles were stuck in old dimensions)
- [x] 9.2 Fix: move `mouseleave` listener from `window` to `document` (event doesn't bubble to window)
- [x] 9.3 Fix: hoist `getComputedStyle` out of `requestAnimationFrame` loop (was called 60fps unnecessarily)
