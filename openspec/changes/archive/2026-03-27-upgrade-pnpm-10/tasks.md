## 1. Branch Setup

- [x] 1.1 Create and switch to branch `feat/upgrade-pnpm-10`

## 2. Pre-upgrade Audit

- [x] 2.1 Identify all packages in the dependency tree that run build scripts — run `pnpm why esbuild` and inspect `node_modules/.pnpm` for any packages with `postinstall` scripts that are not `@tailwindcss/oxide`
- [x] 2.2 Determine if `esbuild` needs to be added to `onlyBuiltDependencies` (Vite uses esbuild internally for CSS minification; if its `install.js` script is skipped the binary may be missing)
- [x] 2.3 Document the final `onlyBuiltDependencies` list before making any changes

## 3. Update Configuration Files

- [x] 3.1 Update `package.json`: set `packageManager` to `pnpm@10.33.0`
- [x] 3.2 Update `package.json`: set `volta.pnpm` to `10.33.0`
- [x] 3.3 Update `package.json`: remove `ignoredBuiltDependencies` array entirely (redundant under pnpm 10 semantics)
- [x] 3.4 Update `package.json`: adjust `onlyBuiltDependencies` based on audit in task 2.2 (add `esbuild` if needed)
- [x] 3.5 Update `Dockerfile`: change `corepack prepare pnpm@9.15.4 --activate` to `pnpm@10.33.0`

## 4. Reinstall Dependencies

- [x] 4.1 Delete `node_modules` — `rm -rf node_modules`
- [x] 4.2 Run `pnpm install` with pnpm 10 (Volta will activate `10.33.0` automatically from the `volta.pnpm` field)
- [x] 4.3 Verify install completes without errors and without "lifecycle scripts were not run" warnings for critical packages

## 5. Verification

- [x] 5.1 Run `pnpm lint` — must pass with zero errors (verifies ESLint plugins resolve correctly after hoisting change)
- [x] 5.2 Run `pnpm type-check` — must pass with zero errors
- [x] 5.3 Run `pnpm test` — all 132 unit tests must pass
- [x] 5.4 Run `pnpm build` — must succeed and produce `dist/` with all vendor chunks present and no chunk exceeding 600KB
- [x] 5.5 Run `pnpm test:e2e` — must match pre-upgrade baseline (120 passed, 24 skipped Mobile Safari)

## 6. Commit and PR

- [x] 6.1 Commit with message `feat: upgrade pnpm 9 to 10.33.0 and update lifecycle script config`
- [x] 6.2 Push branch and open PR from `feat/upgrade-pnpm-10` to `main`
- [x] 6.3 Confirm CI pipeline (quality + e2e jobs) passes — pay attention to the pnpm setup step in the workflow
