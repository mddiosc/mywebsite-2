# seo-metadata-consistency Tasks

## 1. Branch Setup

- [ ] 1.1 Create branch `chore/seo-metadata-consistency` from `main`
- [ ] 1.2 Open a PR back to `main` after the change is implemented and verified

## 2. Metadata Consistency

- [ ] 2.1 Audit localized pages to confirm they all pass metadata through `DocumentHead`
- [ ] 2.2 Normalize canonical and alternate URL generation through the shared SEO helper
- [ ] 2.3 Ensure article pages keep article-specific metadata attached to their content model
- [ ] 2.4 Confirm non-indexable pages remain `noindex, nofollow`

## 3. Tests

- [ ] 3.1 Add or extend tests for the SEO helper normalization behavior
- [ ] 3.2 Add or extend tests for `DocumentHead` rendering canonical, alternates, Open Graph, Twitter, and article tags
- [ ] 3.3 Add route-level metadata checks for a static page and a content detail page in both locales
- [ ] 3.4 Verify 404 metadata does not emit canonical or alternate links

## 4. Validation

- [ ] 4.1 Run `pnpm lint`
- [ ] 4.2 Run `pnpm type-check`
- [ ] 4.3 Run `pnpm test`
- [ ] 4.4 Run `pnpm build`
- [ ] 4.5 Run `pnpm lighthouse:ci` and verify SEO checks remain green
