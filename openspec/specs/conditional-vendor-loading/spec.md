## ADDED Requirements

### Requirement: Recaptcha loads only on Contact page

El bundle de `react-google-recaptcha-v3` y la inyección del script de recaptcha SHALL ocurrir únicamente cuando el usuario navega a la página Contact.

#### Scenario: Recaptcha not loaded on Home page

- **WHEN** el usuario visita la página Home
- **THEN** el script de recaptcha (`www.google.com/recaptcha`) NO se descarga ni ejecuta

#### Scenario: Recaptcha loads on Contact page

- **WHEN** el usuario navega a la página Contact
- **THEN** el bundle de `react-google-recaptcha-v3` se descarga dinámicamente y el script de recaptcha se inyecta

#### Scenario: Contact form works without recaptcha

- **WHEN** el bundle de recaptcha falla al cargar o la clave de sitio no está configurada
- **THEN** el formulario de contacto sigue siendo funcional y submittable sin verificación captcha

### Requirement: Vendor bundles load only on pages that need them

Los chunks de vendor específicos (markdown, data utilities) SHALL cargarse solo en las rutas que los utilizan.

#### Scenario: Markdown vendor not loaded on Home

- **WHEN** el usuario visita la página Home
- **THEN** el chunk `markdown-vendor` (react-markdown, rehype, remark, highlight.js) NO se descarga

#### Scenario: Markdown vendor loaded on Blog post

- **WHEN** el usuario navega a una página de blog post
- **THEN** el chunk `markdown-vendor` se descarga para renderizar el contenido markdown

### Requirement: Preconnect hints are conditional

Los `<link rel="preconnect">` para orígenes de terceros SHALL establecerse solo en las páginas que los necesitan.

#### Scenario: No recaptcha preconnects on Home

- **WHEN** el usuario visita la página Home
- **THEN** NO hay preconnects a `www.google.com` ni `www.gstatic.com`

#### Scenario: Formspree preconnect only on Contact

- **WHEN** el usuario visita la página Contact
- **THEN** se establece un preconnect a `https://formspree.io`
