---
title: 'SDD en la practica con OpenSpec: de idea a PR sin perder el hilo'
description: 'Lecciones reales aplicando Spec-Driven Development con OpenSpec en un proyecto React: propuestas, tareas, validacion, CI, merge y archivado del cambio.'
date: '2026-03-27'
tags: ['sdd', 'openspec', 'spec-driven-development', 'react', 'workflow', 'testing', 'ci-cd']
author: 'Miguel Angel de Dios'
slug: 'sdd-openspec-spec-driven-development'
featured: false
---

## Por que escribir sobre esto ahora

En las ultimas semanas estuve aplicando **Spec-Driven Development (SDD)** con OpenSpec en cambios reales del portfolio. No fue teoria: fueron PRs, checks fallando, decisiones de alcance, y cierre completo del ciclo (incluido archive).

Este post resume lo que mejor funciono, lo que se rompio en el camino, y como ajustar el proceso para entregar mas rapido con menos retrabajo.

---

## Que es SDD (sin humo)

Para mi, SDD es esto:

1. Definir claramente **que problema resolvemos**.
2. Convertirlo en **requisitos verificables**.
3. Dividirlo en **tareas ejecutables**.
4. Implementar con feedback corto (tests + CI).
5. Cerrar con trazabilidad (PR + archive de cambio).

No reemplaza el codigo. Lo hace mas predecible.

---

## Flujo que seguimos con OpenSpec

Un cambio tipico quedo asi:

1. `proposal.md` para el alcance y motivacion.
2. `design.md` para decisiones tecnicas.
3. `spec.md` con requisitos y escenarios.
4. `tasks.md` como checklist operativa.
5. Rama `feat/...`, implementacion y validacion.
6. Merge a `main`.
7. `openspec archive <change>` para mover el cambio a historial y sincronizar spec principal.

La parte clave: **no avanzar por intuicion** cuando hay dudas de alcance. Primero se corrige spec/tareas, luego codigo.

---

## Caso real: SEO i18n (canonical + hreflang)

Uno de los cambios recientes fue alinear metadata SEO en rutas bilingues:

- Canonical por locale.
- Alternates `es`, `en` y `x-default`.
- 404 como no indexable (`noindex, nofollow`).
- Normalizacion consistente de URLs (sin slashes raros).

### Que aprendimos en la practica

- Centralizar la generacion en un helper compartido evita divergencias entre paginas.
- Si no pruebas `x-default` en rutas con slug, tarde o temprano alguien lo rompe.
- En tests de metadata, no asumas variables de entorno: en CI pueden venir vacias.

Ese ultimo punto nos pego: en local pasaba, en CI fallaba por `VITE_SITE_URL` indefinida. Se soluciono stubeando env en test.

---

## Lo mejor de trabajar con tasks.md

`tasks.md` termino siendo el contrato operativo del cambio.

Ventajas concretas:

- Evita olvidos en fase de entrega (`commit`, `push`, `PR`).
- Hace visible el estado para revision asincrona.
- Facilita retomar contexto despues de pausas.
- Permite detectar rapido cuando "esta hecho en codigo" pero no en proceso.

El detalle importante: marcar tareas de delivery al final. Si no, parece incompleto aunque el PR exista.

---

## CI, calidad y friccion saludable

En paralelo al trabajo de features, reforzamos guardrails:

- Presupuesto de performance estricto en CI.
- Lighthouse CI en varias rutas/locales.
- Ajustes de runtime en GitHub Actions para evitar deprecations.

La leccion aqui es simple: **calidad automatizada no reemplaza criterio, pero lo fuerza donde importa**.

Cuando algo falla en PR, la pregunta no es "como lo salto", sino "que hueco de especificacion o test nos mostro".

---

## Donde SDD aporta mas (segun mi experiencia)

SDD brilla especialmente cuando:

- hay impacto transversal (ej. varias paginas/rutas),
- existen reglas de negocio faciles de olvidar,
- o el cambio debe quedar mantenible por semanas/meses.

Para micro-cambios triviales, puede sentirse pesado. En esos casos, mantener el proceso ligero es mejor que burocratizar.

---

## Checklist minimo que me llevo para futuros cambios

Antes de abrir PR:

1. ¿Requisitos y escenarios siguen representando lo implementado?
2. ¿`tasks.md` esta realmente al dia?
3. ¿Tests cubren happy path + edge case principal?
4. ¿CI valida lo que prometimos (no solo que compila)?
5. ¿Plan de cierre listo (merge + archive)?

Si cualquiera de esas respuestas es "no", todavia no esta listo.

---

## Cierre

OpenSpec + SDD no me hizo programar mas lento. Me hizo **iterar con menos sorpresas**.

Menos contexto perdido.
Menos "ah, faltaba esto" al final.
Mas trazabilidad entre decision, implementacion y resultado.

Si estas usando asistentes de codigo, este enfoque ayuda mucho: el agente puede ejecutar mas rapido cuando el marco de decision esta bien definido.

---

Si te interesa, en un siguiente post puedo compartir una plantilla base de `proposal/design/spec/tasks` para cambios frontend pequenos y medianos.
