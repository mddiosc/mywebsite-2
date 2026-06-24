## 0. Setup

- [x] 0.1 Create and work on the dedicated branch `codex/remove-over-engineering`.

## 1. Delete tier (dead code — zero risk)

- [x] 1.1 Delete `src/components/TransitionLink.tsx` and `src/hooks/useNavigationTransition.ts`.
- [x] 1.2 Delete `src/components/AccessibleMotion.tsx` and `src/constants/accessibleAnimations.ts`.
- [x] 1.3 Remove the `TransitionLink`, `TransitionLinkProps`, and `AccessibleMotion` exports from `src/components/index.ts`.
- [x] 1.4 Remove the `useNavigationTransition` and `UseNavigationTransitionResult` exports from `src/hooks/index.ts`.
- [x] 1.5 Remove dead exports in `src/utils/mergeProjectData.ts`: `filterProjectsWithCaseStudies`, `getProjectBySlug`, `createCaseStudyMap` (keep `createCaseStudyMap` as a private internal function used by `mergeProjectsWithCaseStudies`).
- [x] 1.6 Delete tests that covered only deleted code (if any exist for `accessibleAnimations` / `TransitionLink`).
- [x] 1.7 `pnpm type-check && pnpm lint && pnpm test` — all green. Commit: "chore: remove dead components and exports".

## 2. Native tier (prefer the platform)

- [x] 2.1 Rewrite the `useContactForm.ts` call with native `fetch`, preserving error-message normalization.
- [x] 2.2 Delete `src/lib/axios.ts`; update `src/pages/Projects/__tests__/test-utils.tsx` and any axios mocks.
- [x] 2.3 Remove `axios` from `package.json`; run `pnpm install` to update the lockfile.
- [x] 2.4 Inline the `preconnect()` from `src/lib/resourcePreloading.ts` into `src/main.tsx`; delete the file.
- [x] 2.5 `pnpm type-check && pnpm lint && pnpm test` — green. Manually verify contact form submission (success + error). Commit: "refactor: drop axios for native fetch, inline preconnect".

## 3. Yagni tier (collapse single-use abstractions)

- [ ] 3.1 Unify the theme context into a single module (`ThemeProvider` + `useThemeContext`); delete the redundant `themeContextValue.ts`, `useThemeContext.ts`, `ThemeContext.tsx`, `context/index.ts`.
- [ ] 3.2 Update imports in live consumers: `App.tsx`, `Navbar.tsx`, `Footer.tsx`, `ThemeToggle.tsx`, `BlogPost.tsx`, `ProjectCaseStudy.tsx`, and tests (`seo-metadata.test.tsx`, `ProjectCaseStudy.routing.test.ts`).
- [ ] 3.3 Migrate the sole `OptimizedLogo` caller (`TechnologyGrid.tsx`) to `OptimizedImage`; delete `OptimizedLogo.tsx` and its barrel export. Satisfies the `responsive-image-delivery` delta (logos/icons served by `OptimizedImage`, no visual or `priority`/lazy/error semantic change).
- [ ] 3.4 `pnpm type-check && pnpm lint && pnpm test` — green. Manually verify theme toggle (light/dark/system) and logo rendering in About. Commit: "refactor: collapse theme context and fold OptimizedLogo".

## 4. Shrink tier (same behavior, fewer lines)

- [ ] 4.1 Derive `ANIMATION_CONFIG` from `ANIMATION_DELAYS` in `src/constants/animations.ts`.
- [ ] 4.2 Factor out the repeated `ease` across the 6 consts in `src/lib/animations.ts`.
- [ ] 4.3 Collapse the `Set` logic in `src/components/RoutePreloader.tsx` to a flat loop (preserves: preload all routes except the current one after the delay).
- [ ] 4.4 `pnpm type-check && pnpm lint && pnpm test` — green. Commit: "refactor: shrink animation configs and route preloader".

## 5. Final validation

- [ ] 5.1 `pnpm quality` (lint + docs:lint + format:check + type-check) green.
- [ ] 5.2 `pnpm test:e2e` (Playwright) green — navigation, theme, contact with no regression.
- [ ] 5.3 Confirm the count: ~620 fewer lines and `axios` absent from `package.json` and the lockfile.
- [ ] 5.4 Verify the `responsive-image-delivery` delta: the technology-grid logos/icons (About) render via `OptimizedImage` and remain visually unchanged (compare against the Playwright visual baseline).
