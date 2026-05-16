## ADDED Requirements

### Requirement: Particles canvas disabled on mobile viewports

El fondo animado de partículas canvas SHALL deshabilitarse en viewports con ancho inferior a 640px.

#### Scenario: Particles render on desktop

- **WHEN** el viewport tiene un ancho >= 640px
- **THEN** el canvas de partículas se renderiza y ejecuta su bucle de animación

#### Scenario: Particles disabled on mobile

- **WHEN** el viewport tiene un ancho < 640px
- **THEN** el componente ParticlesBackground retorna null y no ejecuta ningún requestAnimationFrame

#### Scenario: Particles respond to resize

- **WHEN** el usuario redimensiona el viewport de móvil (<640px) a desktop (>=640px)
- **THEN** el canvas de partículas se monta y comienza a animarse

#### Scenario: No particles when reduced motion is preferred

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** el canvas de partículas ejecuta exactamente un tick (fotograma estático) y no continúa animándose, independientemente del viewport
