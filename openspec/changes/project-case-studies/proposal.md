# Proposal: project-case-studies

## Summary

Add bilingual project case studies on top of the existing snapshot-backed Projects experience so selected repositories can present richer editorial detail, not just GitHub metadata.

## Problem

The current Projects page is strong as a repository showcase, but it mostly answers what exists, not why it matters. Visitors can see technologies, topics, and repository links, but they cannot quickly understand the context, decisions, tradeoffs, outcomes, or relationship between a project and the rest of the site.

This limits the portfolio's ability to:

- communicate depth on a few high-value projects
- connect project work with blog content and professional positioning
- differentiate flagship work from the rest of the GitHub portfolio

## Proposed Change

Introduce a local, bilingual case-study content layer for selected projects while keeping the existing build-time snapshot as the base data source.

The change will:

- define a structured content model for project case studies
- support localized case-study content for Spanish and English
- add detail routes under the existing localized Projects section
- merge curated case-study metadata with the GitHub snapshot where identifiers match
- preserve the current Projects listing for repositories without a case study

## User Value

- visitors can understand the story and impact behind selected projects
- flagship work gains stronger SEO and better internal linking opportunities
- the portfolio becomes more persuasive for hiring, consulting, and technical credibility

## Scope

In scope:

- content model and storage for localized project case studies
- route and page for case-study detail views
- case-study CTA or entry point from the Projects listing
- data merge between snapshot projects and local editorial content
- support for related links such as repo, demo, and selected blog posts

Out of scope:

- CMS or remote authoring workflow
- full redesign of the Projects section
- analytics or recommendation engine work
- automated screenshot generation or media pipeline

## Affected Areas

- `src/pages/Projects`
- `src/router/routes.tsx`
- `src/types.ts`
- localized content under `src/content`
- tests covering Projects list and project detail behavior
