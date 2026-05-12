# performance-image-optimization Proposal

## Why

The app already has strong performance foundations, but two gaps remain: there is no easy way to inspect bundle composition during optimization work, and the shared image component does not yet take advantage of modern raster formats or responsive delivery patterns. This proposal keeps the current runtime behavior intact while improving observability and asset delivery.

## What Changes

- Add an optional bundle analysis flow using a Vite/Rollup visualizer so the production bundle can be inspected without changing the normal build path.
- Extend `OptimizedImage` so raster images can be delivered through `<picture>` with AVIF/WebP sources, responsive `srcset`/`sizes`, and the existing lazy-loading/placeholder behavior.
- Preserve current SVG logo usage and avoid changing `OptimizedLogo`.

## Capabilities

### New Capabilities

- `bundle-visualization`: generate an HTML bundle report for build review and regression analysis.
- `responsive-image-delivery`: serve raster images in modern formats with responsive variants while keeping existing fallback behavior.

### Modified Capabilities

- None.

## Impact

- **Code affected**: `vite.config.ts`, `package.json`, `src/components/OptimizedImage.tsx`, and related tests/helpers.
- **Expected outcome**: easier bundle inspection during optimization work and smaller image transfers for raster assets that adopt the new image component contract.
- **Non-impact**: routing, i18n, SEO metadata, and the current SVG logo rendering flow.
