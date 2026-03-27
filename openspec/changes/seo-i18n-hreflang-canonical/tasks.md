## 1. Setup

- [x] 1.1 Create and switch to branch `feat/seo-i18n-hreflang-canonical`
- [x] 1.2 Add a shared SEO URL helper for canonical + alternates generation (supports `es`, `en`, `x-default`)

## 2. DocumentHead Enhancements

- [x] 2.1 Extend `DocumentHead` props to accept alternate URL entries (`hreflang`, `href`)
- [x] 2.2 Render `<link rel="alternate" hreflang="..." href="..." />` tags when alternates are provided
- [x] 2.3 Keep existing canonical behavior unchanged and ensure alternates are optional

## 3. Page Integration

- [x] 3.1 Update localized indexable pages (`Home`, `About`, `Projects`, `Blog`, `Contact`) to use helper-generated canonical + alternates
- [x] 3.2 Update localized detail pages (`BlogPost`, `ProjectCaseStudy`) to use helper-generated canonical + alternates with slug preservation
- [x] 3.3 Confirm `NotFound` keeps `robots=noindex,nofollow` and does not pass canonical/alternates

## 4. Tests

- [x] 4.1 Add unit tests for SEO URL helper normalization (`/`, nested routes, slug routes)
- [x] 4.2 Add tests for `DocumentHead` rendering canonical + alternates correctly
- [x] 4.3 Add route-level metadata tests for one static page and one detail page in both locales
- [x] 4.4 Add a 404 metadata test to ensure no canonical/alternates on non-index page

## 5. Validation

- [x] 5.1 Run `pnpm lint`
- [x] 5.2 Run `pnpm type-check`
- [x] 5.3 Run `pnpm test`
- [x] 5.4 Run `pnpm build`
- [x] 5.5 Run `pnpm lighthouse:ci` and verify SEO assertions stay green

## 6. Delivery

- [x] 6.1 Commit with message `feat(seo): enforce canonical and hreflang consistency for localized routes`
- [x] 6.2 Push branch and open PR to `main`
