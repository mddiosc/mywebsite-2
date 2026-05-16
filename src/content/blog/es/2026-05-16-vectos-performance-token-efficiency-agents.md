---
title: 'Vectos: mejoras de rendimiento y eficiencia de tokens para agentes'
description: 'Continuación del primer post sobre Vectos: qué ha cambiado en la capa de recuperación, qué muestran los benchmarks y por qué la eficiencia de tokens importa tanto cuando trabajas con agentes sobre repos reales.'
date: '2026-05-16'
tags: ['ia', 'llm', 'agentes', 'embeddings', 'rag', 'vectos', 'mcp', 'rendimiento', 'tokens', 'dx']
author: 'Miguel Angel de Dios'
slug: 'vectos-performance-token-efficiency-agents'
featured: true
---

## De la intuición a la medición

En el primer post sobre `Vectos` contaba la idea base: una capa local de recuperación semántica para que los agentes encuentren antes el código relevante y dejen de gastar tanto contexto en orientarse mal.

En ese momento la tesis era bastante clara, pero todavía estaba más cerca de una intuición validada por uso real que de una medición sistemática.

Desde entonces he estado trabajando justo en esa parte: mejorar la recuperación, comparar contra herramientas tradicionales y medir mejor el coste real en tokens.

El resumen corto es este:

> Vectos no solo intenta encontrar mejor. Intenta que el agente necesite leer menos para poder decidir mejor.

Esa diferencia importa mucho.

Porque en un flujo con agentes, el coste no está solo en la búsqueda inicial. Está en todo lo que viene después: resultados ruidosos, lecturas innecesarias, contexto desperdiciado y razonamiento construido sobre señales mediocres.

---

## Qué ha cambiado en la recuperación

La primera versión útil de Vectos ya permitía indexar un proyecto, generar embeddings y buscar por intención. Funcionaba, pero todavía era una arquitectura bastante directa:

```text
embedding -> similitud coseno -> resultados
```

La versión actual ha evolucionado hacia una pila más híbrida:

```text
jina-embeddings-v3 -> HNSW -> BM25 -> RRF -> preview compacto
```

Traducido:

- `jina-embeddings-v3` aporta embeddings de `1024` dimensiones, orientados a código, texto y consultas multilingües.
- `HNSW` evita depender de una búsqueda vectorial lineal a medida que el índice crece.
- `BM25` añade recuperación textual clásica para términos específicos.
- `RRF` fusiona señales semánticas y textuales sin obligar a elegir una sola fuente de ranking.
- El preview compacto devuelve rutas, rangos, firmas y pistas en lugar de volcar archivos enteros.

Esto no convierte a Vectos en magia. Pero sí cambia bastante la ergonomía del agente: en vez de recibir una pared de coincidencias literales, recibe una lista corta de candidatos con suficiente contexto para decidir si necesita leer más.

---

## El dato que más me interesa: coste total del workflow

Comparar solo el coste de una búsqueda puede ser engañoso.

`glob` puede devolver pocos tokens, pero normalmente no responde nada por sí solo. Te dice qué archivos podrían existir, no qué parte resuelve la intención.

`grep` puede ser exacto, pero cuando los términos son genéricos devuelve muchísimo ruido. En repos con Tailwind, buscar algo como `dark mode` puede acabar encontrando cientos de clases `dark:*` que no tienen nada que ver con la implementación del toggle.

`ast-grep` es muy potente para patrones estructurales, pero no entiende una pregunta conceptual como “cómo funciona el cambio de idioma” si no sabes ya qué patrón buscar.

Por eso empecé a medir el coste completo:

```text
búsqueda + lecturas posteriores necesarias para responder
```

En un benchmark con diez consultas reales sobre un proyecto React/TypeScript con Tailwind, i18n, routing y documentación, los números medios quedaron así:

