---
title: 'La era de los agentes: una reflexión sobre la IA que actúa'
description: 'Una reflexión sobre cómo los agentes de IA están cambiando el desarrollo de software, por qué el LLM es solo la punta del iceberg y qué desafíos enfrentamos al ceder autonomía a sistemas que razonan, planifican y ejecutan.'
date: '2026-06-14'
tags: ['ia', 'agentes', 'llm', 'desarrollo', 'autonomia', 'multi-agente', 'reflexion']
author: 'Miguel Angel de Dios'
slug: 'the-era-of-agents'
featured: true
---

## De responder a actuar

Durante años, la inteligencia artificial en software se parecía a un asistente muy capaz. Le pedías algo, te daba una respuesta. Copiabas la respuesta, la pegabas, la adaptabas. El bucle terminaba ahí.

Era útil, pero pasivo.

Hoy estamos en una transición que es fácil de subestimar: la IA deja de ser un generador de respuestas para convertirse en un **sistema que persigue objetivos**. No te dice cómo hacer algo; si le das confianza, lo hace. Navega tu codebase, ejecuta comandos, pasa tests, itera sobre errores, toma decisiones locales sin pedir permiso para cada paso.

Eso es lo que llamamos un agente.

Y no es solo una mejora incremental. Cambia la pregunta central del desarrollo: de "¿cómo escribo esto?" a "¿qué objetivo quiero que este sistema alcance por mí?".

---

## ¿Qué distingue a un agente de un asistente?

La diferencia no está en el modelo subyacente. Los dos pueden usar el mismo LLM. La diferencia está en el bucle:

| Característica | Asistente tradicional | Agente autónomo |
| --- | --- | --- |
| Entrada | Prompt puntual | Objetivo de alto nivel |
| Salida | Texto, código, explicación | Acciones ejecutadas en el entorno |
| Memoria | Contexto de la conversación | Estado persistente entre sesiones |
| Herramientas | Ninguna o muy limitadas | Acceso a terminal, archivos, APIs, tests |
| Verificación | El usuario evalúa | El agente itera y valida sus propios pasos |
| Control | Humano en cada paso | Humano como supervisor, no como operador |

Un asistente te ayuda a pensar. Un agente piensa y actúa.

Esto implica una transferencia de responsabilidad que no debemos tomar a la ligera. Cuando un asistente se equivoca, el error queda en pantalla. Cuando un agente se equivoca, puede instalar la versión equivocada de una dependencia, borrar archivos o introducir un bug silencioso en producción.

---

## El LLM como núcleo de razonamiento

En el corazón de casi todo agente actual hay un modelo de lenguaje. Pero su rol no es solo "escribir bonito". En una arquitectura de agentes, el LLM funciona como un motor de razonamiento práctico:

- **Interpreta la intención** del usuario, incluso cuando está formulada de forma vaga.
- **Descompone objetivos** en subtareas concretas y ordenables.
- **Selecciona herramientas**: decide si necesita leer un archivo, ejecutar un test, buscar en documentación o lanzar un comando.
- **Evalúa resultados** para saber si debe continuar, corregir o pedir ayuda.
- **Mantiene coherencia** a lo largo de múltiples pasos, algo que va más allá del contexto inmediato de un chat.

Esta es la razón por la que los marcos como ReAct, Chain-of-Thought o Tree-of-Thoughts se han vuelto relevantes. No mejoran el modelo por sí solos; mejoran la forma en que el modelo estructura su razonamiento para actuar sobre el mundo.

Sin embargo, el modelo sigue siendo imperfecto. Tiene alucinaciones, sesgos y una comprensión superficial de causas profundas. Eso significa que el agente necesita **contrapesos**: tests, linters, revisiones, sandboxes y, sobre todo, un humano que supervise el plan antes de que se ejecute.

---

## La fuerza del ecosistema multi-agente

El siguiente nivel de complejidad llega cuando no hay un solo agente, sino varios colaborando. Cada uno con un rol definido, un ámbito de responsabilidad y una forma de comunicarse con los demás.

Imagina un flujo de desarrollo real:

- Un **agente investigador** explora el codebase y resume qué partes son relevantes.
- Un **agente planificador** propone un plan de cambios con tareas ordenadas.
- Un **agente editor** implementa los cambios archivo por archivo.
- Un **agente de testing** ejecuta la suite, identifica fallos y los comunica de vuelta.
- Un **agente revisor** verifica calidad, estilo y posibles regresiones.

