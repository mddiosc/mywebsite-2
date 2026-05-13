# visual-regression-observability Design

## Context

The repository already has a mature test stack: Vitest for component/unit coverage, Playwright for browser flows, and a current accessibility suite. Playwright is configured to take failure screenshots, which is useful for debugging but not enough for intentional visual review. On the observability side, the app currently has analytics and security controls, but no dedicated client-side error/performance reporting surface.

## Goals / Non-Goals

**Goals:**

- Add explicit screenshot-based checks for important responsive states and shared UI surfaces.
- Keep screenshot tests stable by targeting a small number of high-value pages/components.
- Provide a minimal client observability entry point for runtime errors and Web Vitals.
- Avoid adding a large monitoring vendor commitment unless explicitly required later.

**Non-Goals:**

- No redesign of the visual system.
- No broad screenshot coverage of every page state.
- No full observability platform migration.
- No backend telemetry pipeline.

## Decisions

### D1: Visual regression stays focused on high-value surfaces

**Decision**: Add screenshot baselines for a small set of representative routes and shared UI elements instead of trying to cover every screen.

**Rationale**: The repo already has strong functional tests; visual regression should catch layout drift where it matters most without making the suite brittle.

### D2: Use Playwright's built-in screenshot assertions

**Decision**: Use `toHaveScreenshot` in Playwright for deterministic baselines.

**Rationale**: The project already depends on Playwright, so this avoids introducing another visual testing tool.

### D3: Client observability is adapter-based

**Decision**: Implement a tiny app-side utility or hook that can forward runtime errors and Web Vitals to a sink, with safe no-op defaults when no sink is configured.

**Rationale**: The app is a static frontend and should not hard-code a vendor-specific monitoring dependency into core UI code.

### D4: Observability must not affect UX

**Decision**: Client reporting should be passive and non-blocking.

**Rationale**: Monitoring should never delay navigation, rendering, or hydration.

## Risks / Trade-offs

- **[Risk]** Screenshot tests can become flaky across browsers or machines. **Mitigation**: keep baselines focused, use deterministic viewports, and restrict noise-prone animations.
- **[Risk]** Runtime telemetry code can become dead weight if never wired. **Mitigation**: expose a small adapter API and test it in isolation.
- **[Risk]** Broad observability scope could drift into vendor selection. **Mitigation**: keep the proposal vendor-neutral and adapter-based.

## Open Questions

- Which pages should receive screenshot baselines first: home, projects, blog, or shared components like the navbar and footer?
- Should the observability sink be purely console/dev-only initially, or should it expose a structured callback for a future provider?
