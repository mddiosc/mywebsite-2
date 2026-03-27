## Context

The project uses localized routes (`/:lang/...`) for Spanish and English and already sets per-page canonical URLs through `DocumentHead`. However, alternates (`<link rel="alternate" hreflang="...">`) are not emitted consistently, which weakens SEO language targeting and duplicate-content signals.

`DocumentHead` is the central metadata component used across all top-level pages and localized detail pages (blog posts, project case studies). This makes it the best integration point for `hreflang` support without introducing cross-cutting page-level duplication.

## Goals / Non-Goals

**Goals:**

- Emit canonical + language alternates consistently for indexable localized routes.
- Support `es`, `en`, and `x-default` alternates in a single reusable API.
- Avoid per-page duplicated URL assembly logic by adding a shared helper.
- Preserve existing metadata behavior (title, description, Open Graph, article tags).
- Keep 404 pages non-indexable and avoid canonical/alternate links there.

**Non-Goals:**

- No URL structure changes (`/:lang/...` remains unchanged).
- No sitemap format changes in this change.
- No SSR introduction or backend SEO rendering.
- No content translation changes.

## Decisions

### Decision 1: Extend `DocumentHead` with explicit alternate link support

**Chosen**: Add an optional `alternateUrls` prop to `DocumentHead` with typed entries (`hreflang`, `href`).

**Rationale**: `DocumentHead` already owns canonical output and is used by all SEO-relevant pages. Extending this component keeps metadata composition centralized and reduces divergence risk.

**Alternative considered**: Compute and render alternates directly inside each page. Rejected due to duplication and higher drift risk.

### Decision 2: Introduce a shared SEO URL helper

**Chosen**: Add a utility that builds locale-aware canonical and alternates from a route path segment.

**Rationale**: Current pages build canonical URLs inline with string templates. A helper ensures consistent slash handling, avoids route mistakes, and simplifies tests.

**Alternative considered**: Keep inline templates and only add alternates ad-hoc. Rejected because it repeats logic and makes future route changes error-prone.

### Decision 3: Keep 404 metadata explicitly non-indexable

**Chosen**: 404 page continues with `robots="noindex, nofollow"` and no canonical/alternates.

**Rationale**: Canonical/alternates on non-index pages can send mixed indexing signals.

## Risks / Trade-offs

- **[Risk] Incorrect alternate URL generation for nested routes** -> **Mitigation**: add helper unit tests for `/`, page routes, and slug routes.
- **[Risk] Duplicate `<link rel="alternate">` tags in head** -> **Mitigation**: ensure each page passes a single generated set (`es`, `en`, `x-default`) and test rendered head tags.
- **[Trade-off] Slightly larger metadata payload per page** -> acceptable for clear SEO gains.

## Migration Plan

1. Create branch `feat/seo-i18n-hreflang-canonical`.
2. Add SEO URL helper and unit tests.
3. Extend `DocumentHead` prop types and rendering for alternates.
4. Update localized pages to pass canonical + alternates via helper.
5. Add integration tests for representative routes.
6. Run lint, type-check, unit tests, e2e smoke.
7. Open PR and verify Lighthouse SEO category remains >= threshold.

## Open Questions

- None blocking. Default language for `x-default` will follow current runtime default (`es`) unless configured otherwise in i18n defaults.
