## ADDED Requirements

### Requirement: LCP element renders immediately

El elemento LCP (subtítulo del Hero) SHALL ser visible en el primer paint, sin esperar a que terminen las animaciones.

#### Scenario: Static text visible on first paint

- **WHEN** la página Home termina su primer layout y paint
- **THEN** el texto del subtítulo del Hero es visible (opacity > 0) sin esperar a animaciones

#### Scenario: Animation triggers after first paint

- **WHEN** el navegador completa el primer paint del subtítulo estático
- **THEN** la animación de framer-motion del subtítulo se inicia (fade-in del overlay animado)

#### Scenario: No layout shift during animation swap

- **WHEN** la versión animada del subtítulo reemplaza visualmente a la versión estática
- **THEN** no se produce Cumulative Layout Shift (CLS = 0)

#### Scenario: Reduced motion respected

- **WHEN** el usuario tiene configurada la preferencia `prefers-reduced-motion: reduce`
- **THEN** el subtítulo se muestra estático sin animación de entrada
