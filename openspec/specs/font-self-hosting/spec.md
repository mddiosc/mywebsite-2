## ADDED Requirements

### Requirement: Self-hosted Inter font

El sistema SHALL servir la fuente Inter desde el propio dominio, sin dependencia de CDNs externos.

#### Scenario: Font loads from local domain

- **WHEN** el navegador solicita la página
- **THEN** la fuente Inter se descarga desde un archivo woff2 servido por el mismo origen (no desde `rsms.me`)

#### Scenario: Font uses swap display strategy

- **WHEN** la fuente woff2 no ha terminado de cargar
- **THEN** el texto se renderiza inmediatamente con la fuente de fallback (`system-ui`) y se intercambia cuando la woff2 está disponible

#### Scenario: Font file is preloaded

- **WHEN** el HTML se parsea
- **THEN** el navegador encuentra un `<link rel="preload" as="font" type="font/woff2" crossorigin>` para el archivo de fuente Inter

#### Scenario: No external CSS blocks rendering

- **WHEN** el navegador construye el render tree
- **THEN** no hay hojas de estilo externas bloqueantes para la declaración de la fuente (la regla `@font-face` está inline en el bundle CSS de la app)