Ninguno de ellos necesita ser un modelo gigante. De hecho, una de las tendencias más interesantes es el **ruteo de modelos**: tareas simples para modelos locales rápidos y baratos, tareas complejas para modelos cloud potentes. El sistema gana en velocidad, coste y precisión al asignar el cerebro adecuado a cada problema.

La coordinación entre agentes es hoy uno de los campos más abiertos. Protocolos como MCP (Model Context Protocol) están empezando a estandarizar cómo los agentes se conectan a herramientas, memorias y otros agentes. Aún no hay una arquitectura dominante, pero la dirección es clara: construir equipos virtuales de especialistas, no monolitos de IA.

---

## Los desafíos que no podemos ignorar

Hay que ser honesto: los agentes introducen riesgos que no teníamos con herramientas más pasivas.

### 1. Seguridad y permisos

Un agente con acceso a tu terminal puede hacer casi lo mismo que tú. Si el modelo interpreta mal una instrucción, las consecuencias no se limitan a una respuesta incorrecta. Ejecutar comandos en entornos controlados, usar contenedores o requerir aprobación explícita para operaciones destructivas debería ser la norma, no la excepción.

### 2. Fiabilidad y alucinaciones

Un agente puede parecer que avanza con confianza mientras construye sobre una premisa falsa. Peor aún: puede ocultar el error bajo varios pasos de razonamiento correcto pero basado en un malentendido inicial. Por eso necesitas poder trazar sus decisiones.

### 3. Dependencia y atrofia de habilidades

Si delegamos demasiado, corremos el riesgo de olvidar cómo funcionan las cosas por debajo. El agente se convierte en una caja negra, y nosotros en supervisores incapaces de detectar errores sutiles.

### 4. Coste operacional

Cada paso de un agente consume tokens, tiempo y energía. Un bucle de agente mal diseñado puede ser mucho más caro que hacer la tarea manualmente. La eficiencia del flujo importa tanto como la calidad del modelo.

### 5. Ética y transparencia

¿Quién es responsable cuando un agente automatizado toma una mala decisión? ¿Cómo auditamos su comportamiento? No son preguntas abstractas. Hay que responderlas pronto.

---

## El nuevo rol del desarrollador

A menudo se habla de los agentes como si fueran el fin del desarrollador humano. Personalmente creo que eso es un malentendido.

Los agentes no vienen a reemplazarnos. Vienen a cambiar dónde invertimos nuestra energía.

Antes, gran parte del trabajo consistía en mecanografiar soluciones paso a paso. Ahora, el valor se desplaza hacia:

- **Definir objetivos con claridad**: un objetivo mal definido genera un resultado bien ejecutado pero equivocado.
- **Diseñar los contrapesos**: tests, validaciones, sandboxes y guardrails que limiten el margen de error.
- **Configurar el ecosistema del agente**: elegir modelos, herramientas, estrategias de memoria y protocolos de comunicación.
- **Revisar con criterio**: el agente propone, el humano decide. Confiar ciegamente es la forma más rápida de meterse en problemas.
- **Mantener la comprensión profunda**: entender lo suficiente como para saber cuándo el agente está inventando o simplificando de más.

En cierto modo, el desarrollador pasa a ser un director de orquesta. No toca todos los instrumentos, pero es responsable de que la pieza suene bien.

---

## Hacia dónde vamos

La generación actual de agentes todavía está lejos de ser autónoma de verdad. Necesitan supervisión, cometen errores y consumen mucho. Pero la dirección es inequívoca: cada mes los bucles son un poco más largos, la memoria un poco más persistente, las herramientas un poco más ricas y la coordinación un poco más sofisticada.

En el futuro cercano, probablemente no tengamos un único agente omnisciente. Tendremos flujos de agentes especializados que colaboran bajo nuestra dirección. Algunos serán locales para preservar privacidad, otros en la nube para tareas que requieren potencia. Algunos actuarán en segundos, otros planificarán a escala de días.

Lo que sí parece claro es que la pregunta ya no es si los agentes cambiarán el desarrollo de software. La pregunta es qué tipo de desarrolladores queremos ser en un mundo donde la IA no solo sugiere, sino que actúa.

Y esa pregunta, al menos por ahora, sigue siendo nuestra.
