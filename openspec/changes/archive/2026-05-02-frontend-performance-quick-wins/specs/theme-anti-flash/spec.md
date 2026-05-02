## ADDED Requirements

### Requirement: Theme class applied before first paint

The system SHALL apply the resolved theme class (`dark` or `light`) to `<html>` synchronously before the browser paints the page.

#### Scenario: Theme resolved from localStorage on page load

- **WHEN** a user loads the page with a stored theme preference of `"dark"` in localStorage
- **THEN** the `<html>` element SHALL have the class `dark` before any visual paint occurs
- **AND** no white flash SHALL be visible during page load

#### Scenario: Theme resolved from system preference when no stored preference

- **WHEN** a user loads the page with no theme stored in localStorage and system prefers dark mode
- **THEN** the `<html>` element SHALL have the class `dark` before any visual paint occurs

#### Scenario: Light theme applied when system prefers light

- **WHEN** a user loads the page with no theme stored and system prefers light mode
- **THEN** the `<html>` element SHALL have the class `light` before any visual paint occurs

---

### Requirement: useTheme does not duplicate class application on init

The `useTheme` hook SHALL detect when the theme class is already correctly applied to `<html>` and SHALL NOT re-apply it or overwrite localStorage during initialization.

#### Scenario: Theme already matches stored preference

- **WHEN** `useTheme` initializes and `<html>` already has the class matching the stored preference
- **THEN** the hook SHALL set its internal state to that theme value
- **AND** the hook SHALL NOT write to localStorage during that initialization

#### Scenario: Theme class missing despite stored preference

- **WHEN** `useTheme` initializes and `<html>` lacks a theme class but localStorage has a stored value
- **THEN** the hook SHALL apply the correct class to `<html>`
- **AND** the hook SHALL update its internal state accordingly

#### Scenario: Runtime theme toggle still works

- **WHEN** the user clicks the theme toggle button at runtime (after initial load)
- **THEN** `useTheme` SHALL update the `<html>` class
- **AND** `useTheme` SHALL persist the new preference to localStorage
