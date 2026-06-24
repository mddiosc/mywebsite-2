## MODIFIED Requirements

### Requirement: Raster images can use modern formats

The system SHALL render raster images through `<picture>` when modern alternatives are available, while keeping SVG inputs on the direct image path. All logo and icon rendering SHALL go through `OptimizedImage`; the previous `OptimizedLogo` component is removed and its sole caller migrated, with no visual change.

#### Scenario: Raster asset has modern alternatives

- **WHEN** `OptimizedImage` receives a raster source with AVIF and WebP variants available
- **THEN** the component SHALL render a `<picture>` element with AVIF and WebP sources ahead of the fallback image
- **AND** browsers that support AVIF or WebP SHALL receive the most efficient available format

#### Scenario: SVG asset is used

- **WHEN** `OptimizedImage` receives an SVG source
- **THEN** the component SHALL continue rendering a direct image element
- **AND** the existing logo usage in the navbar SHALL remain visually unchanged

#### Scenario: Logo and icon rendering after OptimizedLogo removal

- **WHEN** a logo or tech icon previously rendered by `OptimizedLogo` is rendered (e.g. the technology grid in About)
- **THEN** it SHALL be rendered by `OptimizedImage` instead
- **AND** it SHALL preserve the same `priority`, lazy-loading, and error-fallback behavior
- **AND** it SHALL remain visually unchanged
