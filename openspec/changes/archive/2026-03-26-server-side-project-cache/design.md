## Context

The current Projects page fetches repositories from the GitHub API directly in the browser and then performs additional requests to collect per-repository language data. This makes the user experience sensitive to network latency, GitHub rate limits, and browser-side failures. It also couples the visible page state to a third-party API at request time, even though the underlying data changes relatively slowly.

The repository is currently deployed as a mostly static frontend served by Nginx and Docker. That deployment model favors build-time data preparation over a long-lived backend service. The change therefore needs to improve reliability and performance while preserving the existing UI contract, route structure, SEO behavior, and localized navigation.

## Goals / Non-Goals

**Goals:**

- Replace direct browser-to-GitHub fetching for the Projects page with a stable internal snapshot.
- Preserve the current Projects page presentation, sorting, statistics, and route behavior.
- Keep the architecture compatible with a static build and simple deployment model.
- Define predictable behavior when snapshot refresh fails or produces incomplete data.
- Make the resulting data flow straightforward to test.

**Non-Goals:**

- Redesign the Projects page UI or content model.
- Introduce a persistent backend service, database, or authenticated admin workflow.
- Change blog, contact, or other site areas.
- Solve every future portfolio-content need; this change is specifically about the Projects data source.

## Decisions

### Use a build-time snapshot file as the primary data source

The system will generate a JSON snapshot during the build or a dedicated prebuild step. That snapshot will contain the repository fields and language aggregates already needed by the current Projects UI. The frontend will load this internal asset instead of querying GitHub directly at runtime.

Why this option:

- It matches the current static SPA deployment model.
- It removes runtime dependence on GitHub for end users.
- It avoids introducing a serverless or long-lived backend path before it is justified.

Alternatives considered:

- Edge/serverless proxy to GitHub: more flexible, but adds infrastructure and operational surface area the project does not currently need.
- Keeping client-side fetching with stronger caching: still exposes visitors to runtime GitHub failures and does not sufficiently improve reliability.

### Generate the snapshot from GitHub in one controlled fetch pipeline

A dedicated script will fetch repositories, enrich them with language data, filter any excluded repositories, and output a normalized snapshot used by the frontend. This moves the existing fan-out logic into a controlled generation step where retries, logging, and validation are easier to reason about.

Why this option:

- Consolidates GitHub access in one place.
- Keeps the frontend hook simple.
- Makes it easier to validate the payload shape before shipping.

Alternatives considered:

- Multiple partial files or lazy per-project assets: lower initial payload, but unnecessary complexity for the current portfolio scale.

### Treat the snapshot contract as a stable frontend-facing model

The generated snapshot will preserve the fields required by the current Projects components and statistics logic. The frontend should not need to know whether data came from GitHub live or a snapshot refresh job.

Why this option:

- Minimizes UI churn.
- Allows migration with low behavioral risk.
- Keeps future refactors optional instead of mandatory for this change.

Alternatives considered:

- Rewriting the Projects page around a new domain model now: possible, but expands scope and couples architectural cleanup with the reliability fix.

### Fail closed during generation, fail gracefully in the UI

If GitHub fetches fail during snapshot generation, the generation step should surface a clear failure or fall back to the last known valid snapshot, depending on the implementation path chosen. The user-facing Projects page should continue to render predictably from a valid snapshot and should not silently fall back to browser-side GitHub calls.

Why this option:

- Keeps runtime behavior deterministic.
- Prevents reintroducing the original reliability problem through a hidden fallback path.

Alternatives considered:

- Fallback to live GitHub requests in production: undermines the purpose of the change and creates two inconsistent data paths.

## Risks / Trade-offs

- [Snapshot staleness] -> Define an explicit refresh moment in the build/deploy flow and document that project data is eventually consistent rather than real time.
- [Build sensitivity to GitHub availability] -> Add validation and a controlled fallback strategy, such as preserving the last known valid snapshot when refresh fails.
- [Payload drift between generator and frontend] -> Use a typed snapshot model and tests that validate the generated shape against frontend expectations.
- [Operational ambiguity] -> Document whether local development uses a committed snapshot, a generated snapshot, or both.

## Migration Plan

1. Introduce snapshot generation and payload typing without changing the Projects UI contract.
2. Switch the Projects data hook to read from the generated internal source.
3. Validate that statistics, sorting, and empty/error states still behave as expected.
4. Integrate the snapshot generation step into build and deployment.
5. Remove direct runtime GitHub dependency from the Projects frontend path once the snapshot flow is verified.

Rollback strategy:

- Revert the Projects hook to the current client-side GitHub flow if snapshot generation proves unstable during rollout.
- Keep the change isolated so the rollback only affects the Projects data path.

## Open Questions

- Should the snapshot file be committed to the repository or generated only in CI/build environments?
- Should failed snapshot refreshes fail the build, or should they reuse the last known valid artifact?
- Does the project want a manual refresh command for local development and content verification?
