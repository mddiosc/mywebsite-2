## ADDED Requirements

### Requirement: Raster images can use modern formats

The system SHALL render raster images through `<picture>` when modern alternatives are available, while keeping SVG inputs on the direct image path.

#### Scenario: Raster asset has modern alternatives

- **WHEN** `OptimizedImage` receives a raster source with AVIF and WebP variants available
- **THEN** the component SHALL render a `<picture>` element with AVIF and WebP sources ahead of the fallback image
- **AND** browsers that support AVIF or WebP SHALL receive the most efficient available format

#### Scenario: SVG asset is used

- **WHEN** `OptimizedImage` receives an SVG source
- **THEN** the component SHALL continue rendering a direct image element
- **AND** the existing logo usage in the navbar SHALL remain visually unchanged

### Requirement: Raster images support responsive delivery

The system SHALL support responsive image delivery for raster assets using `srcset` and `sizes`.

#### Scenario: Responsive raster delivery

- **WHEN** `OptimizedImage` renders a raster asset with responsive variants
- **THEN** the emitted image markup SHALL include `srcset` and, when provided, `sizes`
- **AND** the browser SHALL be able to select a size appropriate for the viewport

### Requirement: Existing lazy loading and placeholder behavior is preserved

The system SHALL preserve the current lazy-loading, placeholder, and priority semantics of `OptimizedImage`.

#### Scenario: Non-priority image remains lazy

- **WHEN** `priority` is false
- **THEN** the image SHALL continue to defer loading until it enters view
- **AND** the placeholder behavior SHALL remain in place until the image loads

#### Scenario: Priority image loads eagerly

- **WHEN** `priority` is true
- **THEN** the image SHALL continue to load eagerly
- **AND** the observer-based lazy-loading path SHALL remain bypassed
