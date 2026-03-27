## Context

The project uses Vite 7 with Rollup/esbuild under the hood, configured with `build.rollupOptions.output.manualChunks` to split vendor dependencies into 7 separate chunks. Vite 8 replaces both Rollup and esbuild with Rolldown (Rust-based), which removes support for the object form of `manualChunks` and introduces a new `codeSplitting` API with regex-based group matching, priorities, and size constraints.

The project also has no Node.js or pnpm version pinning mechanism, despite using Volta. The Dockerfile hard-codes `pnpm@9.15.3` via corepack, which has drifted from the `packageManager` field in `package.json` (`pnpm@9.15.3`) — these need to stay in sync automatically.

The upgrade affects three layers:

1. **Build tooling** (`vite`, `@vitejs/plugin-react-swc`, `vite.config.ts`)
2. **Dev tooling** (TypeScript, vitest, tailwindcss, globals, lint-staged, prettier-plugin-tailwindcss)
3. **Environment pinning** (`package.json` volta section, Dockerfile)

## Goals / Non-Goals

**Goals:**

- Upgrade Vite to 8.x and migrate the build config to Rolldown's `codeSplitting` API
- Upgrade `@vitejs/plugin-react-swc` to 4.x for Vite 8 peer compatibility
- Upgrade TypeScript to ~5.9.3 (safe minor bump)
- Resolve all patch/minor updates within existing `^` ranges for vitest, tailwindcss, commitlint, floating-ui, etc.
- Upgrade globals to 16.x, lint-staged to 16.x, prettier-plugin-tailwindcss to 0.7.x (guarded major bumps)
- Add Volta pinning (`node`, `pnpm`) to `package.json`
- Synchronize the pnpm version between `packageManager` field, `volta` section, and Dockerfile

**Non-Goals:**

- TypeScript 6.x (blocked by `typescript-eslint <6.0.0` peer constraint)
- ESLint 10.x (too recent, ecosystem not fully ready)
- pnpm 10.x (separate evaluation needed due to lockfile format changes)
- Any changes to application code, routing, UI, or content
- Changes to nginx config, CI pipeline structure, or Vercel headers

## Decisions

### Decision 1: Migrate `manualChunks` to `rolldownOptions.codeSplitting`

**Chosen**: Replace `build.rollupOptions.output.manualChunks` (object form) with `build.rolldownOptions.output.codeSplitting.groups` using regex matchers and priorities.

**Rationale**: The object form is removed in Vite 8 (Rolldown does not support it). The new `codeSplitting` API is more expressive — it supports regex patterns, priority ordering, `minShareCount`, and `minSize`. Since the user is open to simplifying, we use a smaller set of high-priority groups (react, animations, ui, query/forms/i18n, markdown) and let Rolldown handle the rest automatically. This avoids over-specifying chunk boundaries that Rolldown can optimize better than static names.

**Alternative considered**: Keep the full 7-chunk split using function form of `manualChunks` (still available but deprecated). Rejected because it would need updating again at the next Vite major, and Rolldown's auto-splitting is expected to be superior.

**Resulting config**:

```ts
build: {
  rolldownOptions: {
    output: {
      codeSplitting: {
        groups: [
          { name: 'react-vendor',     test: /node_modules[\\/](react|react-dom)/, priority: 30 },
          { name: 'animation-vendor', test: /node_modules[\\/]framer-motion/,     priority: 20 },
          { name: 'ui-vendor',        test: /node_modules[\\/](@headlessui|@heroicons|@floating-ui)/, priority: 15 },
          { name: 'data-vendor',      test: /node_modules[\\/](@tanstack|react-hook-form|@hookform|zod|axios)/, priority: 10 },
          { name: 'i18n-vendor',      test: /node_modules[\\/](react-i18next|i18next)/, priority: 10 },
          { name: 'markdown-vendor',  test: /node_modules[\\/](react-markdown|rehype|remark|highlight)/, priority: 5 },
        ],
      },
    },
  },
  chunkSizeWarningLimit: 600,
}
```

### Decision 2: Pin Node 22 LTS (not Node 24) in Volta

**Chosen**: Pin `node@22.x` (LTS) via Volta, not Node 24 (current).

**Rationale**: Vite 8 requires Node 20.19+ or 22.12+. Node 22 is the current LTS line and is what the Dockerfile uses (`node:22-alpine`). Node 24 is the current release but not yet LTS. Pinning to LTS ensures stability across environments, matches CI (which also uses Node 22), and aligns with the Docker image.

**Specific version**: `22.13.0` (the version already installed in the local Volta toolchain, visible in `volta list node`).

