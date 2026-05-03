## ADDED Requirements

### Requirement: ReactQueryDevtools excluded from production bundle

The system SHALL NOT include `@tanstack/react-query-devtools` in any production build artifact.

#### Scenario: Devtools absent in production build

- **WHEN** the application is built with `pnpm build` for preview or deployment
- **THEN** the resulting JavaScript bundles SHALL NOT contain the `ReactQueryDevtools` component or its dependencies
- **AND** `import.meta.env.DEV` evaluates to `false` in that build context

#### Scenario: Devtools present during development

- **WHEN** the application runs with `pnpm dev`
- **THEN** `ReactQueryDevtools` SHALL be rendered and accessible for query inspection

---

### Requirement: No artificial delay in blog data loading

The system SHALL NOT introduce any manual `setTimeout` delay when loading blog posts.

#### Scenario: Blog posts load at actual data speed

- **WHEN** the user navigates to the blog page
- **THEN** blog posts SHALL be displayed as soon as the underlying `import.meta.glob` resolution completes
- **AND** no artificial delay SHALL be inserted between data resolution and render

---

### Requirement: Production build passes performance budget checks

The system SHALL ensure that after applying all boot optimizations, all chunk budgets defined in `scripts/check-performance-budget.mjs` continue to pass.

#### Scenario: Performance budget script passes after changes

- **WHEN** `pnpm performance:budget` is executed after the changes
- **THEN** every chunk SHALL report a gzip size within its defined limit
- **AND** the script exit code SHALL be 0
