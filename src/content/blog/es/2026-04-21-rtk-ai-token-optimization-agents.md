---
title: 'RTK-AI a fondo: cómo reducir el consumo de tokens un 80% con agentes'
description: 'En el post anterior lo mencioné de pasada. RTK-AI merece su propio espacio: qué es, cómo funciona por dentro, cómo se configura y qué diferencia real marca en sesiones largas con agentes.'
date: '2026-04-21'
tags: ['ia', 'llm', 'agentes', 'rtk-ai', 'opencode', 'herramientas-desarrollo', 'dx', 'rendimiento']
author: 'Miguel Angel de Dios'
slug: 'rtk-ai-token-optimization-agents'
featured: false
---

## Lo que dejé pendiente

En [Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos](/es/blog/2026-04-18-agent-era-hybrid-llms-memory) mencioné RTK-AI en un par de párrafos. Lo suficiente para entender que existe y para qué sirve, pero sin entrar en detalle.

La razón es que merece su propio espacio. El problema que resuelve es real, el impacto es medible y la configuración tiene matices que no caben en una mención de pasada.

Este post es eso: RTK-AI a fondo.

---

## El problema que nadie te cuenta antes de usar agentes

Cuando empiezas a trabajar con agentes autónomos como opencode o Claude Code, el primer impacto positivo es claro: el agente hace cosas. Lee archivos, ejecuta comandos, propone cambios, pasa tests.

El segundo impacto — el negativo — llega cuando ves la factura.

Los agentes ejecutan muchos comandos durante una sesión. Y el output de esos comandos es verboso por naturaleza:

- `npm install` devuelve cientos de líneas de dependencias resueltas
- `tsc --noEmit` lista cada error con ruta, línea, columna y descripción
- `git log --oneline -50` son 50 líneas de commits
- `jest --verbose` puede devolver miles de líneas entre tests pasados, fallidos y cobertura

Todo ese output llega al LLM en cada paso del ciclo del agente. El modelo lo procesa, lo incluye en su contexto y responde. Tokens de entrada, tokens de salida, tokens de contexto acumulado.

En una sesión larga — investigando un bug, refactorizando un módulo, generando una suite de tests — el consumo se dispara de formas que no anticipas cuando empiezas.

RTK-AI ataca exactamente este punto.

---

## Qué es RTK-AI

RTK son las siglas de **Rust Token Killer**. El nombre lo dice todo: está escrito en Rust y su objetivo es matar tokens innecesarios.

Técnicamente es un **proxy CLI**. Se coloca entre los comandos que ejecuta el agente y el LLM que los procesa. Intercepta el output de cada comando, lo filtra, lo comprime y devuelve solo lo que el modelo necesita realmente para tomar la siguiente decisión.

No modifica los comandos. No cambia el comportamiento del agente. Solo reduce el ruido antes de que llegue al modelo.

La reducción en la práctica está entre el **60% y el 90%** dependiendo del tipo de comando. Los comandos más verbosos — instaladores de paquetes, runners de tests con verbose, logs de git — son donde más se nota.

---

## Cómo funciona por dentro

RTK tiene reglas de filtrado por tipo de comando. Para cada comando conocido, sabe qué partes del output son relevantes para un agente y cuáles son ruido.

Por ejemplo, para `npm install`:

- **Relevante**: paquetes instalados, warnings, errores
- **Ruido**: barras de progreso, resolución de dependencias transitivas, timings internos

Para `tsc --noEmit`:

- **Relevante**: errores con ruta y mensaje
- **Ruido**: líneas de contexto redundantes, separadores, resúmenes repetidos

Para `git log`:

- **Relevante**: hash corto, mensaje de commit
- **Ruido**: metadatos de autor y fecha si no son necesarios para la tarea

El resultado es que el modelo recibe la información que necesita para actuar, sin el volumen que solo sirve para consumir contexto.

---

## Instalación e integración

