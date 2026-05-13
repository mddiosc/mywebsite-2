# visual-regression-baseline Specification

## Purpose

TBD - created by archiving change 2026-05-12-visual-regression-observability. Update Purpose after archive.

## Requirements

### Requirement: High-value UI surfaces have explicit screenshot baselines

The system SHALL include explicit Playwright screenshot checks for a small set of representative pages or shared UI surfaces.

#### Scenario: Representative page renders match approved baseline

- **WHEN** a representative page is rendered at a defined viewport
- **THEN** the page SHALL match its approved screenshot baseline
- **AND** an unintended visual change SHALL fail the test

#### Scenario: Shared UI surface remains stable

- **WHEN** a shared UI surface such as the navbar, footer, or hero is rendered in its target state
- **THEN** the screenshot assertion SHALL compare against a stable baseline

### Requirement: Screenshot baselines are deterministic

Screenshot checks SHALL use fixed viewports and stable rendering conditions so that only meaningful visual changes are detected.

#### Scenario: Responsive baseline at a fixed viewport

- **WHEN** a screenshot check runs for a mobile or desktop viewport
- **THEN** the viewport SHALL be fixed for the test
- **AND** dynamic noise such as animation timing SHALL be controlled or minimized

### Requirement: Existing e2e coverage remains intact

The system SHALL keep the current functional Playwright suite intact while adding visual regression checks.

#### Scenario: Functional e2e still passes

- **WHEN** the visual regression suite is added
- **THEN** the existing navigation, accessibility, and page-flow tests SHALL continue to run
