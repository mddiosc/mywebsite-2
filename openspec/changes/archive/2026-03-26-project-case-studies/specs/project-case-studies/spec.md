## ADDED Requirements

### Requirement: Selected projects can expose localized case-study detail pages

The system SHALL allow selected portfolio projects to publish localized case-study detail pages under the existing language-prefixed Projects section.

#### Scenario: Visitor opens a project case study

- **WHEN** a visitor navigates to a valid localized project case-study URL
- **THEN** the application renders a project detail page for that locale
- **AND** the page remains under the localized Projects route structure

### Requirement: Case-study content enriches snapshot-backed project data

The system SHALL merge local editorial case-study content with the existing snapshot-backed project portfolio data for projects that have a defined match.

#### Scenario: Project has matching case-study content

- **WHEN** a project in the snapshot matches localized case-study content
- **THEN** the UI can render both repository metadata and editorial project details from a single merged view model
- **AND** repository data does not need to be duplicated manually inside the case-study content body

### Requirement: Projects without case studies remain visible in the portfolio listing

The system SHALL preserve the current portfolio listing behavior for projects that do not have an associated case study.

#### Scenario: Project has no matching case-study content

- **WHEN** a snapshot-backed project does not have a corresponding case study
- **THEN** it still appears in the Projects listing
- **AND** the list experience continues to function without requiring detail content for every project

### Requirement: Case studies support bilingual editorial content

The system SHALL support Spanish and English case-study content that follows the site's current localization model.

#### Scenario: Visitor changes locale

- **WHEN** a visitor accesses the Projects section in Spanish or English
- **THEN** case-study content and links resolve within that locale
- **AND** localized detail pages use the correct language-prefixed route

### Requirement: Case-study detail pages support related portfolio navigation

The system SHALL support curated related links from a case study to relevant destination types such as the GitHub repository, live demo, or associated blog posts.

#### Scenario: Case study includes related links

- **WHEN** a case study defines supported related links
- **THEN** the detail page exposes them as part of the project detail experience
- **AND** the links help connect Projects with the rest of the portfolio content
