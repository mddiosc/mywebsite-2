---
slug: vectos
title: 'Vectos: motor local de contexto de código para agentes de IA'
summary: 'Un motor local-first que indexa código fuente en bases SQLite por proyecto, genera embeddings y expone búsqueda semántica sobre MCP para que los agentes de IA recuperen código relevante sin exploración repetitiva de archivos.'
published: '2026-04-25'
featured: true
role: 'Creador / Product Owner'
status: 'Experimental, funcional y en desarrollo activo'
outcomes:
  - 'Recuperación híbrida: búsqueda semántica con cosine similarity + fallback textual'
  - 'Modelo de doble índice: bases separadas para código y documentación por proyecto'
  - 'Integración MCP con herramientas search_code, search_docs e index_project'
  - 'Soporte para workspaces Nx: resolución automática de dependencias en monorepos'
  - 'Reindexado incremental para feedback rápido durante el desarrollo'
repoName: vectos
relatedPosts:
  - 'vectos-semantic-code-retrieval-agents'
  - 'unified-memory-code-embeddings-local'
---

## Contexto

Trabajar con agentes de IA sobre repositorios reales reveló un patrón costoso: demasiadas búsquedas repetidas, demasiadas lecturas inútiles y demasiado gasto de tokens en exploración en lugar de razonamiento.

`Vectos` se construyó para eliminar esa fricción. Es un **motor de contexto de código local-first** que indexa código fuente en bases de datos SQLite por proyecto, genera embeddings para fragmentos de código y expone búsqueda estructurada sobre MCP — para que los agentes recuperen contexto relevante sin redescubrir el repositorio en cada tarea.

No sustituye al razonamiento del modelo ni es un sistema de memoria histórica. Es una herramienta de orientación enfocada — experimental, ya funcional y en desarrollo activo.

## Qué hace

```text
# Instalar
curl -fsSL https://github.com/mddiosc/vectos/releases/latest/download/install.sh | sh

# Indexar y buscar
vectos index .
vectos search "flujo de pago checkout"

# Índice separado de documentación (README, ADRs, etc.)
vectos index . --docs
vectos search --docs "referencia de la API"

# Conectar un cliente agente
vectos setup opencode
```

En lugar del bucle típico del agente:

```text
glob → grep → leer → descartar → repetir
```

Vectos permite una alternativa más ajustada:

```text
buscar por intención → recuperar 3–5 trozos relevantes → leer solo ahí
```

## Arquitectura

### Modelo de almacenamiento

Vectos almacena todo en bases SQLite por proyecto bajo `~/.vectos/projects/`. Cada fragmento indexado incluye:

- Texto original del código
- Ruta del archivo y rangos de línea
- Lenguaje y categoría (`source`, `infra_config`, `scripts`, `docs`, `dependency_metadata`)
- Vector de embedding (proveedor configurable)

### Modelo de doble índice

| Base de datos          | Contenido                             | Búsqueda       |
| ---------------------- | ------------------------------------- | -------------- |
| `<proyecto>.db`        | Código fuente                         | `search_code`  |
| `<proyecto>-docs.db`   | Documentación (README, ADRs, guías)   | `search_docs`  |

Los índices de código y documentación coexisten sin contaminarse entre sí, compartiendo el mismo alcance de proyecto.

### Recuperación híbrida

1. Embeber la consulta con el proveedor configurado
2. Ordenar fragmentos por cosine similarity
3. Retroceder a búsqueda textual si la recuperación semántica falla o no devuelve resultados
4. Preservar el alcance del proyecto y los metadatos de categoría en los resultados

Si el proveedor, modelo o dimensiones del embedding cambian, Vectos detecta la incompatibilidad y notifica que se requiere reindexado — nunca mezcla embeddings de proveedores distintos.

### Estrategia de chunking

- **Go**: límites orientados a funciones
- **TypeScript/React**: funciones exportadas, hooks, componentes, clases y bloques de tests cuando son derivables
- **Fallback**: chunking genérico para lenguajes sin soporte específico

### Soporte para workspaces Nx

Vectos detecta workspaces Nx y resuelve automáticamente el alcance lógico del proyecto:

```bash
vectos index --project app-main .
```

Resuelve el proyecto seleccionado más sus dependencias internas a través del grafo de Nx, excluyendo proyectos auxiliares (`e2e`, `storybook`, `docs`) por defecto.

### Reindexado incremental

Solo los archivos modificados se reindexan. Los metadatos del índice (proveedor, modelo, dimensiones) se almacenan junto a cada base de datos, por lo que la compatibilidad se verifica antes de cada recuperación.

## Integración MCP

Vectos expone sus capacidades sobre **MCP** (Model Context Protocol):

| Herramienta        | Propósito                                                  |
| ------------------ | ---------------------------------------------------------- |
| `search_code`      | Búsqueda semántica + textual sobre código fuente           |
| `search_docs`      | Búsqueda semántica sobre documentación                     |
| `index_project`    | Indexado completo o incremental con flag opcional de docs  |

Agentes como OpenCode, Claude y Codex se conectan mediante `vectos setup <cliente>` y consultan el índice directamente sin salir de su sesión de trabajo.

## Cómo encaja con Engram

`Engram` responde a: "¿Qué aprendimos antes?"

`Vectos` responde a: "¿Dónde está ahora el código relevante?"

Se complementan en un flujo recomendado:

1. Recuperar memoria previa (Engram)
2. Recuperar código actual (Vectos)
3. Leer solo archivos relevantes
4. Guardar nuevos aprendizajes (Engram)

Pero Vectos funciona de forma independiente. Es un producto completo y autónomo, sin dependencia de Engram ni de ningún otro sistema de memoria de sesión.

## Qué resuelve y qué no

**Resuelve:**

- Reduce lecturas inútiles y búsquedas repetitivas
- Reduce gasto absurdo de tokens en exploración ciega del código
- Mejora la orientación del agente antes de empezar a razonar
- Ofrece un puente práctico entre búsqueda semántica y flujos con agentes vía MCP

**No resuelve:**

- No sustituye el razonamiento del modelo, las pruebas ni el criterio técnico
- No convierte cualquier búsqueda vaga en contexto perfecto
- No reemplaza la memoria histórica de producto (ese es el dominio de Engram)

## Estado actual

Vectos es experimental pero funcional para proyectos reales. Áreas de desarrollo activo:

- Calidad del chunking para más lenguajes
- Ergonomía del reindexado y mantenimiento del índice
- Profundidad de integración MCP y descubribilidad de herramientas
- Calidad de recuperación en distintos tipos de repositorio y patrones monorepo

## Lecciones clave

1. **Indexar menos, pero mejor** — filtrar archivos de baja señal mejora la recuperación más que indexarlo todo. En pruebas reales, reducir el ruido de ~16K a ~1.5K chunks mejoró la calidad de forma material.
2. **La orientación es un coste oculto enorme** — una gran parte del gasto en tokens en flujos con agentes se va en encontrar código, no en razonar sobre él.
3. **MCP convierte una utilidad en un componente del flujo** — el valor real no está solo en indexar, sino en permitir que los agentes recuperen código sin perder el contexto.
4. **El diseño standalone-first importa** — Vectos funciona bien por sí solo; Engram es un complemento opcional, no un requisito.
