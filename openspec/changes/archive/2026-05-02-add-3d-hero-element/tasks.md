## 1. Dependency Installation

- [x] 1.1 Install `three`, `@react-three/fiber`, `@react-three/drei` as dependencies
- [x] 1.2 Install `@types/three` as dev dependency
- [x] 1.3 Verify `pnpm install` completes without peer dependency warnings

## 2. Core 3D Components

- [x] 2.1 Create `src/components/3d/IcosahedronScene.tsx`
  - Use `<Canvas>` from `@react-three/fiber`
  - Set `dpr={[1, 1.5]}` for performance
  - Add an `<Icosahedron>` geometry with detail level 1
  - Use `<meshBasicMaterial>` with wireframe enabled
  - Apply theme-aware colors (primary/accent)
- [x] 2.2 Implement slow auto-rotation using `useFrame`
- [x] 2.3 Implement mouse parallax using `useMousePosition` hook
- [x] 2.4 Create `src/components/3d/index.ts` with named exports

## 3. Mouse Tracking Hook

- [x] 3.1 Create `src/hooks/useMousePosition.ts`
  - Track `window` mousemove events
  - Normalize coordinates to [-1, 1] based on viewport center
  - Return `{ x, y }` with smooth lerp/interpolation
  - Cleanup event listeners on unmount

## 4. Hero Integration

- [x] 4.1 Create a lazy-loaded wrapper for the 3D scene in `src/pages/Home/components/Hero.tsx`
  - Use `React.lazy(() => import('@/components/3d/IcosahedronScene'))`
  - Wrap in `<Suspense fallback={null}>`
- [x] 4.2 Position the 3D Canvas absolutely behind the text content (z-index layering)
- [x] 4.3 Coordinate entrance animation with Framer Motion
  - Fade in the Canvas container after the title animation starts
  - Use `motion.div` with opacity transition
- [x] 4.4 Ensure the Hero text remains fully readable and clickable

## 5. Theme & Styling

- [x] 5.1 Read current theme colors from Tailwind config/CSS variables
- [x] 5.2 Apply theme colors to the icosahedron material
- [x] 5.3 Verify visual appearance in both light and dark mode
- [x] 5.4 Ensure the 3D element does not overflow its container on mobile

## 6. Fallback & Error Handling

- [x] 6.1 Wrap the lazy-loaded 3D component in an error boundary
- [x] 6.2 Test that the Hero displays correctly when WebGL is unavailable
- [x] 6.3 Verify no console errors on WebGL failure

## 7. Build & Performance Validation

- [x] 7.1 Run `pnpm build` and verify successful compilation
- [x] 7.2 Inspect `dist/assets/` to confirm Three.js code is split into a separate chunk
- [x] 7.3 Run `pnpm test` to ensure no unit tests are broken
- [x] 7.4 Run `pnpm type-check` to ensure zero TypeScript errors
- [x] 7.5 Run `pnpm lint` to ensure code style compliance
- [ ] 7.6 Do a visual smoke test in the browser (mouse interaction, theme toggle, mobile viewport)

## 8. Finalization

- [ ] 8.1 Commit changes with message `feat: add interactive 3D icosahedron to hero section`
