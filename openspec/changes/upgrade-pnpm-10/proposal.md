## Why

The project currently uses pnpm 9.15.4, pinned via Volta and the `packageManager` field. pnpm 10 is now the stable latest (`10.33.0`) and has been available since January 2025. Staying on pnpm 9 means missing security improvements (SHA256 hashing throughout), performance gains (faster repeat installs, more efficient store), and new features like `verify-deps-before-run`. pnpm 9 will eventually stop receiving updates.

The upgrade requires explicit attention because pnpm 10 introduces breaking changes that affect this project: lifecycle scripts are blocked by default (requiring explicit `onlyBuiltDependencies` configuration), the lockfile format changes (SHA256-based store v10), and the public hoisting behavior changes (ESLint/Prettier plugins no longer auto-hoisted).

## What Changes

- **pnpm 9.15.4 → 10.33.0**: Upgrade the package manager version across all three sync points: `packageManager` field, `volta.pnpm` section in `package.json`, and `corepack prepare` in Dockerfile.
- **`onlyBuiltDependencies` audit**: Verify that all packages requiring lifecycle scripts are explicitly listed. With pnpm 10, any package not listed will have its postinstall/preinstall scripts silently skipped.
- **`ignoredBuiltDependencies` cleanup**: The `esbuild` entry in `ignoredBuiltDependencies` may no longer be needed since pnpm 10 blocks all lifecycle scripts by default — evaluate and clean up.
- **Lockfile regeneration**: `pnpm-lock.yaml` will be fully regenerated in the new SHA256-based v10 format after `pnpm install`.
- **Hoisting verification**: Confirm that ESLint and Prettier plugins resolve correctly after `public-hoist-pattern` no longer auto-hoists packages with `eslint` or `prettier` in their name.

## Capabilities

### New Capabilities

_(No new user-facing capabilities. This is a package manager upgrade.)_

### Modified Capabilities

- `volta-node-pinning`: The pnpm version pinned via Volta changes from `9.15.4` to `10.33.0`. All three sync points (package.json `packageManager`, `volta.pnpm`, Dockerfile) must be updated together per the existing spec requirement.

## Impact

- **`package.json`**: `packageManager` field and `volta.pnpm` updated to `10.33.0`. `onlyBuiltDependencies` and `ignoredBuiltDependencies` arrays may change.
- **`Dockerfile`**: `corepack prepare pnpm@9.15.4` → `pnpm@10.33.0`.
- **`pnpm-lock.yaml`**: Fully regenerated in lockfile v10 format (SHA256 hashes, store v10). Large diff, but functionally equivalent.
- **`node_modules`**: Must be deleted and reinstalled to pick up the new store format.
- **CI pipeline**: Uses `pnpm` setup via `packageManager` field — should pick up v10 automatically. Needs verification.
- **No application code changes**: All routes, components, styles, and functionality remain identical.
