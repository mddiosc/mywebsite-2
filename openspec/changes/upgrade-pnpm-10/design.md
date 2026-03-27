## Context

The project pins pnpm via three synchronized locations: `packageManager` field, `volta.pnpm` section (enforced by the `volta-node-pinning` spec), and the Dockerfile `corepack prepare` command. All three were set to `9.15.4` in the `modernize-stack` change.

pnpm 10 introduces two breaking changes that directly affect this repo's configuration:

1. **Lifecycle scripts blocked by default** (`onlyBuiltDependencies` required). The current `package.json` already has an `onlyBuiltDependencies` array (`["@tailwindcss/oxide"]`) and an `ignoredBuiltDependencies` array (`["esbuild"]`). With pnpm 10 the semantics flip: _everything_ is blocked unless listed in `onlyBuiltDependencies`, so `ignoredBuiltDependencies` becomes redundant.

2. **Public hoisting changed** — packages with `eslint` or `prettier` in their name are no longer auto-hoisted. This project uses ESLint flat config (`eslint.config.js`) which imports plugins directly as ES modules; it does not rely on hoisting. However this needs empirical verification after install.

3. **Lockfile format v10** — SHA256 throughout, new store structure. The regenerated lockfile will have a large diff but is functionally equivalent.

Current `pnpm` section in `package.json`:

```json
"pnpm": {
  "ignoredBuiltDependencies": ["esbuild"],
  "onlyBuiltDependencies": ["@tailwindcss/oxide"],
  "overrides": { "mdast-util-to-hast": ">=13.2.1" }
}
```

## Goals / Non-Goals

**Goals:**

- Upgrade pnpm from 9.15.4 to 10.33.0 across all three sync points
- Audit and correct `onlyBuiltDependencies` so all required build scripts run
- Remove `ignoredBuiltDependencies` entries that are now redundant under pnpm 10 semantics
- Regenerate `pnpm-lock.yaml` in the new v10 format
- Verify ESLint, tests, and build all pass after upgrade

**Non-Goals:**

- Changes to application code, routing, UI, or content
- Upgrading Node.js version (stays on 22.13.0)
- Changing any other dependency versions

## Decisions

### Decision 1: Remove `ignoredBuiltDependencies` entirely

**Chosen**: Remove the `ignoredBuiltDependencies` array from the `pnpm` section.

**Rationale**: Under pnpm 9, `ignoredBuiltDependencies` listed packages whose scripts should be _skipped_ (opt-out model — everything runs by default). Under pnpm 10, the model inverts: everything is blocked by default and `onlyBuiltDependencies` is the opt-in list. `ignoredBuiltDependencies` is now only useful if you want to skip specific packages that are otherwise allowed by a broad `onlyBuiltDependencies` pattern — which is not the case here. The `esbuild` entry was added to suppress SWC-related build script noise that no longer applies since `@vitejs/plugin-react-swc` was replaced.

**Alternative considered**: Keep `ignoredBuiltDependencies: ["esbuild"]` as a no-op. Rejected because it adds confusion — under pnpm 10 semantics it implies esbuild would otherwise be allowed, which isn't true unless it's in `onlyBuiltDependencies`.

### Decision 2: Audit `onlyBuiltDependencies` before upgrading

**Chosen**: Before changing the pnpm version, identify all packages that actually need to run build scripts, and ensure they are listed in `onlyBuiltDependencies`.

**Rationale**: If a required build script is silently skipped, the failure mode is subtle — packages install without error but may be non-functional (e.g., native bindings missing). The current list only has `@tailwindcss/oxide`. We need to verify if any other packages in the tree require postinstall scripts (common candidates: packages with native bindings like `@swc/core`, `fsevents`, `sharp`, `better-sqlite3`). Since `@vitejs/plugin-react-swc` was removed, `@swc/core` is gone. `esbuild` ships prebuilt binaries via an `install.js` script — under pnpm 10 this needs to be in `onlyBuiltDependencies`.

**Approach**: Run `pnpm install` with pnpm 10 and check for any missing binary or runtime error. Also cross-reference with `pnpm why <package>` for known binary packages.

### Decision 3: Delete `node_modules` before reinstalling

**Chosen**: `rm -rf node_modules` before `pnpm install` with v10.

**Rationale**: The store format changes in pnpm 10 (SHA256, new `index` directory structure). Installing over an existing pnpm 9 `node_modules` risks inconsistencies between old and new store references. A clean install avoids edge cases.

### Decision 4: Pin to `10.33.0` (current latest), not `^10`

**Chosen**: Pin the exact version `10.33.0` in all three sync points.

**Rationale**: Consistent with the existing Volta pinning convention established in `modernize-stack`. Exact version pinning prevents unexpected behavior changes across environments. When a newer pnpm 10.x patch is available, it should be a deliberate update following the same sync-all-three-locations pattern.

## Risks / Trade-offs

**[Risk] A dependency requires a build script not listed in `onlyBuiltDependencies`**
→ Mitigation: After `pnpm install`, run `pnpm build`, `pnpm test`, and `pnpm lint` to catch any missing native binary. If `esbuild` (used by Vite internally for CSS minification fallback) fails, add it to `onlyBuiltDependencies`.

**[Risk] ESLint plugins fail to resolve after hoisting change**
→ Mitigation: Run `pnpm lint` immediately after install. ESLint flat config imports plugins as direct ES module imports (`import reactHooks from 'eslint-plugin-react-hooks'`), so they resolve from `node_modules` directly — no hoisting dependency. Low probability but verified empirically.

**[Risk] CI pipeline `pnpm` setup fails with the new version**
→ Mitigation: The CI uses the `packageManager` field for pnpm version detection (via `pnpm/action-setup`). Updating `packageManager` to `pnpm@10.33.0` is sufficient. Verify CI passes after pushing the PR.

**[Trade-off] Large lockfile diff**
→ The `pnpm-lock.yaml` will change significantly (all hashes from MD5/SHA1 to SHA256, format version bump). This is expected and unavoidable. Code review should focus on the `package.json` changes, not the lockfile diff.

## Migration Plan

1. Create branch `feat/upgrade-pnpm-10`
2. Audit `onlyBuiltDependencies` — identify all packages needing build scripts
3. Update `package.json`: `packageManager`, `volta.pnpm`, remove `ignoredBuiltDependencies`, update `onlyBuiltDependencies` if needed
4. Update `Dockerfile`: `corepack prepare pnpm@10.33.0`
5. Delete `node_modules` and run `pnpm install` with pnpm 10 (via Volta)
6. Verify: `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`
7. Commit and open PR

**Rollback**: Revert `packageManager`, `volta.pnpm`, and Dockerfile to `9.15.4`, delete `node_modules`, run `pnpm install`. The old `pnpm-lock.yaml` is recoverable via git.

## Open Questions

- Whether `esbuild` needs to be added to `onlyBuiltDependencies` — resolved empirically during implementation (task 3.2).
