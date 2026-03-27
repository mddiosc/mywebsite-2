---
slug: mywebsite-2
title: 'mywebsite-2: Plataforma de Portfolio Bilingue con React, OpenSpec y Calidad Continua'
summary: 'Caso de estudio completo de mi portfolio en produccion: arquitectura frontend moderna, i18n, SEO tecnico, automatizacion de calidad y flujo spec-driven con OpenSpec.'
published: '2026-03-27'
featured: true
role: 'Frontend Engineer / Product Owner'
status: 'En produccion y evolucion continua'
outcomes:
  - 'Arquitectura estable y moderna con React 19 + Vite 8 + TypeScript 5.9'
  - 'SEO i18n robusto con canonical/hreflang deterministico por ruta'
  - 'Pipeline de calidad con lint, type-check, tests, budget y Lighthouse CI'
  - 'Workflow OpenSpec end-to-end para cambios trazables y mantenibles'
repoName: 'mywebsite-2'
relatedPosts:
  - 'sdd-openspec-spec-driven-development'
---

## Contexto

`mywebsite-2` es mi portfolio tecnico en produccion. Nacio para resolver una necesidad concreta: tener un sitio personal que no fuera solo escaparate visual, sino tambien una **plataforma viva** donde probar arquitectura, DX, calidad y delivery real.

No lo plantee como una landing estatica. Lo plantee como un producto que evoluciona por iteraciones, con decisiones tecnicas justificadas y validadas en CI.

## Problema a Resolver

Queria evitar tres anti-patrones comunes en portfolios:

- Sitios bonitos pero dificiles de mantener.
- SEO e i18n inconsistentes a medida que crece el contenido.
- Cambios rapidos sin trazabilidad (y con regresiones silenciosas).

## Solucion

Construir una base de frontend moderna, bilingue y automatizada, con un flujo de cambios guiado por especificaciones.

### Arquitectura Tecnica

- **Frontend**: React 19 + TypeScript 5.9
- **Build**: Vite 8 con mejoras de chunking y rendimiento
- **Estilos/UI**: Tailwind CSS + componentes reutilizables
- **Routing**: rutas localizadas por idioma (`/es/...`, `/en/...`)
- **Datos**: React Query para estado servidor y caching en features concretas

### Capas clave del sistema

1. **Contenido desacoplado en Markdown** para blog y case studies.
2. **Internacionalizacion real** (es/en) en UI y rutas.
3. **Metadata SEO por pagina** con control de canonical/alternates.
4. **Guardrails de calidad** desde commit hasta CI.

## Cambios Relevantes Ejecutados

Durante la modernizacion reciente del proyecto:

- Migracion de stack (React/Vite/TypeScript/tooling) con control de riesgo.
- Ajustes de CI para runtime moderno de actions y menor ruido por deprecations.
- Presupuesto de performance en CI para evitar regresiones de bundle.
- Integracion de Lighthouse CI para señal de UX/performance en PR.
- Mejora SEO i18n: canonical/hreflang consistentes en rutas estaticas y de detalle.

## SEO e i18n: aprendizaje aplicado

Uno de los puntos mas importantes fue unificar la logica de metadata en helper compartido para evitar divergencias entre paginas.

Esto nos permitio garantizar:

- Canonical correcto por locale.
- `hreflang` para `es`, `en` y `x-default`.
- Preservacion de slug en rutas de detalle.
- 404 no indexable sin canonical/alternates.

## Calidad y Entrega Continua

El pipeline de validacion quedo como parte central del proyecto:

- `lint`
- `type-check`
- `test`
- `build`
- performance budget
- Lighthouse CI

La meta no era "pasar checks", sino detectar desalineaciones pronto y reducir retrabajo.

## Flujo de Trabajo con OpenSpec

`mywebsite-2` se convirtio en terreno real para un flujo spec-driven completo:

1. propuesta del cambio,
2. diseno tecnico,
3. especificacion con requisitos y escenarios,
4. tareas operativas,
5. implementacion,
6. merge,
7. archive del cambio.

Esto mejoro la trazabilidad y facilito retomar contexto sin depender de memoria.

## Resultados

- Proyecto mas mantenible a medida que crece el contenido.
- Menos regresiones en SEO/metadata y rendimiento.
- Mejor disciplina de entrega en PRs con checklist real.
- Mayor claridad para iterar nuevas mejoras sin romper base existente.

## Lecciones Clave

1. Un portfolio puede (y debe) tratarse como producto real.
2. i18n + SEO necesitan arquitectura, no parches por pagina.
3. Quality gates utiles aceleran, no frenan.
4. SDD/OpenSpec reduce contexto perdido y sorpresas de ultima hora.

## Estado Actual e Iteraciones Futuras

El proyecto esta en produccion y sigue evolucionando. Las siguientes iteraciones se centran en:

- optimizacion continua de performance,
- mejoras de accesibilidad,
- mas contenido tecnico conectado a casos reales,
- y refinamiento del flujo de trabajo para cambios complejos.

`mywebsite-2` es, en la practica, mi laboratorio de ingenieria frontend aplicado a producto real.
