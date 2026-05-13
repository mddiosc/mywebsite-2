# seo-metadata-consistency Design

## Context

The project already centralizes document metadata in `DocumentHead` and builds locale-aware canonical URLs in `src/lib/seo.ts`. The current implementation covers the core tags, but the contract is only as good as the pages that use it. The design goal is to make metadata composition deterministic and shared so new content pages do not drift from the established SEO pattern.

## Goals / Non-Goals

**Goals:**

- Keep canonical and alternate URLs derived from one shared locale-aware helper.
- Ensure `DocumentHead` remains the single metadata rendering layer.
- Support consistent social previews for static pages and content detail pages.
- Preserve `noindex, nofollow` behavior for non-indexable routes.

**Non-Goals:**

- No route structure changes.
- No sitemap redesign.
- No backend SEO rendering.
- No new analytics or tracking integrations.

## Decisions

### D1: Metadata rendering stays centralized in `DocumentHead`

**Decision**: Keep `DocumentHead` as the only place that renders canonical, alternate, Open Graph, Twitter, and article tags.

**Rationale**: Centralization prevents metadata drift and keeps tests focused on one component and its inputs.

### D2: Locale-aware URL generation remains shared

**Decision**: Continue using a shared helper in `src/lib/seo.ts` for canonical and alternate URLs.

**Rationale**: The helper already normalizes routes and locale prefixes; extending it is safer than duplicating string assembly in pages.

### D3: Content pages provide their own semantic metadata inputs

**Decision**: Blog posts, project case studies, and static pages each supply the title, description, canonical path, and any article-specific data they own.

**Rationale**: The page knows the content best; `DocumentHead` should render it, not infer it.

## Risks / Trade-offs

- **[Risk]** Metadata may still drift if a page bypasses `DocumentHead`. **Mitigation**: keep tests around representative pages and the component.
- **[Risk]** Richer metadata can increase page-specific boilerplate. **Mitigation**: lean on shared helpers and keep page-level inputs small.
- **[Risk]** Incorrect canonical paths can hurt SEO. **Mitigation**: normalize with helper tests before rollout.

## Open Questions

- Should every page expose a dedicated metadata helper, or should the existing page components compute metadata inline from their content models?
- Are there any pages that should intentionally omit social preview tags, or should all indexable pages use a default preview image?
