## ADDED Requirements

### Requirement: Indexable localized pages MUST emit canonical and hreflang alternates

The system SHALL emit a canonical URL for every indexable localized route and SHALL emit alternate language links for `es`, `en`, and `x-default`.

#### Scenario: Localized static page metadata

- **WHEN** a user visits an indexable static page such as `/:lang/about`, `/:lang/projects`, `/:lang/blog`, or `/:lang/contact`
- **THEN** the page head MUST contain one `rel="canonical"` link for the current locale route and three `rel="alternate"` links with `hreflang="es"`, `hreflang="en"`, and `hreflang="x-default"`

#### Scenario: Localized detail page metadata

- **WHEN** a user visits an indexable localized detail route such as `/:lang/blog/:slug` or `/:lang/projects/:slug`
- **THEN** canonical and alternate links MUST include the same slug path for each locale variant

### Requirement: Non-indexable pages MUST NOT emit canonical or alternates

Pages marked as non-indexable SHALL not emit canonical or alternate language links.

#### Scenario: 404 page metadata

- **WHEN** a user visits an unknown route that renders the 404 page
- **THEN** the page MUST include `robots="noindex, nofollow"` and MUST NOT include canonical or alternate language links

### Requirement: Alternate URLs MUST be deterministic and normalized

Canonical and alternate URLs SHALL be generated via shared normalized route logic to avoid inconsistent trailing slashes, duplicated slashes, or mismatched locale segments.

#### Scenario: Root route normalization

- **WHEN** metadata is generated for the localized home route
- **THEN** canonical and alternate URLs MUST resolve to normalized locale roots (e.g., `/es/`, `/en/`) without malformed separators

#### Scenario: Nested route normalization

- **WHEN** metadata is generated for nested routes with dynamic segments
- **THEN** canonical and alternate URLs MUST preserve path segments exactly and switch only the locale prefix
