# visual-regression-observability Tasks

## 1. Branch Setup

- [ ] 1.1 Create branch `chore/visual-regression-observability` from `main`
- [ ] 1.2 Open a PR back to `main` after the change is implemented and verified

## 2. Visual Regression Coverage

- [ ] 2.1 Identify the highest-value pages or shared UI surfaces for screenshot baselines
- [ ] 2.2 Add deterministic Playwright screenshot assertions for those surfaces
- [ ] 2.3 Stabilize animations or dynamic regions that would make screenshots noisy
- [ ] 2.4 Update fixtures or helpers so screenshot runs are repeatable across viewports

## 3. Client Observability

- [ ] 3.1 Add a minimal client observability adapter for runtime errors and Web Vitals
- [ ] 3.2 Keep the adapter optional and non-blocking when no sink is configured
- [ ] 3.3 Wire the adapter into the app at a safe integration point
- [ ] 3.4 Add unit tests for the adapter behavior

## 4. Validation

- [ ] 4.1 Run `pnpm test`
- [ ] 4.2 Run `pnpm test:e2e`
- [ ] 4.3 Run the new screenshot-based checks and confirm baselines are stable
- [ ] 4.4 Run `pnpm build`
