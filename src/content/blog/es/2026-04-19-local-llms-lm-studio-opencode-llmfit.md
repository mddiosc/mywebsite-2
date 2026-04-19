---
title: 'LLMs locales sin excusas: LM Studio y opencode'
description: 'Cuando las suscripciones de Claude y OpenAI se encarecieron demasiado, ya tenia el hardware. Esta es la historia de pasar de cero a un stack LLM local funcionando — incluyendo los errores por el camino.'
date: '2026-04-19'
tags: ['ia', 'llm', 'llm-local', 'lm-studio', 'opencode', 'herramientas-desarrollo', 'dx']
author: 'Miguel Angel de Dios'
slug: 'local-llms-lm-studio-opencode-llmfit'
featured: false
---

## El detonante

Los costes de las suscripciones de Claude y OpenAI llevaban meses subiendo. La facturación por token en sesiones largas con agentes se acumula más rápido de lo que parece, y en algún momento el total mensual dejó de tener sentido para el tipo de tareas rutinarias que componen la mayor parte de un día de desarrollo.

La ironía era que ya tenía el hardware. Mi estación de trabajo llevaba meses casi sin usarse entre sesiones de juego:

- **CPU:** Intel Core i7-12700K (12ª Gen, 20 núcleos)
- **RAM:** 31.1 GB
- **GPU:** NVIDIA GeForce RTX 5060 Ti — 15.9 GB VRAM, CUDA

Con 15.9 GB de VRAM podía ejecutar modelos locales con cierta entidad. La pregunta no era si _podía_ — era _cómo conseguir que esto funcione bien_.

Este post es una continuación de [Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos](/es/blog/2026-04-18-agent-era-hybrid-llms-memory). El concepto de enrutamiento híbrido está allí. Aquí me centro en la parte local específicamente.

---

## ¿Por dónde empiezo?

El ecosistema de LLMs locales está fragmentado. La primera vez que buscas cómo ejecutar modelos en local encuentras Ollama, LM Studio, LiteLLM, llama.cpp, text-generation-webui, vLLM — y ninguna respuesta clara sobre cuál usar.

Mi instinto inicial fue Ollama. Es lo más recomendado en los sitios que leo, la instalación es simple y funcionaba de inmediato para inferencia básica. Lo instalé, descargué un par de modelos e intenté conectarlo con opencode.

Ahí empezaron los problemas.

---

## El problema con Ollama

Ollama expone los modelos a través de su propio formato de API. Es ampliamente compatible, pero _ampliamente_ no es lo mismo que _completamente_.

Cuando conecté opencode a Ollama, los modelos respondían — pero el tool calling estaba roto de formas sutiles. Los modelos recibían la definición de la herramienta correctamente pero luego alucinaban el formato de llamada, devolvían JSON malformado, o simplemente ignoraban la herramienta y producían una respuesta narrativa en su lugar. No es exactamente un bug de Ollama — es un gap de compatibilidad entre cómo Ollama expone los esquemas de herramientas y lo que esperan herramientas como opencode.

Pasé un par de tardes intentando que funcionara: ajustando system prompts, parámetros de modelo, opciones de API. Los resultados eran inconsistentes. Algunas tareas funcionaban, otras no, y no había forma predecible de saber cuáles.

Entonces empecé a mirar las alternativas con más atención.

---

## Por qué LM Studio

LM Studio resolvió el problema de compatibilidad con un enfoque diferente: su servidor local está diseñado explícitamente para ser **completamente compatible con OpenAI** — mismo esquema, mismo formato de tool calling, misma estructura de respuesta. No aproximadamente compatible. Realmente compatible.

La diferencia se notó de inmediato. Conecté opencode a LM Studio y las llamadas a herramientas funcionaron a la primera.

Pero la compatibilidad no fue lo único. La GUI me sorprendió. Cuando abres LM Studio no te muestra simplemente una lista de todos los modelos disponibles — filtra y destaca los que son realmente adecuados para tu hardware específico. Con mi presupuesto de VRAM, muestra los modelos que puedo ejecutar bien y marca los que van a tener problemas. Eso solo ahorra mucho ensayo y error.

Y luego está el CLI. El comando `lms` te da todo lo que necesitas para controlar LM Studio desde el terminal:

```bash
lms ls          # listar modelos descargados
lms ps          # ver qué está cargado ahora mismo
lms load <modelo> --gpu max   # cargar un modelo maximizando el uso de GPU
lms server start --port 1234  # arrancar el servidor compatible con OpenAI
```

La mejor descripción que se me ocurre es: Ollama con GUI y compatibilidad OpenAI real. Encajó.

---

## Instalación

