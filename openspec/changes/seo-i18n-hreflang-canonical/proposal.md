## Why

The site is bilingual (`/es` and `/en`) and already sets canonical URLs per page, but it does not consistently publish language alternates (`hreflang`). Without consistent `canonical` + `hreflang` signals, search engines may index duplicated locale pages less effectively and route users to the wrong language.

## What Changes

- Add consistent alternate language metadata (`hreflang`) for all indexable bilingual pages.
- Keep canonical URLs aligned with the active locale route and current URL shape.
- Add `x-default` alternate pointing to the default language landing route.
- Keep non-indexable pages (404) with `noindex, nofollow` and without canonical/alternates.
- Add automated tests validating canonical and alternate tags for representative routes.

## Capabilities

### New Capabilities

- `seo-i18n-metadata`: Ensure every indexable localized route emits a canonical URL plus `hreflang` alternates (`es`, `en`, and `x-default`) consistently.

### Modified Capabilities

_(None)_

## Impact

- **Components**: `src/components/DocumentHead.tsx` will support alternate link tags.
- **Pages**: localized pages using `DocumentHead` will pass or derive locale alternates.
- **Utilities**: likely add a small SEO URL helper to avoid duplicated per-page URL logic.
- **Tests**: add/update tests for metadata rendering and route-level SEO consistency.
- **SEO behavior**: improves language discovery and duplicate-content handling without changing user-facing UI.
