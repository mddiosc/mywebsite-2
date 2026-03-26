## Why

The Projects page currently fetches repository data directly from the browser and then fans out into additional GitHub language requests per repository. This makes the page dependent on client-side network conditions and GitHub API limits, and it exposes a reliability problem in a part of the site that should feel stable and fast.

## What Changes

- Introduce a build-time or server-side snapshot flow for project portfolio data so the frontend reads from a stable internal source instead of calling GitHub directly at runtime.
- Define the contract for the snapshot payload, including repository metadata and aggregated language data needed by the existing Projects experience.
- Preserve the current Projects UI behavior, sorting, statistics, and localized routes while changing the data source behind it.
- Add failure-handling expectations so the Projects page can render predictably even when upstream GitHub data cannot be refreshed during snapshot generation.
- Keep scope limited to the Projects data pipeline and consumption path; this change does not redesign the Projects page UI or add new editorial project content.

## Capabilities

### New Capabilities

- `project-data-snapshot`: Generate and consume a stable portfolio-project snapshot so the Projects page no longer depends on direct browser-to-GitHub requests.

### Modified Capabilities

- None.

## Impact

- Affected frontend code in the Projects feature, especially data fetching and query logic.
- New snapshot generation logic or deployment-time data preparation will be required.
- GitHub API usage moves away from client runtime and into a controlled refresh step.
- Deployment, testing, and failure handling need validation because stale or missing snapshot data becomes a product concern.
