# particles-background Specification

## Purpose

Provides an animated 2D particle system as a background layer. Particles are rendered on all pages at `z-0` with `pointer-events-none`, and are disabled on mobile viewports (<640px) to conserve CPU/battery.

## Requirements

### Requirement: Global Particle Field

The application SHALL render an animated 2D particle system as a background layer on desktop viewports (>=640px). On mobile viewports (<640px), the canvas SHALL NOT render.

#### Scenario: Particles render behind all content

- **WHEN** the Layout component mounts
- **THEN** a full-screen canvas element is rendered at `z-0`
- **AND** the canvas has `pointer-events-none` so it does not block interaction
- **AND** the canvas has `aria-hidden="true"` so it is ignored by assistive technology

#### Scenario: Particles animate on each frame

- **WHEN** the component mounts and `prefers-reduced-motion` is not set
- **THEN** 80 particles are created with random positions, velocities, radii, and opacities
- **AND** each frame, particles move based on their velocity
- **AND** particles wrap around edges (left→right, top→bottom)
- **AND** connecting lines are drawn between particles within 130px of each other
- **AND** line opacity decreases with distance

#### Scenario: Mouse repulsion

- **WHEN** the cursor is within 160px of a particle
- **THEN** the particle receives a repulsive force away from the cursor
- **AND** the force is proportional to proximity (closer = stronger)
- **AND** particle velocity is damped by 0.99 each frame
- **AND** maximum speed is capped at 3× base speed

#### Scenario: Theme-aware color

- **WHEN** particles and lines are rendered
- **THEN** their color is read from the CSS custom property `--color-primary`
- **AND** opacity is 60% in light mode, 40% in dark mode (via Tailwind classes)

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and the component mounts
- **THEN** a single frame is rendered (static particle field)
- **AND** no `requestAnimationFrame` loop is started

#### Scenario: Mobile viewport

- **WHEN** the viewport width is < 640px
- **THEN** the component returns null and does not render any canvas
- **AND** no `requestAnimationFrame` loop is started
- **AND** when the viewport is resized to >= 640px, the canvas mounts and begins animating

### Requirement: Component Integration

The particle background SHALL be integrated into the Layout component at the application root.

#### Scenario: Layout includes ParticlesBackground

- **WHEN** the Layout component renders
- **THEN** `<ParticlesBackground />` is rendered as the first child of the root div
- **AND** it appears before SkipLinks, Navbar, and main content

#### Scenario: Component is exported from index

- **WHEN** importing from `@/components`
- **THEN** `ParticlesBackground` is available as a named export

### Requirement: Resize Handling

The canvas and particles SHALL update when the window is resized.

#### Scenario: Window resize

- **WHEN** the window is resized
- **THEN** the canvas width and height are updated to match `window.innerWidth` and `window.innerHeight`
- **AND** all particles are recreated with random positions within the new dimensions

### Requirement: Cleanup on Unmount

The component SHALL clean up all resources when unmounted.

#### Scenario: Effect cleanup

- **WHEN** the useEffect cleanup function runs
- **THEN** the `requestAnimationFrame` ID is cancelled
- **AND** the `resize` event listener is removed
- **AND** the `mousemove` event listener is removed
- **AND** the `mouseleave` event listener is removed
