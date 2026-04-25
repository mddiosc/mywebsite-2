---
title: 'Vectos: qué es, cómo funciona y por qué lo estoy construyendo'
description: 'Después de detectar el coste real de las búsquedas repetidas en repos con agentes, construí Vectos como una capa de recuperación semántica de código. Este es el resumen práctico de qué hace, cómo lo hace y en qué estado está hoy.'
date: '2026-04-25'
tags: ['ia', 'llm', 'agentes', 'embeddings', 'rag', 'vectos', 'mcp', 'herramientas-desarrollo', 'dx']
author: 'Miguel Angel de Dios'
slug: 'vectos-semantic-code-retrieval-agents'
featured: true
---

## Qué es Vectos

En el post anterior contaba el problema que me empujó a construirlo: trabajar con agentes sobre repos reales implica demasiadas búsquedas repetidas, demasiadas lecturas inútiles y demasiado gasto absurdo en tokens.

`Vectos` nace para atacar exactamente esa parte del flujo.

Dicho de forma simple, es una capa de **recuperación semántica de código** pensada para que un agente pueda localizar antes el contexto útil de un proyecto y deje de redescubrir el repo en cada tarea.

No intenta sustituir al modelo.
No intenta ser memoria histórica.
No intenta “entender todo el proyecto” mágicamente.

Intenta hacer algo más práctico: orientar mejor.

Ahora mismo además lo considero **experimental**. Ya es funcional y lo estoy usando de verdad, pero sigue en construcción y voy añadiendo capacidades según detecto fricción real en el trabajo con agentes. No lo presento como algo cerrado, sino como una herramienta que ya aporta valor y todavía tiene bastante margen para mejorar.

El repositorio está aquí por si quieres seguirlo o probarlo:

