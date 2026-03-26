## ADDED Requirements

### Requirement: Projects page uses an internal snapshot data source

The system SHALL render the Projects page from an internal project-data snapshot instead of making direct browser-side requests to the GitHub API at runtime.

#### Scenario: Projects page loads from internal data

- **WHEN** a visitor opens the localized Projects page
- **THEN** the frontend loads project portfolio data from an internal snapshot source managed by the application
- **AND** the page does not require direct browser-to-GitHub requests to render the project list

### Requirement: Snapshot includes project fields required by the current Projects experience

The system SHALL generate a normalized project-data snapshot containing the repository metadata and language information required to preserve the current Projects listing, statistics, and topic aggregation behavior.

#### Scenario: Snapshot supports existing project presentation

- **WHEN** the snapshot is generated successfully
- **THEN** it contains the fields needed to render project cards, calculate statistics, and derive technology and topic lists
- **AND** the frontend can preserve current sorting and filtering behavior without live GitHub enrichment calls

### Requirement: Snapshot generation handles upstream failures predictably

The system MUST define a controlled outcome when GitHub data cannot be fetched or enriched during snapshot generation.

#### Scenario: Upstream fetch fails during snapshot generation

- **WHEN** GitHub is unavailable, rate-limited, or returns an invalid response during snapshot generation
- **THEN** the generation flow produces a clear failure or uses a documented last-known-valid snapshot strategy
- **AND** the deployed Projects page does not silently fall back to direct browser-side GitHub fetching

### Requirement: Projects behavior remains stable after data-source migration

The system SHALL preserve the existing localized route structure and core Projects page behavior after moving to snapshot-backed data.

#### Scenario: Existing user-visible behavior is preserved

- **WHEN** the Projects page is served from the snapshot-based data source
- **THEN** users still access the page through the existing localized routes
- **AND** project ordering, statistics, and empty or error handling remain functionally consistent with the intended current experience
