# visual-regression-observability Tasks

## 1. Branch Setup

- [x] 1.1 Create branch `chore/visual-regression-observability` from `main`
- [ ] 1.2 Open a PR back to `main` after the change is implemented and verified

## 2. Visual Regression Coverage

- [x] 2.1 Identify the highest-value pages or shared UI surfaces for screenshot baselines
- [x] 2.2 Add deterministic Playwright screenshot assertions for those surfaces
- [x] 2.3 Stabilize animations or dynamic regions that would make screenshots noisy
- [x] 2.4 Update fixtures or helpers so screenshot runs are repeatable across viewports

## 3. Client Observability

- [x] 3.1 Add a minimal client observability adapter for runtime errors and Web Vitals
- [x] 3.2 Keep the adapter optional and non-blocking when no sink is configured
- [x] 3.3 Wire the adapter into the app at a safe integration point
- [x] 3.4 Add unit tests for the adapter behavior

## 4. Validation

- [x] 4.1 Run `pnpm test`
- [x] 4.2 Run `pnpm test:e2e`
- [x] 4.3 Run the new screenshot-based checks and confirm baselines are stable
- [x] 4.4 Run `pnpm build`