- [github.com/mddiosc/vectos](https://github.com/mddiosc/vectos)

---

## Qué hace exactamente

La idea base es sencilla:

1. indexar archivos útiles del proyecto
2. partir el código en chunks razonables
3. generar embeddings
4. permitir búsquedas por intención
5. devolver primero el código más prometedor

Pero lo importante es aterrizar qué significa eso en la práctica.

Cuando un agente necesita resolver una tarea, Vectos puede actuar como una capa previa de orientación:

- indexa el proyecto localmente
- guarda una representación vectorial de fragmentos de código
- acepta consultas semánticas del tipo “dónde se une X con Y” o “qué parte controla este flujo”
- devuelve los archivos o chunks con más probabilidad de ser relevantes

Eso cambia el punto de partida del agente. Y ese detalle, que parece pequeño sobre el papel, en la práctica cambia bastante el tipo de contexto con el que el modelo empieza a razonar.

En vez de arrancar con:

```text
glob -> grep -> leer -> descartar -> repetir
```

puede arrancar con algo más parecido a esto:

```text
buscar por intención -> recuperar 3-5 trozos relevantes -> leer solo ahí
```

No elimina por completo la exploración. Pero la hace mucho más corta, más barata y más útil.

### Mini ejemplo

Imagina que estás en un repo mediano y le pides a un agente algo como esto:

```text
Find where project and case-study content get merged for the page.
```

Sin una capa como Vectos, lo normal es que el agente empiece a encadenar búsquedas literales, abra varios archivos “posibles” y tarde bastantes pasos en llegar al punto correcto.

Con Vectos en medio, el flujo puede ser mucho más corto:

1. el agente consulta Vectos vía MCP con esa intención
2. Vectos devuelve los chunks más prometedores
3. el agente lee solo esos archivos antes de razonar o editar

Ese tipo de recorte no parece espectacular visto como una sola acción, pero repetido durante todo el día acaba marcando mucho la diferencia en tiempo, coste y limpieza de contexto.

---

## Cómo lo hace

Aquí estaba una parte importante del reto. No era suficiente con “tener embeddings”. Había que decidir qué indexar, cómo partirlo y cómo reducir ruido para que la recuperación sirviera de verdad.

Las decisiones más importantes han sido estas.

### 1. Indexar menos, pero mejor

Una de las primeras lecciones fue que indexar más cosas no siempre mejora nada.

Si metes demasiados archivos de poco valor semántico, el índice se llena de ruido y la recuperación empeora. Por eso tiene más sentido priorizar código accionable y excluir parte del material que añade volumen sin añadir señal.

### 2. Chunking mejor para TypeScript y React

No es lo mismo partir texto plano que partir código con componentes, hooks, funciones exportadas o tests.

Por eso una parte importante del trabajo ha sido mejorar cómo se trocea y describe código de TypeScript y React, para que el índice refleje mejor las unidades que un agente realmente necesita localizar.

### 3. Reindexado incremental

Si cada cambio obliga a reindexar el proyecto entero, la experiencia se rompe enseguida.

Vectos ya soporta reindexado incremental para que puedas actualizar solo las partes que han cambiado. Ese detalle importa mucho más de lo que parece cuando lo metes en el flujo diario de desarrollo.

### 4. MCP para integrarlo con agentes

Otra parte importante es que no quería que fuera solo una utilidad aislada en CLI.

Vectos expone capacidades vía **MCP**, de modo que agentes como OpenCode puedan usarlo directamente como herramienta de recuperación semántica dentro de su flujo normal.

Eso me parece importante porque la utilidad no está solo en indexar, sino en que el agente pueda preguntar y recuperar código relevante sin salir de la sesión de trabajo. Para mí, ahí es donde deja de ser una demo técnica y empieza a parecer una pieza útil del flujo real.

---

## Qué ahorro aporta realmente

Aquí quiero ser prudente: todavía no quiero vender cifras absolutas universales porque depende muchísimo del repo, del modelo y del tipo de tarea.

Pero sí tengo ya una intuición bastante clara de dónde aparece el ahorro.

El ahorro no viene de “hacer magia”. Viene de reducir:

- búsquedas repetidas
- lecturas de archivos irrelevantes
- contexto mediocre enviado al modelo
- uso de modelos cloud caros para trabajo de orientación

En validaciones reales ya he visto una mejora muy clara en calidad de recuperación al reducir ruido del índice.

Por ejemplo, en uno de los proyectos donde lo probé, pasar de indexar demasiadas cosas a priorizar señal útil redujo el índice desde aproximadamente `16227` chunks a `1567`, y la recuperación mejoró de forma material para consultas reales.

Eso no significa automáticamente “10x menos coste” en todos los casos. Pero sí apunta a algo importante: cuando reduces el ruido, el agente necesita menos pasos tontos para llegar al código que importa.

Mi hipótesis de producto es esta:

- si reduces exploración ciega, reduces tokens
- si reduces tokens irrelevantes, reduces coste
- si mejoras el contexto inicial, mejoras también la calidad del razonamiento posterior

No es solo una optimización económica. Es también una optimización cognitiva del flujo.

---

## Cómo encaja con Engram

Aquí creo que la distinción correcta es bastante simple.

`Engram` responde a:

> “¿Qué aprendimos antes?”

`Vectos` responde a:

> “¿Dónde está ahora el código relevante?”

No compiten. Se complementan.

Si usas ambos, el flujo mejora mucho:

1. recuperas memoria previa
2. recuperas código actual relevante
3. lees solo lo necesario
4. guardas nuevos aprendizajes

Pero si usas solo `Vectos`, sigue teniendo sentido. Esa independencia me parece importante.

---

## Qué problema resuelve y cuál no

Lo que sí resuelve:

- reduce lecturas inútiles
- reduce búsquedas repetitivas
- reduce gasto tonto en tokens
- mejora la orientación del agente al principio de una tarea
- da una vía más práctica para conectar búsqueda semántica y agentes vía MCP

Lo que no resuelve:

- no sustituye el razonamiento del modelo
- no reemplaza pruebas, validación o criterio técnico
- no convierte cualquier búsqueda vaga en contexto perfecto
- no reemplaza memoria histórica de producto o decisiones previas

Me interesa mucho esa frontera porque evita vender humo. La utilidad real de una herramienta así no está en prometer magia, sino en quitar fricción donde más se repite.

---

## En qué estado está ahora

Ahora mismo lo veo como un producto **experimental pero ya bastante funcional**.

Tiene sentido usarlo, probarlo y trabajar con él en proyectos reales. Pero también está claro que todavía hay margen para seguir refinando:

- calidad del chunking
- cobertura por lenguajes
- reindexado y mantenimiento del índice
- ergonomía para agentes y MCP
- calidad de recuperación en distintos tipos de repos

Esa es precisamente la parte interesante de construirlo en público: no partir de una promesa abstracta, sino de una fricción concreta e ir mejorándolo contra casos reales.

---

## Lo que me interesa validar

Ahora mismo lo que más me interesa no es solo que Vectos “funcione”, sino validar si esta capa intermedia realmente mejora el trabajo con agentes en proyectos reales.

La pregunta no es únicamente técnica.

También es de producto:

> ¿merece la pena tener una capa específica de recuperación de código para reservar el contexto y los tokens caros para el razonamiento que de verdad importa?

Mi impresión es que sí.

Y cuanto más trabajo con agentes, más me convence esta idea: una parte muy grande del coste no está en pensar, sino en orientarse mal.

Si te interesa probarlo o seguir su evolución, el repo es este:

- [github.com/mddiosc/vectos](https://github.com/mddiosc/vectos)

---

_Relacionado:_

- [Por qué la memoria no basta para trabajar con agentes sobre código real](/es/blog/2026-04-24-unified-memory-code-embeddings-local)
