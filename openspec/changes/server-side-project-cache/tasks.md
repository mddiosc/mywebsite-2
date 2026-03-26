## 1. Implementation Setup

- [x] 1.1 Create a dedicated git branch for this change using the project convention `codex/server-side-project-cache`
- [x] 1.2 Define the snapshot file location, TypeScript types, and generation entry point for project portfolio data

## 2. Snapshot Generation

- [x] 2.1 Implement a data-generation script that fetches repositories and language metadata from GitHub and outputs a normalized snapshot
- [x] 2.2 Add filtering and normalization rules so the snapshot preserves the portfolio-specific project selection and fields required by the UI
- [x] 2.3 Add error handling and validation so failed GitHub refreshes produce a controlled outcome

## 3. Frontend Migration

- [x] 3.1 Update the Projects data-fetching path to read from the internal snapshot instead of calling GitHub directly from the browser
- [x] 3.2 Preserve current project ordering, statistics, topics, loading states, and empty/error behavior after the data-source migration
- [x] 3.3 Remove or isolate obsolete client-side GitHub request logic that is no longer part of the runtime path

## 4. Build and Verification

- [x] 4.1 Integrate snapshot generation into the local and production build flow
- [x] 4.2 Add or update tests that validate snapshot shape and Projects behavior against the new data source
- [x] 4.3 Run targeted verification for Projects page rendering, localized routes, and deployment-sensitive behavior
