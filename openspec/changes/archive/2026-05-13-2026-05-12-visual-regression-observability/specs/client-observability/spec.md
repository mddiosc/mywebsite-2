## ADDED Requirements

### Requirement: Client runtime errors can be reported through a passive adapter

The system SHALL expose a lightweight client-side reporting path for runtime errors that can be connected to an external sink or remain a no-op.

#### Scenario: Runtime error occurs in the browser

- **WHEN** an uncaught client-side error occurs
- **THEN** the observability layer SHALL receive the error payload through a non-blocking adapter
- **AND** the app SHALL continue rendering its normal error handling behavior

### Requirement: Web Vitals can be captured without affecting UX

The system SHALL expose a way to capture basic Web Vitals signals without delaying render or navigation.

#### Scenario: Page loads normally

- **WHEN** a user loads or navigates through the app
- **THEN** Web Vitals collection SHALL not block rendering or transitions
- **AND** collected metrics SHALL be forwarded only if a sink is configured

### Requirement: Observability is optional and vendor-neutral

The system SHALL keep the observability layer optional so the app can run without any monitoring provider configured.

#### Scenario: No sink configured

- **WHEN** the app runs without an observability sink
- **THEN** the reporting API SHALL behave as a no-op
- **AND** no runtime errors SHALL be introduced by the absence of a provider
