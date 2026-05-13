## ADDED Requirements

### Requirement: Indexable localized pages emit complete SEO metadata

The system SHALL emit canonical URLs, hreflang alternates, Open Graph metadata, and Twitter card metadata for every indexable localized page.

#### Scenario: Localized static page metadata

- **WHEN** a user visits an indexable static page such as `/:lang/about`, `/:lang/projects`, `/:lang/blog`, or `/:lang/contact`
- **THEN** the page head SHALL contain a canonical URL for the current locale route
- **AND** the page head SHALL contain `hreflang` alternates for `es`, `en`, and `x-default`
- **AND** the page head SHALL contain Open Graph and Twitter card metadata derived from the page content

#### Scenario: Content detail page metadata

- **WHEN** a user visits an indexable localized detail route such as `/:lang/blog/:slug` or `/:lang/projects/:slug`
- **THEN** canonical, alternate, Open Graph, Twitter, and article-specific metadata SHALL be derived from the content model for that route
- **AND** the shared metadata rendering path SHALL remain deterministic across locales

### Requirement: Non-indexable pages do not emit indexable SEO metadata

Pages marked as non-indexable SHALL not emit canonical or alternate language links.

#### Scenario: 404 page metadata

- **WHEN** a user visits an unknown route that renders the 404 page
- **THEN** the page SHALL include `robots="noindex, nofollow"`
- **AND** the page SHALL NOT include canonical or alternate language links

### Requirement: Metadata URLs are normalized through shared logic

Canonical and alternate URLs SHALL be generated through shared normalized route logic to avoid inconsistent trailing slashes, duplicated slashes, or mismatched locale segments.

#### Scenario: Root route normalization

- **WHEN** metadata is generated for the localized home route
- **THEN** canonical and alternate URLs SHALL resolve to normalized locale roots such as `/es/` and `/en/`

#### Scenario: Nested route normalization

- **WHEN** metadata is generated for nested routes with dynamic segments
- **THEN** canonical and alternate URLs SHALL preserve path segments exactly and switch only the locale prefix
