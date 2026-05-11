---
title: 'OpenClaw: mi agente personal con Mac Mini M4, Ollama Cloud y Telegram'
description: 'Una semana con OpenClaw: cómo corre un asistente de IA en Mac Mini M4 con Ollama Cloud (Qwen 397B), Telegram como interfaz, y Obsidian para notas personales. Primeras impresiones y casos de uso reales.'
date: '2026-05-12'
tags: ['ia', 'openclaw', 'agentes', 'mac-mini', 'ollama', 'telegram', 'obsidian', 'asistente-personal']
author: 'Miguel Angel de Dios'
slug: 'openclaw-personal-agent-mac-mini-ollama-cloud-telegram'
featured: true
---

## Hace una semana instalé OpenClaw

No tenía muchas expectativas. Tenía un Mac Mini M4 encendido 24/7, una suscripción a Ollama Cloud, y curiosidad de qué pasaría si construía mi propio asistente en lugar de usar ChatGPT o Claude directamente.

Tras una semana, aquí está la experiencia.

OpenClaw es un gateway que vive en tu máquina. Actúa como puente entre canales de mensajería (Telegram, WhatsApp, Discord...) y agentes de IA. La idea es simple: escribes en Telegram, el agente procesa, responde. Sin app especial, sin interfaz web, sin términos de servicio que cambian cada trimestre.

---

## Hardware: Mac Mini M4 como servidor 24/7

La máquina es lo más simple del setup. Necesitaba algo que estuviera siempre encendido, que no consumiera mucha energía, y que fuera lo suficientemente potente para orquestar el agente sin esfuerzo.

El Mac Mini M4 con 16 GB de RAM cumple todo:

- **Consumo**: ~7W en reposo, ~35W bajo carga. Aceptable para tener encendido permanentemente.
- **Rendimiento**: El M4 base es capaz. El agente, los servicios de Telegram, las integraciones, todo funciona sin competir por recursos.
- **Ruido**: Silencio absoluto. Está en el salón, al lado del router, y no se oye.
- **Setup**: Configuré el Mac para arrancar automáticamente tras un corte de luz y no entrar en sleep. Lleva así desde hace una semana sin problemas.

El LLM corre en Ollama Cloud, así que el Mac no necesita GPU dedicada. Es un servidor de orquestación, no de inferencia.

---

## Ollama Cloud: Qwen 3.5 con 397 mil millones de parámetros

Pasé de ejecutar modelos locales a Ollama Cloud con un modelo de 397B. El salto en escala es evidente.

Ollama Cloud es una suscripción (~$20/mes) que proporciona acceso a modelos grandes mediante una API compatible con OpenAI. Estoy corriendo `Qwen 3.5` con 397 mil millones de parámetros. En local, con el hardware que tengo, no puedo correr algo de ese calibre.

¿Por qué el cambio? Para un agente conversacional que necesita entender matices y mantener contexto complejo, el tamaño del modelo importa. Un modelo de 397B tiene capacidad de razonamiento que uno más pequeño simplemente no tiene. Es una diferencia de escala, no de calidad absoluta — los modelos locales son excelentes para lo que están diseñados.

La configuración es trivial. OpenClaw soporta cualquier proveedor compatible con OpenAI:

```json
{
  "auth": {
    "profiles": {
      "ollama:cloud": { "provider": "ollama", "mode": "api_key" }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3.5-397b-cloud"
      }
    }
  }
}
```

Latencia: entre 2 y 5 segundos por respuesta, tiempo de red incluido. Aceptable para chat, no para tiempo real.

---

## Telegram como interfaz

OpenClaw soporta múltiples canales (WhatsApp, Discord, Slack, Signal, iMessage...), pero elegí Telegram como principal. Razones prácticas:

1. Está en móvil, tablet y laptop.
2. El bot se conecta hacia afuera — no necesito abrir puertos.
3. Simple de configurar — solo un token de bot.
4. Rápido en responder si el modelo no está saturado.

El bot actúa como entrada/salida. Escribo, OpenClaw procesa, responde en el mismo chat. Todo en lenguaje natural, sin comandos especiales.

---

## Obsidian: bloc de notas personal

Obsidian es donde guardo notas, listas de la compra, ideas, planificaciones. OpenClaw puede escribir en él si le pido que anote algo, pero no es obligatorio.

