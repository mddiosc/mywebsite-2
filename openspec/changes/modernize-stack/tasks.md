## 1. Branch Setup

- [x] 1.1 Create and switch to branch `feat/modernize-stack`

## 2. Phase 1 — Safe Updates + Volta Pinning

- [x] 2.1 Update `typescript` to `~5.9.3` in `package.json`
- [x] 2.2 Update `globals` to `^16.0.0` in `package.json` (devDependencies)
- [x] 2.3 Update `lint-staged` to `^16.4.0` in `package.json` (devDependencies)
- [x] 2.4 Update `prettier-plugin-tailwindcss` to `^0.7.2` in `package.json` (devDependencies)
- [x] 2.5 Run `pnpm update` to resolve all remaining patches and minors within existing `^` ranges (vitest, @vitest/coverage-v8, @tailwindcss/vite, tailwindcss, @vitest/eslint-plugin, @commitlint/cli, @commitlint/config-conventional, @floating-ui/react, and others)
- [x] 2.6 Add `volta` section to `package.json` with `"node": "22.13.0"` and `"pnpm": "9.15.4"`
- [x] 2.7 Update `packageManager` field in `package.json` to `pnpm@9.15.4` (sync with volta section)
- [x] 2.8 Update `Dockerfile`: change `corepack prepare pnpm@9.15.3 --activate` to `pnpm@9.15.4` to match `packageManager`
- [x] 2.9 Verify `eslint.config.js` still uses `globals.browser` correctly after globals v16 upgrade — run `pnpm lint` and fix any issues
- [x] 2.10 Verify `lint-staged` pre-commit hook still works — run `pnpm lint-staged` manually or make a test commit
- [x] 2.11 Verify `prettier-plugin-tailwindcss` 0.7.x doesn't re-sort classes — run `pnpm format:check` and if classes change, run `pnpm format` and include the diff
- [x] 2.12 Run `pnpm type-check` — must pass with zero errors
- [x] 2.13 Run `pnpm test` — all unit tests must pass
- [x] 2.14 Run `pnpm build` — build must succeed and produce `dist/`
- [ ] 2.15 Commit Phase 1 changes with message `feat: phase 1 safe dependency updates and volta pinning`

## 3. Phase 2 — Vite 8 + Rolldown Migration

- [ ] 3.1 Update `vite` to `^8.0.3` in `package.json` (devDependencies)
- [ ] 3.2 Update `@vitejs/plugin-react-swc` to `^4.3.0` in `package.json` (devDependencies)
- [ ] 3.3 Run `pnpm install` to update lockfile
- [ ] 3.4 In `vite.config.ts`: remove the `build.rollupOptions` block entirely
- [ ] 3.5 In `vite.config.ts`: add `build.rolldownOptions.output.codeSplitting` with the following groups (in priority order): `react-vendor` (react + react-dom, priority 30), `animation-vendor` (framer-motion, priority 20), `ui-vendor` (@headlessui + @heroicons + @floating-ui, priority 15), `data-vendor` (@tanstack + react-hook-form + @hookform + zod + axios, priority 10), `i18n-vendor` (react-i18next + i18next, priority 10), `markdown-vendor` (react-markdown + rehype + remark + highlight, priority 5)
- [ ] 3.6 Keep `chunkSizeWarningLimit: 600` in build options
- [ ] 3.7 Run `pnpm build` and verify it completes without errors
- [ ] 3.8 Inspect `dist/assets/` — confirm named chunk files exist (react-vendor, animation-vendor, etc.) and no single file exceeds 600KB
- [ ] 3.9 Verify `dist/sitemap.xml` exists and contains all expected routes (static + dynamic blog routes in both `/es/` and `/en/`)
- [ ] 3.10 Run `pnpm test` — all unit tests must pass
- [ ] 3.11 Run `pnpm test:e2e` — all Playwright tests must pass (or document any pre-existing failures)
- [ ] 3.12 Commit Phase 2 changes with message `feat: upgrade to vite 8 with rolldown and migrate to codeSplitting API`

## 4. Phase 3 — Remaining Dev Tooling Majors

- [ ] 4.1 Update `@vitest/eslint-plugin` to latest 1.x if not already resolved in Phase 1
- [ ] 4.2 Update `globals` further if 16.x was resolved to a patch in Phase 1 and 16.x latest is available
- [ ] 4.3 Run `pnpm lint` — must pass with zero errors
- [ ] 4.4 Run `pnpm format:check` — must pass
- [ ] 4.5 Run `pnpm quality` (full quality gate: lint + docs:lint + format:check + type-check)
- [ ] 4.6 Trigger a real pre-commit hook check: stage a file and attempt a commit to verify husky + lint-staged + commitlint all fire correctly
- [ ] 4.7 Commit Phase 3 changes with message `feat: upgrade dev tooling majors (globals, lint-staged, prettier-plugin-tailwindcss)`

## 5. Final Validation

- [ ] 5.1 Run full test suite: `pnpm test:coverage` — verify coverage thresholds still pass
- [ ] 5.2 Run `pnpm build` one final time on the complete updated branch
- [ ] 5.3 Verify `dist/` is clean and `pnpm preview` serves the app correctly
- [ ] 5.4 Update `openspec/config.yaml` context section to reflect Vite 8 and TypeScript 5.9
- [ ] 5.5 Open PR from `feat/modernize-stack` to `main` and confirm CI pipeline (quality + e2e jobs) passes
