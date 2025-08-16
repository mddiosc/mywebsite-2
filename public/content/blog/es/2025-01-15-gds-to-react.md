---
title: "De Sistemas GDS a React: Mi camino de 14 años en turismo al desarrollo frontend"
description: "La historia de cómo pasé de programar reservas de vuelos con Amadeus GDS a crear interfaces modernas con React, TypeScript y las tecnologías que elegí para este portfolio."
date: "2025-01-15"
author: "Miguel Ángel de Dios"
tags: ["carrera", "frontend", "react", "typescript", "transición profesional"]
slug: "gds-to-react"
featured: true
---

Hace 14 años me despertaba cada mañana pensando en códigos de aeropuerto, tarifas de vuelos y la complejidad infinita de los sistemas de reservas Amadeus. Hoy me despierto pensando en componentes React, hooks personalizados y cómo optimizar el rendimiento de una aplicación web.

Como mencioné en mi [post de bienvenida](/blog/welcome-post), esta es la historia completa de cómo llegué hasta aquí, y por qué elegí las tecnologías que ves en este portfolio.

## Los años de Amadeus: Más que reservas de vuelos

Durante más de una década trabajé en la industria del turismo, especializándome en sistemas GDS (Global Distribution System), particularmente Amadeus. Para quienes no estén familiarizados, Amadeus es uno de los sistemas más complejos del mundo: conecta aerolíneas, hoteles, agencias de viajes y permite procesar millones de transacciones diarias.

Trabajar con Amadeus me enseñó lecciones valiosas que hoy aplico en el desarrollo frontend:

### **Precisión bajo presión**

En turismo, un error puede significar que una familia pierda sus vacaciones o que una empresa tenga pérdidas importantes. Esta mentalidad de "zero-errors" la llevo conmigo al escribir código: testing exhaustivo, validación de datos, manejo de edge cases.

### **Sistemas complejos, interfaces simples**

Amadeus maneja una complejidad enorme por detrás, pero la interfaz debe ser simple para que un agente de viajes pueda usarla eficientemente. Esto es exactamente lo que busco en React: abstraer la complejidad en componentes reutilizables que sean fáciles de usar.

### **Performance es crítico**

Cuando tienes miles de usuarios consultando disponibilidad de vuelos simultáneamente, cada milisegundo cuenta. Esta experiencia me hace valorar herramientas como React Query para el caching inteligente y Vite para builds ultra-rápidos.

## El punto de inflexión: JavaScript moderno

El cambio comenzó cuando empecé a automatizar procesos repetitivos en mi trabajo con JavaScript. Me fascinó la posibilidad de crear soluciones que antes requerían software propietario costoso.

Lo que me enamoró del desarrollo frontend fue la **inmediatez del feedback visual**. En turismo, los resultados de tu trabajo a menudo se veían semanas después. Con React, cambias una línea de código y ves el resultado instantáneamente.

## ¿Por qué React y TypeScript?

Después de experimentar con vanilla JavaScript, Vue, y Angular, React se convirtió en mi elección por varias razones:

### **Ecosistema maduro**

Tras 14 años en una industria donde la estabilidad es crucial, valoro enormemente el ecosistema React. Herramientas como Next.js, React Query, y Framer Motion han demostrado su valor en proyectos reales.

### **TypeScript: Las lecciones de sistemas críticos**

En Amadeus, un error de tipo podía causar problemas masivos. TypeScript me da esa misma confianza en el frontend: errores atrapados en tiempo de compilación, autocompletado inteligente, refactoring seguro.

### **Componentes como bloques de construcción**

Los sistemas GDS están construidos con módulos reutilizables. React Components siguen la misma filosofía: crear una vez, usar en múltiples lugares, mantener consistencia.

## Las decisiones técnicas de este portfolio

Construir este portfolio fue una oportunidad perfecta para aplicar todo lo aprendido. Aquí están las decisiones clave:

### **React 19 + TypeScript 5.7**

- **¿Por qué?** Las últimas features como Server Components y mejor performance
- **Lección del turismo:** Siempre usa versiones estables pero modernas

### **Vite en lugar de Create React App**

- **¿Por qué?** Build times ultra-rápidos, HMR instantáneo
- **Lección del turismo:** La velocidad de desarrollo impacta directamente la productividad

### **TailwindCSS para estilos**

- **¿Por qué?** Consistency visual, utility-first approach
- **Lección del turismo:** Los sistemas escalables necesitan reglas claras y consistentes

### **React Query para estado del servidor**

- **¿Por qué?** Caching inteligente, retry automático, sincronización
- **Lección del turismo:** Los datos críticos necesitan manejo robusto de errores

### **Framer Motion para animaciones**

- **¿Por qué?** Performance nativa, API declarativa
- **Lección del turismo:** Las microinteracciones mejoran la experiencia del usuario

### **React Router 7**

- **¿Por qué?** Navegación type-safe, nested routes
- **Lección del turismo:** La navegación debe ser intuitiva y predecible

## Arquitectura del proyecto

```text
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas/vistas principales  
├── hooks/              # Lógica de negocio reutilizable
├── lib/                # Utilidades y configuraciones
├── types/              # Definiciones TypeScript
└── i18n/               # Internacionalización
```

Esta estructura refleja mi experiencia en sistemas empresariales: separación clara de responsabilidades, fácil mantenimiento, escalabilidad.

## Lecciones clave de la transición

### **1. La experiencia empresarial es valiosa**

No descartes tu experiencia previa. Los 14 años en turismo me dieron perspectiva sobre sistemas críticos, gestión de stakeholders, y pensamiento en escala.

### **2. El aprendizaje continuo es esencial**

En turismo, las regulaciones cambian constantemente. En frontend, las tecnologías evolucionan rápidamente. La mentalidad es la misma: adaptarse y seguir aprendiendo.

### **3. Los fundamentos importan más que las modas**

En lugar de perseguir cada framework nuevo, me enfoqué en dominar JavaScript, TypeScript, y los principios de React. Los fundamentos sólidos permiten adaptarse a cualquier herramienta.

### **4. La experiencia del usuario es universal**

Ya sea facilitando la reserva de un vuelo o navegando una aplicación web, siempre se trata de resolver problemas reales para personas reales.

## ¿Qué viene después?

Este blog será donde comparta:

- **Patrones React** que he encontrado útiles en proyectos reales
- **Decisiones de arquitectura** y sus trade-offs
- **Herramientas y workflows** que mejoran la productividad
- **Lecciones aprendidas** de proyectos tanto exitosos como fallidos

## Reflexión final

Cambiar de carrera a los 30+ no es fácil, pero mi experiencia en turismo no fue tiempo perdido—fue preparación. Los sistemas complejos, la atención al detalle, y el enfoque en el usuario final son habilidades transferibles invaluables.

Si estás considerando una transición similar, mi consejo es: aprovecha tu experiencia única. El mundo tech necesita perspectivas diversas, y tu background te dará ventajas que otros no tienen.

---

*¿Tienes una historia de transición profesional similar? ¿Te gustaría conocer más detalles sobre alguna de las tecnologías mencionadas? Conecta conmigo en [LinkedIn](https://linkedin.com/in/tu-perfil) o envíame un mensaje a través del [formulario de contacto](/contacto).*

*En el próximo post, profundizaré en los patrones React que más uso en proyectos reales y por qué los considero esenciales.*