| Flujo | Tokens medios por consulta |
| --- | ---: |
| Vectos | ~489 |
| grep + lecturas | ~8.183 |
| glob + lecturas | ~3.299 |
| ast-grep + lecturas | ~1.748 |
| Read file, sabiendo ya qué leer | ~3.397 |

La lectura práctica: en ese escenario, Vectos redujo el coste total del workflow unas `17x` frente a `grep`, `7x` frente a `glob + read` y `4x` frente a `ast-grep + read`.

No interpreto esos ratios como una ley universal. Sí los interpreto como una señal fuerte de dónde está el ahorro real: no en “buscar más barato”, sino en cortar antes el árbol de exploración.

---

## Por qué grep se rompe con términos genéricos

`grep` sigue siendo una herramienta excelente.

Si busco un identificador único, un import concreto, un error code o un literal exacto, normalmente quiero `grep`. No hay que sobrediseñar eso.

El problema aparece cuando el agente no sabe todavía cuáles son las palabras exactas del sistema.

Ejemplos del benchmark:

| Intención | Vectos | grep | Motivo del ruido |
| --- | ---: | ---: | --- |
| Dark mode / theme toggle | ~150 tokens | ~7.956 tokens | `335` matches por clases `dark:*` de Tailwind |
| Form validation and errors | ~155 tokens | ~7.729 tokens | `error`, `form` y `validation` aparecen en demasiados sitios |
| Internationalization | ~170 tokens | ~6.355 tokens | claves de locale, strings y helpers mezclados |
| Routing and navigation | ~145 tokens | ~4.611 tokens | `Link`, `route`, `navigate` repartidos por templates |

Este es el caso donde una búsqueda semántica bien acotada aporta más: cuando la intención está clara, pero las palabras exactas todavía no.

Ahí no quieres que el agente procese `300` líneas para descubrir que la implementación relevante estaba en un hook y un componente pequeño. Quieres que empiece por esos dos sitios.

---

## Lo que aportan las firmas y los hints

Una mejora que parece pequeña pero afecta mucho al flujo es el formato de salida.

Vectos no debería devolver solo “este archivo parece relevante”. Eso obliga al agente a leer demasiado pronto.

Por eso el resultado intenta incluir señales compactas:

- ruta del archivo
- rango de líneas
- firmas o símbolos relevantes
- hints de por qué ese resultado puede importar
- separación entre búsqueda de código y búsqueda de documentación

En el benchmark, aproximadamente la mitad de las consultas con Vectos ofrecieron suficiente contexto en el propio resultado como para evitar una lectura adicional inmediata.

Esa parte es importante porque el ahorro se compone:

```text
menos salida de búsqueda
+ menos lecturas posteriores
+ menos llamadas a herramientas
+ más contexto libre para razonar
```

Medido como sesión completa de diez consultas, el patrón fue este:

| Flujo | Coste estimado de sesión |
| --- | ---: |
| grep + lecturas | ~85.800 tokens |
| glob + lecturas | ~36.960 tokens |
| Vectos + lecturas puntuales | ~11.390 tokens |

Ese `~87%` de reducción frente a un flujo basado en `grep` no viene de una sola optimización. Viene de evitar trabajo que el agente no debería tener que hacer.

---

## Documentación: otro sitio donde se nota

La búsqueda en documentación tiene un problema parecido.

Los archivos Markdown suelen ser largos, mezclan guías, referencias, decisiones y ejemplos, y una búsqueda textual puede encontrar demasiadas coincidencias sin apuntar a la sección correcta.

Por eso Vectos mantiene un índice separado para docs:

```bash
vectos index . --docs
vectos search --docs "how to run tests"
```

En las mediciones sobre documentación bilingüe, las consultas conceptuales también mostraron diferencias grandes:

| Intención | Vectos | grep |
| --- | ---: | ---: |
| Testing strategy | ~115 tokens | ~6.418 tokens |
| Internationalization | ~120 tokens | ~5.419 tokens |
| Component architecture | ~120 tokens | ~3.039 tokens |
| Development setup | ~113 tokens | ~1.050 tokens |
| Recaptcha security | ~130 tokens | ~450 tokens |

