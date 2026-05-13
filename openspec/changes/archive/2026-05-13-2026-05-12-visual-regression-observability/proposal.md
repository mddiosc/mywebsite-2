# visual-regression-observability Proposal

## Why

The app already has strong functional coverage, but the remaining risk is regression drift: layout changes can slip through even when behavior stays green, and client-side runtime issues can remain invisible without a lightweight observability surface. This proposal adds guardrails for visual stability and runtime signal without changing the product experience.

## What Changes

- Add explicit visual regression coverage for representative responsive pages and key shared UI surfaces.
- Add a lightweight client observability layer for runtime errors and performance signals such as Web Vitals.
- Keep the current Playwright and Vitest setup intact while extending it with targeted regression and telemetry checks.

## Capabilities

### New Capabilities

- `visual-regression-baseline`: compare stable page and component screenshots against approved baselines.
- `client-observability`: capture client runtime errors and basic performance signals through a minimal app-side integration point.

### Modified Capabilities

- None.

## Impact

- **Code affected**: Playwright e2e tests, shared UI test fixtures, and a small client observability utility or hook.
- **Expected outcome**: faster detection of unintended visual changes and better visibility into runtime errors/performance issues seen by real users.
- **Non-impact**: routing, content, SEO metadata, and existing interaction behavior.
