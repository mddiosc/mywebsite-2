---
title: 'Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos'
description: 'Como empece a usar agentes autonomos como opencode y rtk-ai, combinados con LLMs locales y cloud y memoria persistente via engram, para gestionar flujos de desarrollo completos sin perder contexto.'
date: '2026-04-18'
tags: ['ia', 'llm', 'agentes', 'opencode', 'engram', 'llm-local', 'herramientas-desarrollo', 'dx']
author: 'Miguel Angel de Dios'
slug: 'agent-era-hybrid-llms-memory'
featured: true
---

## Por que deje de usar la IA solo para autocompletar

Durante mucho tiempo mi uso de IA era simple: aceptar una sugerencia con tab, pedir un snippet al chat, copiar y pegar.

Funciona. Pero escala mal.

En cuanto una tarea implica mas de un archivo, mas de una decision, o mas de una sesion — ese flujo se rompe. Pierdes contexto. Vuelves a explicar lo mismo. Pegas el mismo error tres veces.

El cambio que lo transformo para mi fue pasar de _IA como asistente_ a _IA como agente_.

---

## Lo que significa un agente en la practica

No es un chatbot. No es un autocompletado.

Un agente es un sistema que recibe un objetivo y ejecuta un ciclo completo para conseguirlo:

1. **Investigar** — lee el codebase antes de tocar nada (`glob`, `grep`, lecturas de archivos).
2. **Planificar** — divide el objetivo en tareas concretas (`todo-write`), no un prompt enorme.
3. **Ejecutar** — lanza comandos, edita archivos, instala paquetes, pasa tests.
4. **Verificar** — revisa la salida en cada paso y decide si continuar o reintentar.

La diferencia clave: no se detiene en la sugerencia. Actua.

`opencode` es la herramienta que hizo que esto encajase para mi. CLI-first, navega tu proyecto, propone un plan y lo ejecuta. Pregunta cuando necesita una decision humana. Si no, sigue adelante.

---

## El problema de la memoria

Esto es lo que rompe la mayoria de setups con agentes: no tienen memoria persistente.

Cada sesion empieza desde cero. El agente redescubre los mismos patrones, choca contra las mismas paredes y no recuerda por que tomaste una decision hace dos horas. Para tareas cortas, bien. Para cualquier cosa que abarque varias sesiones — una feature, una refactorizacion, una investigacion de bug — es un problema real.

`engram` resuelve esto.

Despues de un descubrimiento relevante, el agente lo guarda:

```bash
mem_save \
  --title "Fix CORS en /api/auth" \
  --type bugfix \
  --content "What: añadido credentials:true en fetch y actualizado origin en config CORS de express.
Why: Safari bloqueaba las peticiones preflight silenciosamente.
Where: src/api/server.ts, src/hooks/useAuth.ts
Learned: Safari trata CORS con credenciales diferente a Chrome."
```

En la siguiente sesion, antes de empezar:

```bash
mem_context --project my-app --limit 10
mem_search "CORS auth Safari"
```

El agente ahora sabe que se intento, que funciono y por que. Esa es la diferencia entre una herramienta y algo que acumula conocimiento de verdad.

---

## RTK: recortando el consumo de tokens antes de que sea un problema

Algo que te pilla desprevenido cuando trabajas con agentes: la factura de tokens.

Los agentes ejecutan muchos comandos — `git log`, `npm install`, `tsc --noEmit`, runners de tests. El output bruto de esos comandos es verboso. Pasarselo todo al LLM en cada paso es un desperdicio y ralentiza el bucle.

Esto es exactamente lo que resuelve `rtk-ai` (RTK — Rust Token Killer).

RTK es un proxy CLI de alto rendimiento que se coloca entre tus comandos y el LLM. Filtra y comprime el output de los comandos antes de que llegue al modelo — reduciendo el consumo de tokens entre un **60–90%** en la practica.

