## ADDED Requirements

### Requirement: 3D element is a lazy-loaded interactive icosahedron

The Hero section SHALL display a wireframe/low-poly icosahedron rendered via React Three Fiber that rotates slowly and responds to mouse movement with a subtle parallax effect.

#### Scenario: User visits the home page

- **WHEN** the Home page loads
- **THEN** a 3D icosahedron appears in the background of the Hero section
- **AND** it is loaded asynchronously via React.lazy and Suspense

#### Scenario: User moves the mouse over the Hero section

- **WHEN** the user moves their mouse across the Hero section
- **THEN** the icosahedron tilts/rotates subtly toward the mouse cursor
- **AND** the movement is smooth and not jarring

### Requirement: Mouse position is tracked via custom hook

The project SHALL provide a `useMousePosition` hook that returns normalized mouse coordinates (-1 to 1) relative to the viewport center, suitable for driving 3D animations.

#### Scenario: Hook is used in the 3D scene

- **WHEN** `useMousePosition` is called inside a React component
- **THEN** it returns `{ x, y }` where both values are in the range [-1, 1]
- **AND** the values update on `mousemove` events
- **AND** the listener is cleaned up on unmount

### Requirement: 3D component has graceful fallback

If WebGL is unavailable or the Canvas fails to initialize, the Hero section SHALL continue to display its text content without errors.

#### Scenario: WebGL is disabled

- **WHEN** the browser does not support WebGL or it is disabled
- **THEN** the Hero text, badge, and animations remain fully functional
- **AND** no JavaScript errors are thrown

### Requirement: 3D element styling matches the theme

The icosahedron SHALL use colors from the existing Tailwind theme (primary, accent, highlight) and fit within the dark/light mode system.

#### Scenario: Theme toggles between light and dark

- **WHEN** the user toggles between light and dark mode
- **THEN** the icosahedron's color scheme adapts accordingly
- **AND** it remains visually harmonious with the background