LM Studio se distribuye como AppImage en Linux. Se descarga desde [lmstudio.ai](https://lmstudio.ai), se le dan permisos de ejecución y listo:

```bash
chmod +x LM_Studio-*.AppImage
./LM_Studio-*.AppImage
```

El CLI companion se instala por separado:

```bash
npm install -g @lmstudio/lms
lms --version
```

Una vez que LM Studio está corriendo, los modelos se descargan desde la pestaña **Discover**. La interfaz muestra los requisitos estimados de VRAM y marca los modelos que tu hardware puede ejecutar bien. Para mi RTX 5060 Ti, los modelos en el rango de 7B–20B a cuantización Q4 caben cómodamente. Los más grandes — como `qwen/qwen3.6-35b-a3b` a 22 GB — hacen offload parcial a CPU, lo que funciona pero es notablemente más lento.

Mi stack actual:

| Modelo                                | Parámetros | Tamaño en disco |
| ------------------------------------- | ---------- | --------------- |
| `google/gemma-4-26b-a4b`              | 26B MoE    | 17.99 GB        |
| `google/gemma-4-e4b`                  | 7.5B       | 6.33 GB         |
| `mistralai/ministral-3-14b-reasoning` | 14B        | 9.12 GB         |
| `openai/gpt-oss-20b`                  | 20B        | 12.11 GB        |
| `qwen/qwen3.6-35b-a3b`                | 35B MoE    | 22.07 GB        |

Cuál uso depende de la tarea. No hay un modelo fijo por defecto — cargo el que encaja con el trabajo.

---

## Exponer el servidor en la red local

Por defecto el servidor de LM Studio escucha en `localhost`. Eso está bien si solo lo usas desde la misma máquina — pero yo también quiero acceder desde el portátil en la misma red.

Para exponerlo en la red local, se arranca el servidor vinculado a `0.0.0.0` en lugar de localhost:

```bash
lms server start --port 1234 --host 0.0.0.0
```

Desde cualquier otra máquina en la misma red, el endpoint es la IP local de la estación de trabajo:

```bash
curl http://192.168.1.XX:1234/v1/models
```

Una cosa a tener en cuenta: vincular a `0.0.0.0` significa que cualquier dispositivo de la red puede alcanzar el servidor. Si eso preocupa, se puede restringir el acceso a nivel de firewall para IPs específicas. En una red doméstica generalmente está bien así.

Si quieres que el servidor arranque automáticamente al inicio, un servicio systemd simple funciona bien:

```ini
[Unit]
Description=LM Studio server
After=network.target

[Service]
ExecStart=/usr/bin/lms server start --port 1234 --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## Conectar con opencode

Como LM Studio habla el formato OpenAI nativo, opencode se conecta a él mediante una configuración de proveedor estándar. La configuración vive en `~/.config/opencode/opencode.json` y registra LM Studio como un proveedor con nombre junto al resto de proveedores que ya tengas — cloud o no:

```json
{
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://192.168.1.XX:1234/v1",
        "apiKey": ""
      },
      "models": {
        "mistralai/ministral-3-14b-reasoning": {
          "name": "Ministral 3 14B Reasoning",
          "contextLength": 65536
        },
        "qwen/qwen3.6-35b-a3b": {
          "name": "Qwen3.6 35B A3B",
          "contextLength": 32768
        },
        "google/gemma-4-26b-a4b": {
          "name": "Gemma 4 26B A4B",
          "contextLength": 16384
        },
        "google/gemma-4-e4b": {
          "name": "Gemma 4 E4B",
          "contextLength": 131072
        },
        "openai/gpt-oss-20b": {
          "name": "GPT-OSS 20B",
          "contextLength": 65536
        }
      }
    }
  }
}
```

Es una configuración global, no por proyecto. opencode ya tiene conectores propios para otros proveedores — Anthropic, OpenAI, etc. — y conviven en el mismo fichero. La ventaja práctica es que durante una sesión puedo cambiar manualmente entre un modelo local y uno cloud según lo que esté haciendo en cada momento. Sin variables de entorno, sin reiniciar nada — simplemente elijo el modelo para la tarea que tengo entre manos.

---

## Cómo es una sesión real

```text
Inicio de sesión
├── lms server start --port 1234 --host 0.0.0.0 (si no está corriendo)
├── lms load <modelo-para-esta-tarea> --gpu max
└── comprobar que config.json apunta al modelo correcto

Sesión de opencode
├── lee la estructura del proyecto
├── planifica tareas
├── ejecuta contra el LLM local via el endpoint configurado
├── corre tests, comprueba salida
└── propone mensaje de commit

Si la tarea es demasiado compleja para el modelo local
└── cambiar de proveedor manualmente dentro de la misma sesión — los modelos cloud están en el mismo config
```

El cambio es manual e intencionado. Como opencode tiene conectores nativos para múltiples proveedores y todos conviven en el mismo config global, cambiar de modelo a mitad de sesión es simplemente cuestión de seleccionar otro. Lo hago según lo que esté trabajando: local para ediciones rutinarias y generación de código, cloud cuando necesito razonamiento más profundo o una ventana de contexto más amplia.

---

## Los compromisos reales

**Velocidad** — los modelos que caben enteros en VRAM son rápidos. Los que hacen offload a CPU, no. `qwen3.6-35b-a3b` a 22 GB en una GPU de 15.9 GB significa capas en CPU, lo que añade latencia real. Solo lo cargo cuando la tarea lo justifica.

**Techo de calidad** — los modelos locales son buenos. No son `claude-opus-4-5`. Para decisiones de arquitectura o tareas que necesitan razonamiento profundo sobre un contexto amplio, cloud sigue teniendo ventaja. Localmente cubro aproximadamente el 70-80% de mi trabajo diario bien.

**Privacidad** — nada sale de la máquina. Para código con credenciales, lógica de negocio interna, o cualquier cosa que no querría enviar a un tercero, local es la única opción con la que me siento cómodo.

**Coste** — unos vatios por hora. Un día entero de inferencia local cuesta menos que una sola sesión pesada con la API cloud.

---

## Próximos pasos

El enrutamiento automático de modelos según el tipo de tarea es lo siguiente obvio — dejar que el tooling decida qué modelo cargar en lugar de hacerlo yo manualmente. Eso haría que el stack local fuera realmente fluido en lugar de simplemente funcional.

También: LM Studio también descargó un modelo `text-embedding-nomic-embed-text-v1.5` que uso para recuperación de memoria en el setup del agente. Hay potencial para usarlo en selección de contexto inteligente antes del prompt — extrayendo solo las secciones relevantes del codebase en lugar de pasarlo todo. Eso es otro post.

---

_Post anterior de la serie: [Agentes IA para desarrollo real: opencode, memoria y LLMs híbridos](/es/blog/2026-04-18-agent-era-hybrid-llms-memory)._
