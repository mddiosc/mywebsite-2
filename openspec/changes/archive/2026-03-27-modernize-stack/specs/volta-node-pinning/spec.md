## ADDED Requirements

### Requirement: Node.js version is pinned via Volta in package.json

The project SHALL declare a `volta` section in `package.json` that pins the Node.js version to the LTS release used in CI and Docker builds. This ensures all contributors using Volta automatically switch to the correct Node.js version when entering the project directory.

#### Scenario: Developer with Volta enters project directory

- **WHEN** a developer with Volta installed opens a terminal in the project root
- **THEN** Volta automatically activates the pinned Node.js version declared in `package.json`

#### Scenario: package.json declares the volta section

- **WHEN** the `package.json` file is read
- **THEN** it SHALL contain a `volta` key with a `node` property set to the pinned LTS version (e.g., `"22.13.0"`)

### Requirement: pnpm version is pinned consistently across all three locations

The project SHALL maintain the same pnpm version across `packageManager` field, `volta.pnpm` section in `package.json`, and the `corepack prepare` command in the Dockerfile. All three MUST reference the identical version string at all times.

#### Scenario: All version references match

- **WHEN** the `package.json` and `Dockerfile` are read
- **THEN** the pnpm version in `packageManager` field, `volta.pnpm`, and `corepack prepare pnpm@X` in Dockerfile SHALL be identical

#### Scenario: Volta activates correct pnpm version

- **WHEN** a developer with Volta runs `pnpm` in the project directory
- **THEN** Volta SHALL activate the pnpm version declared in `volta.pnpm`

### Requirement: Docker build uses the same pnpm version as local development

The Dockerfile SHALL install pnpm via corepack using the exact same version string declared in the `packageManager` field of `package.json`.

#### Scenario: Docker builder stage installs correct pnpm

- **WHEN** the Docker image is built
- **THEN** the builder stage SHALL execute `corepack prepare pnpm@<version> --activate` where `<version>` matches `package.json#packageManager`

#### Scenario: Docker build succeeds with frozen lockfile

- **WHEN** `docker build` is executed
- **THEN** `pnpm install --frozen-lockfile` SHALL succeed without version mismatch errors
