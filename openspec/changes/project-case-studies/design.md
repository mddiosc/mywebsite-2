# Design: project-case-studies

## Overview

The feature adds an editorial layer to selected projects without replacing the snapshot-based portfolio model. GitHub snapshot data remains the canonical base for repository metadata, while local markdown-backed content defines richer narrative information for projects that deserve a case study.

## Data Model

Add a new localized content source under a dedicated projects content directory, parallel to the current blog content approach. Each case study should map to a stable project slug and include frontmatter fields such as:

- `slug`
- `title`
- `summary`
- `published`
- `featured`
- `role`
- `status`
- `outcomes`
- `relatedPosts`
- `repoName` or another stable identifier that maps to snapshot data

The markdown body will hold the long-form editorial content.

At runtime, the app loads:

1. the snapshot-backed project collection
2. localized case-study content
3. a merged view model that enriches matching projects

Projects without a case study remain valid list items and continue to render from snapshot data alone.

## Routing

Add a localized detail route under:

- `/:lang/projects/:slug`

The existing `/:lang/projects` route remains the index/listing view.

This preserves the current language-prefixed routing convention and gives each case study a stable, SEO-friendly URL.

## UI Behavior

The list page should continue to function as the portfolio index, with minimal disruption to the current visual language. For projects with editorial content:

- show an explicit case-study CTA
- optionally mark featured projects more clearly

The detail page should prioritize:

- title and summary
- project context and narrative content
- technical metadata from the snapshot
- related links such as GitHub repo, demo, and related blog posts

## Content Strategy

This should stay intentionally lightweight and static-first:

- local markdown files
- bilingual content per locale
- no CMS
- no server dependency

That matches the repo's current deployment model and keeps the feature maintainable.

## SEO and Accessibility

- detail pages must set localized metadata through `DocumentHead`
- routes must remain discoverable and indexable
- CTA and navigation elements must use native interactive elements
- markdown rendering must preserve current content-safety expectations

## Compatibility and Migration

This feature builds on the existing snapshot work and should not require changes to snapshot generation beyond exposing identifiers needed for matching.

The migration path is incremental:

1. add support for the content model and merged data
2. create the detail route and view
3. add a small initial set of case studies
4. preserve fallback behavior for every other project

## Risks

- content can drift from GitHub metadata if matching is weak
- bilingual content doubles editorial effort
- detail pages can sprawl into a mini CMS if the model is not kept narrow

These risks are controlled by using a stable identifier, keeping the frontmatter small, and treating the first iteration as a curated layer for only a few flagship projects.
