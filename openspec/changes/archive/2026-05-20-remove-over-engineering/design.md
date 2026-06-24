## Context

Static SPA (React 19 + Vite). All cuts are internal and must preserve observable behavior: theme, navigation, animations, SEO, i18n, and the contact form. Validation relies on the existing suite (Vitest + Playwright); no new infrastructure is introduced.

## Prior verification (against current code)

- `TransitionLink` and `useNavigationTransition`: 0 real consumers (they only reference each other and the barrels). The real `useTransition` navigation lives in `NavigationProgress.tsx` (provider + `useNavigationProgress`), which **is** live.
- `AccessibleMotion` and `accessibleAnimations`: 0 consumers in `.tsx`; they only appear in blog markdown (documentation, not usage).
- `mergeProjectData`: only `mergeProjectsWithCaseStudies` has a consumer (`useProjectsWithCaseStudies.ts`).
- `axios`: the only real call is `axiosInstance.post('https://formspree.io/f/...')` in `useContactForm.ts`. The interceptor only normalizes the error message.
- `resourcePreloading`: `initializeCriticalResources()` → `preconnectToOrigins()` → a single `preconnect()` to Umami.

## Decisions

### Execution order by risk

1. **`delete` tier** first (dead code, no consumers): deletions + barrel cleanup. Zero risk.
2. **`native`/`yagni` tier** next (touch live callers): axios→fetch, logo fold, context collapse, preloading inline.
3. **`shrink` tier** last (same-behavior refactor).

Split into commits per tier so a test failure isolates the cause.

### axios → fetch

The only call is a JSON `POST` to Formspree with `Content-Type: application/json`. `fetch` covers it. Error normalization is preserved (map a non-ok response to an `Error` with a readable message) so the contract the form consumes does not change.

```ts
// ponytail: only network call; native fetch instead of axios wrapper
const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
})
if (!res.ok) {
  const data = await res.json().catch(() => null)
  throw new Error(data?.message ?? 'An error occurred')
}
```

### OptimizedLogo → OptimizedImage fold

`OptimizedImage` already implements `isSvgSource`, `priority`, `hasError`, and the lazy observer via ref callback. `OptimizedLogo` is a subset. The sole caller (`TechnologyGrid.tsx`) is migrated to `OptimizedImage`; verify the error fallback (SVG icon) still appears.

### Theme context collapse

Four files for one context. Unify into a single module (e.g. `src/context/theme.tsx`) exporting `ThemeProvider` and `useThemeContext`. Update imports of the live consumers (`Navbar`, `Footer`, `ThemeToggle`, `BlogPost`, `ProjectCaseStudy` and their tests).

## Risks / Mitigation

- **Tests coupled to deleted code**: `accessibleAnimations`/`axios`/`clientObservability` tests exist. Mitigation: delete tests for deleted code; keep the rest.
- **Broken imports after moving the context**: `tsc -b --noEmit` + `eslint` catch dangling references before the suite runs.
- **Theme behavior (anti-FOUC)**: the logic lives in `useTheme.ts` and the `index.html` IIFE, not in the collapsed files; the collapse is purely context wiring. No functional change.

## Spec impact

- **`responsive-image-delivery` (MODIFIED)**: removing `OptimizedLogo` touches this capability because its "SVG asset is used" scenario already fixed logo rendering. The delta (`specs/responsive-image-delivery/spec.md`) adds a scenario guaranteeing that every logo/icon previously served by `OptimizedLogo` is served by `OptimizedImage` with no visual or semantic change.
- **`conditional-vendor-loading` (no change, verified)**: its conditional-preconnect requirement applies to per-page third parties (recaptcha/formspree). Inlining `resourcePreloading` only relocates the global Umami `preconnect()`; it does not alter conditional preconnects. No delta required.
- Remaining live specs: unrelated to the touched code.

## Migration

No data or route migration. Work on the dedicated branch `codex/remove-over-engineering`.
