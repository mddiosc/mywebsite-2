# Spec: Particles Background

## Requirement: Global Particle Field

The application SHALL render an animated 2D particle system as a background layer on all pages.

### Scenario: Particles render behind all content

- **Given** the user navigates to any route
- **When** the Layout component mounts
- **Then** a full-screen canvas element is rendered at `z-0`
- **And** the canvas has `pointer-events-none` so it does not block interaction
- **And** the canvas has `aria-hidden="true"` so it is ignored by assistive technology

### Scenario: Particles animate on each frame

- **Given** the user has not set `prefers-reduced-motion`
- **When** the component mounts
- **Then** 80 particles are created with random positions, velocities, radii, and opacities
- **And** each frame, particles move based on their velocity
- **And** particles wrap around edges (left→right, top→bottom)
- **And** connecting lines are drawn between particles within 130px of each other
- **And** line opacity decreases with distance

### Scenario: Mouse repulsion

- **Given** the user moves their mouse over the viewport
- **When** the cursor is within 160px of a particle
- **Then** the particle receives a repulsive force away from the cursor
- **And** the force is proportional to proximity (closer = stronger)
- **And** particle velocity is damped by 0.99 each frame
- **And** maximum speed is capped at 3× base speed

### Scenario: Theme-aware color

- **Given** the application has a light or dark theme active
- **When** particles and lines are rendered
- **Then** their color is read from the CSS custom property `--color-primary`
- **And** opacity is 60% in light mode, 40% in dark mode (via Tailwind classes)

### Scenario: Reduced motion

- **Given** the user has `prefers-reduced-motion: reduce` set
- **When** the component mounts
- **Then** a single frame is rendered (static particle field)
- **And** no `requestAnimationFrame` loop is started

## Requirement: Component Integration

The particle background SHALL be integrated into the Layout component at the application root.

### Scenario: Layout includes ParticlesBackground

- **Given** the Layout component renders
- **When** the component tree is built
- **Then** `<ParticlesBackground />` is rendered as the first child of the root div
- **And** it appears before SkipLinks, Navbar, and main content

### Scenario: Component is exported from index

- **Given** other modules need to import the component
- **When** importing from `@/components`
- **Then** `ParticlesBackground` is available as a named export

## Requirement: Resize Handling

The canvas and particles SHALL update when the window is resized.

### Scenario: Window resize

- **Given** the component is mounted
- **When** the window is resized
- **Then** the canvas width and height are updated to match `window.innerWidth` and `window.innerHeight`
- **And** all particles are recreated with random positions within the new dimensions

## Requirement: Cleanup on Unmount

The component SHALL clean up all resources when unmounted.

### Scenario: Effect cleanup

- **Given** the component unmounts
- **When** the useEffect cleanup function runs
- **Then** the `requestAnimationFrame` ID is cancelled
- **And** the `resize` event listener is removed
- **And** the `mousemove` event listener is removed
