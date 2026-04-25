---
title: 'Por qué la memoria no basta para trabajar con agentes sobre código real'
description: 'La memoria evita que un agente empiece desde cero, pero no resuelve otro problema igual de caro: volver a buscar el mismo código una y otra vez. Esta es la reflexión que me llevó a crear Vectos.'
date: '2026-04-24'
tags: ['ia', 'llm', 'agentes', 'embeddings', 'rag', 'opencode', 'lm-studio', 'engram', 'vectos', 'herramientas-desarrollo', 'dx']
author: 'Miguel Angel de Dios'
slug: 'unified-memory-code-embeddings-local'
featured: true
---

## El problema no era solo la memoria

En los últimos meses he ido montando un stack cada vez más serio para trabajar con agentes:

- **opencode** para investigar, planificar, ejecutar y verificar
- **engram** para no perder decisiones y aprendizajes entre sesiones
- **RTK-AI** para reducir ruido de tokens en comandos y salidas
- **LM Studio** para mover una buena parte del trabajo a modelos locales

Durante un tiempo pensé que el cuello de botella principal era la memoria. Y sí, lo era... pero solo a medias.

Engram resolvía un problema real: que el agente no empezara desde cero en cada sesión.

Pero seguía ahí otro problema igual de costoso, y bastante menos comentado: el agente tenía que **volver a orientarse en el código casi a ciegas** una y otra vez.

Esa necesidad fue la que me llevó a crear **Vectos**: un experimento para recuperar código de forma semántica y evitar que cada tarea empiece con una pequeña expedición inútil por el repo.

---

## La patología de las búsquedas infinitas

Si trabajas con agentes sobre proyectos reales, esta escena te sonará:

```text
1. glob src/**/*
2. grep "auth"
3. grep "modal"
4. leer 6 archivos
5. no era ahí
6. grep otra vez
7. leer 4 archivos más
8. repetir
```

No es que el agente sea inútil. Es que, sin una capa de recuperación semántica de código, su orientación sigue dependiendo de:

- nombres de archivos
- estructura de carpetas
- coincidencias literales
- lectura oportunista de archivos “prometedores”

En un proyecto pequeño esto ya consume tiempo. En uno mediano o grande consume algo peor:

- **tokens**
- **latencia**
- **dinero** si tiras de modelos cloud
- **atención del modelo** en cosas irrelevantes

Y esto no es solo un problema económico. También es cognitivo. Si el modelo entra en una sesión cargado de contexto mediocre, razona peor.

En otras palabras: no solo pagas más. También piensas peor.

---

## Engram me decía qué sabíamos. No me decía dónde estaba el código ahora

Ahí estuvo la clave.

Engram funciona muy bien para guardar:

- decisiones técnicas previas
- bugs ya resueltos
- preferencias del proyecto
- contexto histórico de sesiones anteriores

Eso es valiosísimo. Pero no responde a esta pregunta:

> “Vale, ¿y en qué archivo está ahora mismo la pieza de código que necesito tocar?”

La memoria y el código actual son dos tipos de contexto distintos.

- **Memoria**: qué aprendimos antes
- **Código actual**: qué existe ahora y dónde vive

Durante un tiempo intenté que la memoria cubriera más de lo que realmente podía cubrir. No funcionó.

Porque un bugfix guardado hace dos semanas no sustituye a encontrar hoy el hook, el componente, el test o la función exacta que sigue mandando en el repo actual.

---

## Por eso empecé a construir Vectos

Lo que necesitaba no era más texto almacenado. Necesitaba que el agente pudiera **localizar código relevante semánticamente** antes de empezar a leer archivos al tuntún.

La idea detrás de Vectos era bastante simple:

- indexar el proyecto por chunks útiles
- generar embeddings del código
- preguntar por intención, no solo por texto literal
- devolver solo los fragmentos más prometedores

Lo importante no era la tecnología en sí, sino el cambio de flujo:

```text
Antes:
grep -> glob -> leer -> descartar -> repetir

Después:
buscar por intención -> localizar 3-5 chunks útiles -> leer solo ahí
```

Eso reduce coste, sí. Pero también reduce algo más importante: el bucle de fricción entre tarea, búsqueda y razonamiento.

---

## El coste oculto de redescubrir el repo cada vez

Hay una cosa que me parece especialmente absurda en muchos flujos con IA: usar modelos potentes y caros para repetir trabajo tonto.

No me preocupa pagar cloud por:

- una decisión de arquitectura difícil
- una refactorización delicada
- una revisión compleja
- un bug raro con varias hipótesis

Eso tiene sentido.

Lo que me parece un mal uso del dinero es pagar cloud para que el agente haga por quinta vez esta secuencia:

- localizar dónde está el modal
- localizar el hook relacionado
- descubrir otra vez cómo se conecta al store
- leer archivos irrelevantes por el camino

Ese trabajo no debería recaer una y otra vez en el modelo más caro del bucle.

Debería recaer en una capa más barata, más local y más especializada: una capa de recuperación de código.

---

## La idea que me interesa abrir

Creo que en tooling para IA hablamos mucho de memoria, mucho de modelos y mucho de agentes... pero todavía poco de este problema intermedio:

**la búsqueda repetitiva y torpe del código como fuente continua de coste, latencia y ruido cognitivo.**

No todo se arregla con mejores prompts.
No todo se arregla con más contexto.
No todo se arregla con modelos más grandes.

A veces la mejora viene de algo menos glamuroso:

- orientar mejor
- recuperar menos, pero mejor
- pagar solo por el razonamiento que de verdad importa

Ese, más que ningún otro, fue el punto de partida de Vectos.

En el siguiente post entro en lo práctico: qué es exactamente, cómo funciona y qué decisiones tomé para que de verdad resulte útil trabajando con agentes sobre repos reales.

---

_Posts anteriores de la serie:_

- [Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos](/es/blog/2026-04-18-agent-era-hybrid-llms-memory)
- [LLMs locales sin excusas: LM Studio y opencode](/es/blog/2026-04-19-local-llms-lm-studio-opencode-llmfit)
- [RTK-AI a fondo: cómo reducir el consumo de tokens un 80% con agentes](/es/blog/2026-04-21-rtk-ai-token-optimization-agents)
- [Vectos: qué es, cómo funciona y por qué lo estoy construyendo](/es/blog/2026-04-25-vectos-semantic-code-retrieval-agents)