Se integra directamente en Claude Code via un hook:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/Users/yourname/.claude/hooks/rtk-rewrite.sh"
          }
        ]
      }
    ]
  }
}
```

Una vez configurado, cada comando Bash que ejecute el agente pasa por RTK automaticamente. Tambien puedes ver cuanto estas ahorrando:

```bash
rtk gain              # ahorro total de tokens hasta ahora
rtk gain --history    # desglose por comando
rtk discover          # encuentra comandos que RTK aun no cubre
```

Y si necesitas debuggear el output bruto sin filtrar:

```bash
rtk proxy git log --oneline -20
```

En una sesion larga de agente — investigando un codebase, pasando tests, chequeando tipos — RTK marca una diferencia real. Menos ruido llegando al modelo significa respuestas mas rapidas, menor coste y menos contaminacion del contexto.

---

## LLMs hibridos: gastando tokens donde importa

No toda tarea necesita el modelo mas potente.

Pasar todo por Claude o GPT es como contratar a un arquitecto senior para renombrar una variable. Funciona. Tambien es innecesario.

Un routing practico:

```json
{
  "models": {
    "default": "lmstudio/qwen/qwen3.6-35b-a3b",
    "complex": "anthropic/claude-opus-4-5",
    "fast": "lmstudio/google/gemma-4-e4b"
  },
  "routing": {
    "simple_edit": "default",
    "architecture": "complex",
    "explanation": "fast"
  }
}
```

Ejecuto los modelos locales via **LM Studio**. Mi stack actual:

| Modelo                                | Params  | Uso                                                              |
| ------------------------------------- | ------- | ---------------------------------------------------------------- |
| `qwen/qwen3.6-35b-a3b`                | 35B MoE | Caballo de batalla principal — buen equilibrio calidad/velocidad |
| `google/gemma-4-26b-a4b`              | 26B MoE | Tareas locales con razonamiento mas exigente                     |
| `google/gemma-4-e4b`                  | 7.5B    | Respuestas rapidas, tareas ligeras                               |
| `mistralai/ministral-3-14b-reasoning` | 14B     | Razonamiento estructurado, problemas paso a paso                 |
| `openai/gpt-oss-20b`                  | 20B     | Generacion de codigo, actualmente cargado por defecto            |

**Modelos locales** para:

- Linting y formateo
- Refactorizaciones y renombrados simples
- Generacion de boilerplate
- Cualquier cosa con datos sensibles que no puede salir de la maquina

**Modelos cloud** para:

- Decisiones de arquitectura
- Refactorizaciones multi-archivo con dependencias complejas
- Generacion de suites de tests completas
- Requisitos ambiguos que necesitan razonamiento real

El beneficio no es solo el coste. Los modelos locales responden en milisegundos. Eso mantiene el bucle del agente agil en los pasos simples.

### Guia rapida de proveedores

| Proveedor                      | Mejor para                                           |
| ------------------------------ | ---------------------------------------------------- |
| Claude (Anthropic)             | Contexto largo, seguimiento preciso de instrucciones |
| GPT (OpenAI)                   | Velocidad, generacion de codigo solida               |
| Gemini (Google)                | Tareas de investigacion, contexto masivo             |
| Qwen 3.6 / GPT-OSS 20B (local) | Tareas rutinarias, datos privados, coste cero        |

---

## Como es una sesion completa

```text
Inicio de sesion
├── mem_context()           ← recuperar estado anterior
├── mem_search("tema X")   ← revisar lo que ya intentamos

├── opencode: investigar (glob, grep, lecturas)
├── opencode: planificar (todo-write)

└── por tarea:
    ├── LLM local si es simple (qwen3.6, gemma-4-e4b, gpt-oss-20b)
    ├── Claude/GPT si es complejo
    ├── ejecutar y verificar
    └── mem_save() si merece guardarse
```

Reviso el plan antes de ejecutar. Apruebo, ajusto si hace falta, luego monitorizo. La carga cognitiva pasa de "escribir cada linea" a "definir el objetivo con claridad y revisar el resultado de forma critica".

Es una habilidad diferente. Resulta que tambien es mas interesante.

---

## Lo que cambia de verdad

No va de reemplazar desarrolladores.

Va de cambiar en que gastas tu tiempo.

Las habilidades que ahora importan mas:

- Definir objetivos con precision — los prompts vagos producen codigo vago
- Revisar el output con criterio — confiar pero verificar, siempre
- Diseñar el setup del agente — herramientas, modelos, estrategia de memoria
- Construir los bucles de feedback — tests y CI que pillen lo que el agente falla

El agente escribe el codigo. Tu escribes la especificacion, las restricciones y el listón de calidad.

---

Si quieres profundizar, en un siguiente post puedo compartir un setup practico para correr `opencode` con modelos locales de LM Studio y memoria engram en un proyecto React real.
