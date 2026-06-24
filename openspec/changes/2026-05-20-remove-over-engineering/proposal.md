## Why

A full-tree over-engineering audit found dead code and single-use abstractions that add maintenance surface with no product value: two components and a hook with zero real consumers, an animation-variants set nobody imports, dead exports, an `axios` wrapper for a single `POST` call, and a preloading utility layer that only wraps one native call. Removing them cuts ~620 lines and one dependency (`axios`) without changing the observable behavior of the SPA.

An earlier review had reported inflated figures (6 removable dependencies including a `react-beautiful-dnd` that does not exist in the repo, and flagged `useNavigationProgress` as dead when it is live). This proposal corrects those claims and is limited to cuts verified against the current code.

## What Changes

- **Remove dead code (zero risk, no real consumers):**
  - `src/components/TransitionLink.tsx` + `src/hooks/useNavigationTransition.ts`: zero consumers; the `useTransition` navigation logic already lives in `NavigationProgress.tsx`.
  - `src/components/AccessibleMotion.tsx` + `src/constants/accessibleAnimations.ts`: zero consumers outside blog markdown; components use `useReducedMotion` directly.
  - Dead exports in `src/utils/mergeProjectData.ts`: `filterProjectsWithCaseStudies`, `getProjectBySlug`, `createCaseStudyMap` (only `mergeProjectsWithCaseStudies` is used).
  - Clean up the corresponding barrel entries (`src/components/index.ts`, `src/hooks/index.ts`).

- **Collapse single-use abstractions (yagni):**
  - Merge the theme context split across 4 files (`themeContextValue.ts`, `useThemeContext.ts`, `ThemeContext.tsx`, `context/index.ts`) into a single module.
  - Fold `OptimizedLogo.tsx` into `OptimizedImage.tsx` (which already handles SVG, `priority`, `hasError`, and the lazy observer); update the sole caller in `TechnologyGrid.tsx`.

- **Prefer platform over dependency (native):**
  - Replace the `axios` wrapper (`src/lib/axios.ts`) with `fetch` in the single call (`useContactForm.ts` → `POST` to Formspree). Removes the `axios` dependency.
  - Inline `src/lib/resourcePreloading.ts` (2 functions wrapping one `preconnect()`) directly into `main.tsx`.

- **Fewer lines, same behavior (shrink):**
  - `src/constants/animations.ts`: `ANIMATION_CONFIG` only re-wraps `ANIMATION_DELAYS` in `{ delay }`; derive it.
  - `src/lib/animations.ts`: factor out the repeated `ease` across the 6 consts.
  - `src/components/RoutePreloader.tsx`: the "predictive" `Set` logic preloads all routes anyway; collapse to a flat loop.

## Non-goals

- Do not reorganize `Navbar.tsx` or split large components for readability: it does not reduce net lines and is out of scope for a trimming pass.
- Do not change import style (relative vs alias) or the contents of barrels that have live consumers: zero lines cut, noise.
- Do not touch `BlogFilters.tsx`: it filters by text search + multi-tag toggle, which a native `<select>` does not cover.
- Do not change visible behavior: theme, navigation, animations, SEO, i18n, and the contact form must behave the same.

## Capabilities

### New Capabilities

_(None. This is an internal cleanup with no new user-facing capabilities.)_

### Modified Capabilities

- `responsive-image-delivery`: The `OptimizedLogo` component is removed and its sole caller migrated to `OptimizedImage`. The spec already guaranteed that the SVG logo path renders via `OptimizedImage`; the delta adds a scenario fixing that every logo/icon previously served by `OptimizedLogo` is now served by `OptimizedImage` with no visual or semantic change (`priority`, lazy, error fallback).

### Unaffected (verified, no change)

- `conditional-vendor-loading`: its "Preconnect hints are conditional" requirement covers **conditional third-party** preconnects (recaptcha/formspree per page). Inlining `resourcePreloading` only moves the **global Umami** `preconnect()` from a file into `main.tsx`; it neither adds nor removes conditional preconnects. Identical behavior.

## Impact

- **Affected code**: `src/components/{TransitionLink,AccessibleMotion,OptimizedLogo,RoutePreloader,OptimizedImage,index}.tsx`, `src/hooks/{useNavigationTransition,index}.ts`, `src/constants/{accessibleAnimations,animations}.ts`, `src/utils/mergeProjectData.ts`, `src/context/*`, `src/lib/{axios,resourcePreloading,animations}.ts`, `src/main.tsx`, `src/pages/About/components/TechnologyGrid.tsx`, `src/pages/Contact/hooks/useContactForm.ts`.
- **Removed dependency**: `axios`.
- **Breaking changes**: None. No changes to routes, UI behavior, or public component APIs in use.
- **Net**: ~620 lines removed, −1 dependency.
- **Validation**: the existing suite (Vitest + Playwright) must pass unchanged; adjust/remove only tests covering deleted code (e.g. `accessibleAnimations`/`axios` tests if present).
