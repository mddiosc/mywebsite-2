## ADDED Requirements

### Requirement: Preconnect hints present in static HTML

The system SHALL include `<link rel="preconnect">` hints in `index.html` for all known third-party origins used at runtime.

#### Scenario: Google Fonts preconnect hints present

- **WHEN** `index.html` is served to the browser
- **THEN** it SHALL contain `<link rel="preconnect">` for `https://fonts.googleapis.com`
- **AND** it SHALL contain `<link rel="preconnect" crossorigin>` for `https://fonts.gstatic.com`

#### Scenario: Formspree preconnect hint present

- **WHEN** `index.html` is served to the browser
- **THEN** it SHALL contain `<link rel="preconnect">` for `https://formspree.io`

#### Scenario: Umami analytics preconnect hint present

- **WHEN** `index.html` is served to the browser
- **THEN** it SHALL contain `<link rel="preconnect">` for `https://mywebsite-umami.mddiosc.cloud`

---

### Requirement: resourcePreloading.ts exports are connected or removed

The system SHALL ensure that every function exported from `src/lib/resourcePreloading.ts` is either called somewhere in the application or explicitly marked as available for future use.

#### Scenario: All resourcePreloading exports have callers or are documented

- **WHEN** the code is audited
- **THEN** each exported function SHALL have at least one call site in the codebase
- **OR** the function SHALL be retained with a clear comment indicating it is intended for future use

#### Scenario: No dead exports remain in resourcePreloading.ts

- **WHEN** `src/lib/resourcePreloading.ts` is reviewed
- **THEN** no function SHALL be exported without a corresponding invocation or documented intent