Es importante aclarar: OpenClaw tiene su propio sistema de memoria (Memory Core, que usa embeddings semánticos). Obsidian es tu espacio personal. Dos cosas diferentes.

En la práctica:

```text
Yo:         Apunta leche, huevos, harina
OpenClaw:   ¿Dónde lo guardo? ¿En tu Obsidian o en mi contexto?
Yo:         En Obsidian
OpenClaw:   ✅ Agregado a lista-compra.md
```

O para recordatorios de fechas:

```text
Yo:         Ana cumple años el 25 de junio, recuérdame
OpenClaw:   ✅ Te recordaré el 25 de junio
```

---

## Lo que hace OpenClaw en mi día a día

Una semana resultó ser tiempo suficiente para configurar más de lo que esperaba.

### Automatizaciones programadas

**7:30 AM — Resumen de noticias mundiales**

```text
OpenClaw:   📰 Noticias de hoy (7:30 AM)
            
            🇲🇽 México — Reforma judicial avanza en congreso
            Suceso: Tensión política entre ejecutivo y judicial
            Evolución: Votación decisiva en los próximos días
            
            🇧🇷 Brasil — Sequía en Amazonía alcanza máximos históricos
            Suceso: Millones de personas afectadas por desabastecimiento de agua
            Evolución: Se espera empeoramiento hasta octubre
            
            🇮🇳 India — Elecciones locales: victoria de la oposición
            Suceso: Cambio político significativo en estado clave
            Evolución: Posibles realineamientos para próximas generales
```

Elige tres países diferentes cada día, resume qué pasa, qué causa en la población, y cómo evolucionará. Lo configuro con los países que me interesan.

**8:00 AM — Previsión del tiempo**

```text
OpenClaw:   🌤️ Tiempo hoy y mañana
            
            Hoy (12 May): Madrid 18°C–25°C, despejado
            Mañana (13 May): Madrid 16°C–23°C, posible lluvia por la tarde
```

Para hoy y mañana, con precipitación y recomendaciones si hay alertas.

**10:00 AM — Noticias de desarrollo e IA**

```text
OpenClaw:   💻 Frontend & IA (10:00 AM)
            
            1. React 19.2 lanza soporte para Server Actions async
            2. Gemini ahora soporta tool calling con JSON schemas complejos
            3. Nuevo framework Astro 5.0 beta optimiza core vitals
```

Busca noticias recientes sobre frontend y IA, filtra lo relevante.

### Consultas conversacionales

```text
Yo:         ¿Cómo controlo la luz del salón?
OpenClaw:   La luz del salón está en Homey Pro. Está ahora en 80% de brillo.
            ¿Quieres que la apague, la encienda, o cambies el brillo?

Yo:         Enciéndela al 100%
OpenClaw:   ✅ Luz del salón a 100%. Listo.
```

Controla directamente tu domótica a través de Homey Pro.

### Notas, recordatorios y memoria

```text
Yo:         Apunta que mañana tengo que llamar a Mar sobre el proyecto X
OpenClaw:   ✅ Anotado: "Llamar a Mar sobre proyecto X" para mañana

Yo:         ¿Qué tareas tengo pendientes?
OpenClaw:   Según mis notas:
            - Revisar código de la rama develop
            - Llamar a Mar sobre proyecto X (mañana)
            - Comprar pan y leche

Yo:         Revisa tu memoria sobre el proyecto X
OpenClaw:   [recupera contexto anterior sobre el proyecto]
            Te recordaba que Mar necesita feedback el viernes
```

A pesar de que el contexto entre sesiones es volátil, el agente recupera bien la memoria cuando se lo pides. Si algo no está exacto, lo corrige.

### Control del hogar

```text
Yo:         Sube la temperatura a 22 grados
OpenClaw:   ✅ Termostato ajustado a 22°C. Hora estimada: 15 minutos.

Yo:         ¿Están todas las ventanas cerradas?
OpenClaw:   Según Homey Pro:
            - Salón: cerrada
            - Cocina: cerrada
            - Dormitorio: abierta
```

Integración directa con Homey Pro para luces, temperatura, sensores, etc.

### Voz: STT y TTS

```text
[Envías un audio por Telegram]

OpenClaw:   [Transcribe el audio a texto automáticamente]
            "Apunta que mañana tengo reunión con Carlos"
            
            ✅ Anotado en agenda

[OpenClaw responde con audio generado]
```