La instalación varía según el sistema operativo y el agente que uses. El [repositorio oficial de RTK-AI](https://github.com/rtk-ai/rtk) tiene las instrucciones actualizadas para cada plataforma, incluyendo cómo integrarlo con Claude Code y opencode mediante hooks.

La idea en todos los casos es la misma: RTK actúa como proxy entre los comandos que ejecuta el agente y el LLM. Una vez configurado, cada comando pasa automáticamente por el filtro sin que tengas que hacer nada más.

---

## Comandos útiles del día a día

Una vez configurado, RTK funciona en segundo plano sin que tengas que pensar en él. Pero hay comandos que uso regularmente para entender qué está pasando:

```bash
rtk gain              # ahorro total de tokens desde que lo instalaste
rtk gain --history    # desglose por comando — cuánto ahorra cada uno
rtk discover          # detecta comandos que RTK aún no cubre en tu proyecto
```

El comando `rtk discover` es especialmente útil cuando empiezas en un proyecto nuevo. Analiza los comandos que ejecutas habitualmente y te dice cuáles no tienen reglas de filtrado todavía — candidatos para añadir reglas personalizadas.

Para debuggear sin filtrado — cuando necesitas ver el output bruto exactamente como lo devuelve el comando:

```bash
rtk proxy --raw git log --oneline -20
```

---

## Reglas personalizadas

Los proyectos tienen comandos propios que RTK no conoce por defecto. Scripts de build internos, runners de tests con flags específicos, herramientas de la empresa.

RTK permite definir reglas de filtrado personalizadas en un fichero de configuración local al proyecto:

```toml
# .rtk/rules.toml

[[rule]]
command = "pnpm run test:e2e"
filter = [
  { pattern = "^\\s+✓", keep = true },   # líneas de test pasado
  { pattern = "^\\s+✗", keep = true },   # líneas de test fallido
  { pattern = "^Error", keep = true },   # errores
  { pattern = ".*", keep = false }       # todo lo demás, fuera
]

[[rule]]
command = "pnpm run build"
filter = [
  { pattern = "^dist/", keep = true },   # archivos generados
  { pattern = "^ERROR", keep = true },   # errores de build
  { pattern = ".*", keep = false }
]
```

Las reglas se aplican en orden. La primera que hace match decide si la línea se mantiene o se descarta. El patrón `.*` al final actúa como catch-all para descartar todo lo que no haya hecho match antes.

---

## Números reales

En una sesión típica de opencode investigando un bug en un proyecto React con TypeScript:

| Comando | Tokens sin RTK | Tokens con RTK | Reducción |
| --- | --- | --- | --- |
| `pnpm install` | ~1.800 | ~120 | 93% |
| `tsc --noEmit` | ~950 | ~280 | 71% |
| `pnpm run test` | ~3.200 | ~640 | 80% |
| `git log --oneline -30` | ~420 | ~420 | 0% |
| `git diff HEAD~3` | ~2.100 | ~890 | 58% |

El `git log` no se reduce porque ya es compacto por naturaleza — RTK es lo suficientemente inteligente para no tocar lo que ya está limpio.

El impacto acumulado en una sesión de 2-3 horas con un agente activo puede ser la diferencia entre 50.000 tokens y 12.000 tokens. A precios de API cloud, eso es significativo.

---

## Lo que RTK no hace

Vale la pena ser explícito sobre los límites:

**No mejora la calidad de las respuestas.** RTK filtra ruido, no añade señal. Si el output de un comando no contiene la información que el modelo necesita, RTK no lo va a arreglar.

**No funciona bien con comandos interactivos.** Comandos que esperan input del usuario o que tienen output dinámico (spinners, progress bars en tiempo real) pueden comportarse de forma inesperada a través del proxy.

**Las reglas personalizadas requieren mantenimiento.** Si cambias tus scripts de build o tus flags de test, las reglas de filtrado pueden quedarse desactualizadas y empezar a descartar cosas que sí importan.

**No elimina el problema de contexto largo.** RTK reduce el volumen de tokens por comando, pero si tu sesión acumula muchos comandos durante horas, el contexto sigue creciendo. Para eso, la estrategia de memoria con engram es el complemento natural — pero eso es otro post.

---

## Cuándo vale la pena configurarlo

Si usas agentes de forma ocasional para tareas cortas, el impacto de RTK es marginal. El overhead de configurarlo no se amortiza.

Si usas agentes regularmente para sesiones largas — investigación de bugs, refactorizaciones, generación de tests — RTK se amortiza rápido. La reducción de tokens tiene efecto directo en coste y en velocidad del bucle del agente.

Mi criterio personal: si una sesión de agente dura más de 30 minutos o implica más de 20 ejecuciones de comandos, RTK está ganando su sitio.

---

## El stack completo

RTK no es una herramienta aislada. Encaja en un stack más amplio que he ido construyendo para trabajar con agentes de forma sostenible:

- **opencode** — el agente que ejecuta el ciclo completo
- **RTK-AI** — reduce el ruido de tokens en cada comando
- **engram** — memoria persistente entre sesiones
- **LM Studio** — modelos locales para tareas rutinarias

Cada pieza ataca un problema diferente del mismo flujo. RTK ataca el coste por sesión. engram ataca la pérdida de contexto entre sesiones. LM Studio ataca el coste por modelo.

Si quieres ver cómo encajan todas juntas en una sesión real, el punto de entrada es [Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos](/es/blog/2026-04-18-agent-era-hybrid-llms-memory).

---

_Este post es parte de una serie sobre el stack de desarrollo con agentes IA que uso en el día a día._

---

_RTK-AI es un proyecto open source creado por [Patrick Szymkowiak](https://github.com/pszymkowiak), con contribuciones de [Florian Bruniaux](https://github.com/FlorianBruniaux) y [Adrien Eppling](https://github.com/aeppling). Puedes encontrar el repositorio, reportar issues y contribuir en [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk)._
