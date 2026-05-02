## 1. Branch Setup

- [ ] 1.1 Create branch `chore/frontend-performance-quick-wins` from `main`

## 2. Performance Boot Optimization

- [ ] 2.1 Condicionalize ReactQueryDevtools in `src/main.tsx`
  - Wrap `<ReactQueryDevtools initialIsOpen={false} />` with `import.meta.env.DEV &&`
- [ ] 2.2 Remove artificial delay from `src/hooks/useBlog.ts`
  - Delete `await new Promise((resolve) => setTimeout(resolve, 100))`
- [ ] 2.3 Verify production bundle excludes devtools
  - Run `pnpm build && pnpm performance:budget`

## 3. Theme Anti-Flash

- [ ] 3.1 Read current `index.html` to locate `</head>` position
- [ ] 3.2 Add synchronous theme-init IIFE as first child of `<head>` in `index.html`
  - Reads `localStorage.getItem('theme-preference')`
  - Resolves `system` via `window.matchMedia('(prefers-color-scheme: dark)')`
  - Applies `dark` or `light` class to `<html>` element
- [ ] 3.3 Update `src/hooks/useTheme.ts` to detect existing class on init
  - On initialization, check if `<html>` already has the correct theme class
  - If class exists, use it as initial state without writing to localStorage
  - If class is missing, apply it and persist as before
- [ ] 3.4 Verify no theme flash on page reload with dark preference stored
- [ ] 3.5 Verify runtime theme toggle still works correctly

## 4. Resource Hints Activation

- [ ] 4.1 Add static `<link rel="preconnect">` hints to `index.html`
  - `https://fonts.googleapis.com`
  - `https://fonts.gstatic.com` with `crossorigin`
  - `https://formspree.io`
  - `https://mywebsite-umami.mddiosc.cloud`
- [ ] 4.2 Audit `src/lib/resourcePreloading.ts` exports
  - List all exported functions
  - For each: check if it has callers in the codebase
  - Connect orphaned functions where appropriate, or mark as intended-for-future-use with comment
- [ ] 4.3 Verify preconnect hints are present in served HTML

## 5. Validation

- [ ] 5.1 Run `pnpm test` and ensure all tests pass
- [ ] 5.2 Run `pnpm build && pnpm performance:budget` and ensure all budgets pass
- [ ] 5.3 Run `pnpm lighthouse:ci` and verify performance score ≥ 0.65
- [ ] 5.4 Run `pnpm test:e2e` smoke suite and verify no regressions
- [ ] 5.5 Verify no theme flash on cold load (manual or Playwright screenshot)
