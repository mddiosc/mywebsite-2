# performance-image-optimization Design

## Context

The repo already uses Vite 8 with Rolldown chunk splitting, a fixed performance budget script, and a static SPA deployment model. `OptimizedImage` currently handles lazy loading, placeholders, and priority rendering, but it is only used for SVG logos today. That means any image enhancement must preserve SVG behavior and not depend on a global asset pipeline change.

## Goals / Non-Goals

**Goals:**

- Make bundle composition visible through a dedicated analysis command or env-gated build path.
- Improve raster image delivery with AVIF/WebP sources and responsive sizing.
- Preserve current placeholder, lazy-load, and priority semantics.
- Keep SVG logo rendering unchanged.

**Non-Goals:**

- No SSR or backend image service.
- No CDN migration or global media pipeline.
- No redesign of `OptimizedLogo`.
- No change to routing, i18n, or SEO behavior.

## Decisions

### D1: Bundle visualization is analysis-only

**Decision**: Add the visualizer behind a dedicated command or env flag so normal `pnpm build` stays unchanged.

**Rationale**: Bundle inspection should be available on demand without adding noise or artifacts to every production build.

### D2: `OptimizedImage` stays backwards-compatible

**Decision**: Keep the current `src`, `alt`, `width`, `height`, `priority`, and `placeholder` props working as they do now, and add optional responsive/source props for raster use cases.

**Rationale**: The component is already imported in the navbar; existing call sites must not break.

### D3: SVG inputs bypass picture generation

**Decision**: If the image source is SVG, render the current single-image fallback path instead of building `<picture>` sources.

**Rationale**: AVIF/WebP is a raster optimization; SVG should remain a direct vector asset.

### D4: Responsive delivery is explicit or convention-based

**Decision**: Support either explicit responsive source data or a predictable source-derivation convention for raster assets, then feed `srcset` and `sizes` into the rendered image.

**Rationale**: The component needs to work for future content without forcing a repo-wide asset migration.

## Risks / Trade-offs

- **[Risk]** The image component may become more complex. **Mitigation**: keep the SVG path simple and isolate source-building logic in a small helper.
- **[Risk]** The visualizer may add extra files during analysis runs. **Mitigation**: gate it behind the dedicated analysis command.
- **[Risk]** Current call sites only use SVG. **Mitigation**: preserve the existing runtime path so the change is additive, not disruptive.

## Open Questions

- Should the analysis command be a new script such as `pnpm build:analyze`, or should it be driven by an env flag like `ANALYZE=true pnpm build`?
- Will future raster assets be imported from `src/` or served from `public/`? That affects how source variants are derived.