El caso `recaptcha` es interesante porque muestra el límite: cuando el término es muy específico, `grep` ya va bastante bien. Vectos sigue devolviendo menos ruido, pero la diferencia deja de ser espectacular.

Eso me parece sano. La herramienta no tiene que ganar siempre. Tiene que ganar donde el flujo real duele.

---

## Rendimiento: no solo tokens

También hay una parte de rendimiento puro.

Pasar de una búsqueda vectorial lineal a `HNSW` cambia el margen de crecimiento del índice. En proyectos pequeños quizá no se nota demasiado, pero es una decisión necesaria si quiero que Vectos sea útil en repos medianos o monorepos.

El payload MCP también importa. Un agente no consume una tabla idealizada; consume una respuesta real de herramienta. En una comprobación representativa dentro del propio repo de Vectos, un payload de `3` resultados medía alrededor de `1242 bytes`; con `5` resultados, `1966 bytes`; con `10`, `3818 bytes`.

La conclusión práctica es simple: el número de resultados escala casi linealmente. Mantener una ventana por defecto de `5` resultados es un buen equilibrio entre cobertura y coste.

Más resultados no siempre significan mejor contexto. A veces solo significan más decisiones pendientes para el agente.

---

## Dónde no usaría Vectos

Cuanto más lo uso, más claro tengo que Vectos no debe intentar reemplazar todas las herramientas.

Usaría `grep` para:

- strings exactos
- imports concretos
- IDs únicos
- códigos de error
- patrones regex

Usaría `glob` para:

- descubrir archivos por nombre
- listar `*.spec.ts`
- encontrar convenciones de carpetas

Usaría `ast-grep` para:

- refactors estructurales
- buscar usos de una API concreta
- localizar patrones de AST repetidos

Usaría `Vectos` cuando la pregunta sea más parecida a:

- “dónde se implementa este flujo”
- “qué controla esta experiencia”
- “cómo se conecta esta feature”
- “qué docs explican esta decisión”
- “dónde debería empezar a leer”

Esa frontera me interesa porque evita convertir Vectos en una herramienta genérica sin foco. Su valor está en orientar, no en sustituir cada primitive del sistema.

---

## Lo que esto cambia en mi forma de trabajar

La mejora más clara no es que cada búsqueda sea perfecta.

La mejora es que el agente empieza mejor.

Y cuando un agente empieza mejor:

- lee menos basura
- usa menos contexto
- hace menos llamadas de exploración
- llega antes al archivo correcto
- deja más tokens para razonar, editar y verificar

Esa es la razón por la que sigo invirtiendo en Vectos.

No porque los embeddings sean interesantes por sí mismos. Sino porque una parte enorme del trabajo con agentes consiste en transformar una intención humana en un punto correcto del código.

Si esa traducción mejora, todo el flujo mejora.

---

## Siguiente foco

Después de estas mediciones, las prioridades quedan más claras:

- mejorar todavía más la calidad del ranking híbrido
- afinar previews para que respondan más sin obligar a leer archivos
- mantener payloads pequeños en MCP
- hacer que el reindexado incremental sea cada vez más invisible
- seguir validando contra repos reales, no solo fixtures cómodas

Vectos sigue siendo experimental, pero ya no lo veo solo como una intuición prometedora. Ahora tengo mejores datos para explicar por qué esta capa tiene sentido.

Los agentes no necesitan más contexto por defecto.

Necesitan mejor orientación antes de gastar contexto.

_Relacionado:_

- [Vectos: qué es, cómo funciona y por qué lo estoy construyendo](/es/blog/2026-04-25-vectos-semantic-code-retrieval-agents)
- [Por qué la memoria no basta para trabajar con agentes sobre código real](/es/blog/2026-04-24-unified-memory-code-embeddings-local)
