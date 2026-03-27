## Why

The project runs on Vite 7, TypeScript 5.8, and several dev tooling packages at older major versions. Vite 8 has shipped with Rolldown as its unified Rust-based bundler, delivering 10-30x faster builds. TypeScript 5.9 is stable with incremental improvements. Multiple dev dependencies have new majors available with bug fixes and performance gains. Additionally, the project lacks Volta pinning for Node.js and pnpm, causing potential version drift between local development and Docker builds.

Upgrading now captures concrete build speed improvements, aligns tooling versions, and prevents falling further behind while the ecosystem is still compatible.

## What Changes

- **Vite 7 -> 8**: Migrate to Rolldown-based bundler. **BREAKING**: `build.rollupOptions.output.manualChunks` (object form) is removed. Must migrate to `build.rolldownOptions.output.codeSplitting` with regex-based groups.
- **@vitejs/plugin-react-swc 3.x -> 4.x**: Update to version with Vite 8 peer dependency support.
- **TypeScript ~5.8.3 -> ~5.9.3**: Minor version bump with new language features and fixes.
- **Vitest, @vitest/coverage-v8**: Resolve to latest 4.x patches via pnpm update.
- **Tailwind CSS and @tailwindcss/vite**: Resolve to latest 4.x patches.
- **globals 15.x -> 16.x**: One major version bump for ESLint globals definitions.
- **lint-staged 15.x -> 16.x**: Major version bump for pre-commit hook tooling.
- **prettier-plugin-tailwindcss 0.6.x -> 0.7.x**: Minor (pre-1.0) version bump.
- **@vitest/eslint-plugin, @commitlint/\*, @floating-ui/react**: Resolve to latest compatible patches.
- **Volta pinning**: Add `volta` section to `package.json` for Node 22 LTS and pnpm 9.15.4.
- **Dockerfile sync**: Align pnpm version in Dockerfile with `packageManager` field.

## Capabilities

### New Capabilities

- `volta-node-pinning`: Enforce consistent Node.js and pnpm versions across local development (via Volta) and Docker builds, preventing version drift.

### Modified Capabilities

_(No existing spec-level requirements change. This is a tooling/infrastructure update that preserves all user-facing behavior.)_

## Impact

- **Build configuration**: `vite.config.ts` requires migration from `rollupOptions.manualChunks` to `rolldownOptions.codeSplitting`.
- **Bundle output**: Chunk names and sizes may change with Rolldown's bundling strategy. Requires comparative analysis.
- **package.json**: Version bumps across 10+ dependencies, new `volta` section, updated `packageManager` field.
- **Dockerfile**: pnpm version in `corepack prepare` command must match `packageManager` field.
- **ESLint config**: `globals` import may need adjustment if v16 changes its API surface.
- **Pre-commit hooks**: `lint-staged` v16 may change configuration behavior.
- **CI pipeline**: No structural changes expected; same Node 22 + pnpm setup.
- **No user-facing changes**: All routes, content, styling, and functionality remain identical.
