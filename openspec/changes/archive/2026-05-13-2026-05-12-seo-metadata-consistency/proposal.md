# seo-metadata-consistency Proposal

## Why

The site already has a strong SEO base: localized routes, canonical URLs, hreflang alternates, Open Graph tags, Twitter cards, and article metadata support. The remaining opportunity is consistency: make sure every indexable page publishes the right metadata from a shared, predictable model so content pages, landing pages, and share cards all stay aligned as the site evolves.

## What Changes

- Standardize how pages derive canonical URLs, alternate language URLs, and social metadata from a shared helper/model.
- Ensure static pages and content detail pages publish complete metadata sets, including titles, descriptions, canonical URLs, hreflang alternates, Open Graph, Twitter cards, and article-specific fields where applicable.
- Keep non-indexable pages out of the metadata set.
- Add tests that verify representative localized pages expose the expected head tags.

## Capabilities

### New Capabilities

- `seo-i18n-metadata`: keep localized metadata deterministic and complete across indexable routes.

### Modified Capabilities

- `seo-i18n-metadata`: extend the existing SEO metadata contract so content pages consistently emit richer social and article metadata.

## Impact

- **Code affected**: `src/components/DocumentHead.tsx`, `src/lib/seo.ts`, localized page components, and metadata tests.
- **Expected outcome**: more consistent search engine and social preview behavior, fewer metadata gaps between pages, and easier maintenance when routes or content evolve.
- **Non-impact**: URL structure, page content, and visible UI layout.