### Decision 3: Keep `packageManager` field in sync as the single source of truth

**Chosen**: The `packageManager` field in `package.json` is the canonical pnpm version. The `volta.pnpm` section and the Dockerfile `corepack prepare pnpm@X` command MUST always match it.

**Rationale**: Having three places with the same version is a maintenance risk. In the future, updating `packageManager` should be the only edit needed — but until tooling enforces this, the three locations are updated together in a single task.

### Decision 4: Upgrade globals to 16.x (not 17.x)

**Chosen**: Jump one major (15 -> 16), not two (15 -> 17).

**Rationale**: The `globals` package provides browser/node/es global definitions for ESLint. The API surface (`globals.browser`, `globals.node`) is stable across majors but the jump from 15 to 17 skips two majors. Stopping at 16.x reduces surface area for unexpected breakage in `eslint.config.js`. Version 17.x can be taken in the next maintenance pass once 16.x is confirmed stable.

### Decision 5: Upgrade lint-staged to 16.x

**Chosen**: Upgrade from 15.x to 16.x.

**Rationale**: lint-staged 16 drops Node 18 support (requires Node 20+) but is otherwise compatible with the existing `.lintstagedrc` / inline config format. Since the project runs on Node 22, this is safe. The configuration in `package.json` uses the same object format supported in v16.

### Decision 6: Three-phase upgrade sequence

**Chosen**: Execute in three phases — safe minor updates first, then Vite 8 breaking change, then remaining major dev-tooling bumps.

**Rationale**: Isolating the Vite 8 / Rolldown migration in its own phase makes it easier to bisect if the build breaks. Phase 1 establishes a clean baseline (all tests passing, no regressions). Phase 2 is the riskiest change (build config rewrite). Phase 3 is low-risk tooling bumps that don't affect runtime behavior.

## Risks / Trade-offs

**[Risk] `vite-plugin-sitemap` has no declared peerDependencies and may break with Vite 8**
→ Mitigation: Build and verify sitemap output (`dist/sitemap.xml`) exists and contains expected routes after Vite 8 upgrade. The plugin's internal API usage is minimal (it hooks into `closeBundle`), making it likely compatible.

**[Risk] Rolldown's `codeSplitting` may generate different chunk sizes than the current `manualChunks` setup**
→ Mitigation: Run `pnpm build` and compare `dist/assets/` output before and after. Verify no single chunk exceeds the 600KB warning threshold. Rolldown is expected to produce equal or smaller chunks.

**[Risk] `globals` v16 may rename or restructure exported keys**
→ Mitigation: The `eslint.config.js` uses only `globals.browser`. Run `pnpm lint` after the upgrade and check for any "globals is not defined" or similar errors. The API has been stable; this is low probability.

**[Risk] `prettier-plugin-tailwindcss` 0.7.x may change class sorting behavior**
→ Mitigation: Run `pnpm format:check` after upgrade. If classes are re-sorted, run `pnpm format` and commit the formatting changes separately. This is cosmetic, not functional.

**[Trade-off] Simplified chunking may increase initial load for some scenarios**
→ With fewer explicit vendor chunks, some modules may end up co-located. Rolldown's auto-splitting is smarter than Rollup's but the exact output is only verifiable post-build. Accepted trade-off given the user's preference to simplify.

## Migration Plan

1. Create branch `feat/modernize-stack`
2. **Phase 1**: Update TypeScript to ~5.9.3, run `pnpm update` for safe ranges, add Volta section, sync Dockerfile. Verify: `pnpm type-check && pnpm lint && pnpm test && pnpm build`.
3. **Phase 2**: Update `vite` to `^8.0.3`, `@vitejs/plugin-react-swc` to `^4.3.0`, migrate `vite.config.ts`. Verify: `pnpm build`, inspect `dist/assets/`, run `pnpm test`, run `pnpm test:e2e`.
4. **Phase 3**: Update `globals` to `^16.0.0`, `lint-staged` to `^16.4.0`, `prettier-plugin-tailwindcss` to `^0.7.2`. Verify: `pnpm lint && pnpm format:check && git commit` (triggers husky hooks).
5. Open PR, run full CI pipeline (quality + e2e jobs).

**Rollback**: Each phase is a separate commit on the branch. Rolling back to the previous phase requires reverting the relevant commit(s) and running `pnpm install --frozen-lockfile`.

## Open Questions

- None blocking. `vite-plugin-sitemap` Vite 8 compatibility is the main unknown and will be resolved empirically during Phase 2 validation.
