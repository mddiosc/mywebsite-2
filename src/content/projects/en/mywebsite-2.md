---
slug: mywebsite-2
title: 'mywebsite-2: Bilingual Portfolio Platform with React, OpenSpec, and Continuous Quality'
summary: 'Complete case study of my production portfolio: modern frontend architecture, i18n, technical SEO, quality automation, and a spec-driven OpenSpec workflow.'
published: '2026-03-27'
featured: true
role: 'Frontend Engineer / Product Owner'
status: 'In production and continuously evolving'
outcomes:
  - 'Stable modern architecture with React 19 + Vite 8 + TypeScript 5.9'
  - 'Robust i18n SEO with deterministic per-route canonical/hreflang'
  - 'Quality pipeline with lint, type-check, tests, budget, and Lighthouse CI'
  - 'End-to-end OpenSpec workflow for traceable, maintainable changes'
repoName: 'mywebsite-2'
relatedPosts:
  - 'sdd-openspec-spec-driven-development'
---

## Context

`mywebsite-2` is my production technical portfolio. It started with a specific goal: build a personal site that is not only a visual showcase, but also a **living platform** to test architecture, DX, quality, and real delivery workflows.

I did not design it as a static landing page. I treated it as a product that evolves through iterations, with technical decisions justified and validated in CI.

## Problem to Solve

I wanted to avoid three common portfolio anti-patterns:

- Good-looking sites that are hard to maintain.
- Inconsistent SEO/i18n behavior as content grows.
- Fast changes without traceability (and silent regressions).

## Solution

Build a modern, bilingual, automated frontend foundation, using a spec-driven change workflow.

### Technical Architecture

- **Frontend**: React 19 + TypeScript 5.9
- **Build**: Vite 8 with improved chunking and performance
- **Styling/UI**: Tailwind CSS + reusable components
- **Routing**: localized routes (`/es/...`, `/en/...`)
- **Data layer**: React Query for server-state and caching in targeted features

### Core system layers

1. **Decoupled Markdown content** for blog and case studies.
2. **Real i18n support** (es/en) across UI and routes.
3. **Per-page SEO metadata** with canonical/alternate control.
4. **Quality guardrails** from local checks to CI.

## Relevant Changes Implemented

During the latest modernization cycle:

- Stack upgrades (React/Vite/TypeScript/tooling) with risk control.
- CI runtime adjustments for modern JavaScript action execution.
- Performance budget checks in CI to prevent bundle regressions.
- Lighthouse CI integration for PR-level UX/perf signal.
- i18n SEO hardening: consistent canonical/hreflang for static and detail routes.

## SEO + i18n: practical learning

One key move was centralizing metadata URL logic in a shared helper to avoid page-by-page drift.

That guarantees:

- Correct locale-specific canonical URLs.
- `hreflang` links for `es`, `en`, and `x-default`.
- Slug preservation on detail routes.
- Non-indexable 404 without canonical/alternates.

## Continuous Quality

Validation pipeline is part of the product, not an afterthought:

- `lint`
- `type-check`
- `test`
- `build`
- performance budget
- Lighthouse CI

The goal is not just "green checks", but early detection of requirement-to-implementation drift.

## OpenSpec Workflow in Production

`mywebsite-2` became a real environment for full spec-driven delivery:

1. change proposal,
2. technical design,
3. requirement scenarios,
4. executable tasks,
5. implementation,
6. merge,
7. archive.

This improved traceability and made context recovery far easier after interruptions.

## Outcomes

- Better maintainability as content and features grow.
- Fewer SEO/metadata and performance regressions.
- Stronger PR delivery discipline via explicit checklists.
- Clearer iteration path for future improvements without destabilizing the base.

## Key Lessons

1. A portfolio can (and should) be treated like a real product.
2. i18n + SEO need architecture, not page-level patches.
3. Useful quality gates speed teams up.
4. SDD/OpenSpec reduces context loss and late surprises.

## Current State and Next Iterations

The project is live and continuously evolving. Next iterations focus on:

- ongoing performance optimization,
- accessibility improvements,
- more technical content linked to real implementation work,
- and workflow refinement for complex multi-step changes.

In practice, `mywebsite-2` is my frontend engineering lab on top of a real product.
