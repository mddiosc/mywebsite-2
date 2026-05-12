# performance-image-optimization Tasks

## 1. Branch Setup

- [x] 1.1 Create branch `chore/performance-image-optimization` from `main`
- [ ] 1.2 Open a PR back to `main` after the change is implemented and verified

## 2. Bundle Visualization

- [x] 2.1 Add the visualizer dependency and wire it into `vite.config.ts`
- [x] 2.2 Expose an analysis command in `package.json` for generating the bundle report
- [x] 2.3 Verify the normal build path is unchanged and the analysis path emits an HTML report

## 3. Responsive Image Delivery

- [x] 3.1 Extend `src/components/OptimizedImage.tsx` with raster source support
- [x] 3.2 Preserve the current placeholder, lazy-loading, and priority behavior
- [x] 3.3 Keep SVG sources on the existing direct-image path
- [x] 3.4 Add responsive `srcset`/`sizes` handling for raster assets

## 4. Validation

- [x] 4.1 Run `pnpm test` and fix any component regressions
- [x] 4.2 Run `pnpm build` and confirm the normal production build still passes
- [x] 4.3 Run the analysis command and verify the bundle report is generated
- [x] 4.4 Manually verify the navbar logo still renders correctly in both themes