STT (speech-to-text) transcribe tu voz a texto. TTS (text-to-speech) responde con audio. Configurado en Telegram, así que puedes interactuar completamente por voz si lo prefieres.

---

## Primeras impresiones

### Lo que funciona muy bien

**El modelo es realmente bueno.** Qwen 397B entiende contexto sutil, raramente alucina, y cuando comete errores son errores inteligentes por falta de información, no confabulaciones.

**Telegram es la interfaz correcta.** Todo en un chat. Consultas, automatizaciones, control del hogar, notas — todo pasa por el mismo lugar sin cambiar de app.

**Las automatizaciones programadas son robustas.** Cada día, a la hora configurada, recibo noticias filtradas, previsión meteorológica, y alertas. Sin fallos hasta ahora.

**La memoria del agente mejora con el uso.** A pesar de que el contexto entre sesiones es volátil, cuando le pido que revise su memoria sobre un tema, recupera el contexto correctamente. Aprende sobre ti conforme interactúas.

**Homey Pro integra sin fricción.** El agente puede controlar luces, temperatura, consultar sensores, todo como si fuera un comando adicional en el chat.

### Limitaciones reales

**El contexto entre sesiones no es automático.** Si cierro la sesión y abro una nueva después, no recuerda la conversación anterior. Tengo que pedirle explícitamente que revise su memoria. Aceptable, pero requiere ese paso extra.

**La latencia es perceptible.** 2–5 segundos para responder es tiempo suficiente para cambiar el contexto mental. Para control del hogar en tiempo real, no es ideal. Para todo lo demás, funciona.

**Las automatizaciones necesitan configuración manual.** No hay interfaz visual para programar tareas. Hay que editar el config y reiniciar OpenClaw. Es técnico, pero estable una vez configurado.

### El cambio de mentalidad

Después de una semana, OpenClaw se convirtió en el punto central de mi interacción con información y controles:

- Primero miro Telegram (las noticias de 7:30, el tiempo, las alertas de IA)
- Desde ahí controlo el hogar sin abrir Homey
- Anoto todo (tareas, listas, recordatorios) en el mismo lugar
- Pregunto cosas que buscaría en Google

No es revolucionario. Es eficiente. Es un cambio de hábito genuino después de una semana.

---

## Próximas cosas

Con lo que ya funciona, tengo en mente:

- **Calendario**: integración con Google Calendar para que cuando pregunte "cuándo tengo reunión con X", lo sepa de verdad.
- **Correo**: resumen automático de emails importantes, no todo.
- **Análisis de documentos**: pasar PDFs o imágenes y que extraiga información.
- **Contexto automático entre sesiones**: mejorar Memory Core para que recupere historial antiguo sin necesidad de pedirlo explícitamente.
- **Notificaciones por voz**: además de Telegram, recibir alertas importantes por audio.

El bottleneck es mi energía para configurar y probar. OpenClaw tiene las herramientas, es cuestión de dedicación.

---

## Stack de la semana 1

| Componente | Qué uso |
|-----------|---------|
| **Hardware** | Mac Mini M4 (16 GB) — servidor 24/7 |
| **Agente** | OpenClaw — gateway + orquestación |
| **LLM** | Ollama Cloud (Qwen 3.5 397B) — $20/mes |
| **Interfaz** | Telegram — bot con STT/TTS |
| **Memoria** | OpenClaw Memory Core (embeddings semánticos) |
| **Notas** | Obsidian — vault Markdown personal |
| **Domótica** | Homey Pro — luces, temperatura, sensores |
| **Voz** | STT (transcripción) + TTS (síntesis) en Telegram |
| **Automatizaciones** | Noticias (7:30), Tiempo (8:00), Desarrollo (10:00) |
| **Status** | Funcionando, en uso activo |

---

## Reflexión

Hace una semana esto no existía. Hoy es donde le pregunto algo antes de buscarlo en Google. No porque sea más rápido, sino porque es más natural — es como tener alguien inteligente en el chat disponible siempre.

Lo interesante no es que sea perfecta. Es que es mía. No cambio de proveedor porque se aburran de mí. No me limitan el contexto porque sean rentables. El agente vive en mi máquina, responde como yo decido, hace lo que yo configuro.

Apenas empieza. Pero algo cambió en mi forma de trabajar.

---

*Post relacionado: [LLMs locales sin excusas: LM Studio y opencode](/es/blog/2026-04-19-local-llms-lm-studio-opencode-llmfit).*
