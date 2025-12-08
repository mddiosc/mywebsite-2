---
title: "Desarrollo con IA: Cómo GitHub Copilot y Claude Transformaron mi Workflow"
description: "Mi experiencia real usando GitHub Copilot, Claude y otras herramientas de IA para desarrollo. Patrones, prompts efectivos y cómo maximizar la productividad sin perder calidad."
date: "2025-12-08"
tags: ["ai", "github-copilot", "claude", "developer-tools", "productivity", "vibe-coding"]
author: "Miguel Ángel de Dios"
slug: "ai-assisted-development-copilot-claude"
featured: true
---

Hace un año era escéptico sobre las herramientas de IA para código. "Solo autocomplete glorificado", pensaba. Hoy, GitHub Copilot y Claude son parte integral de mi workflow diario. Este post documenta mi journey y las lecciones aprendidas.

## El Cambio de Mentalidad

El error más común es ver la IA como un reemplazo del desarrollador. La realidad es diferente:

```text
❌ Expectativa: "La IA escribe todo el código por mí"
✅ Realidad: "La IA es un copiloto experto que acelera mi trabajo"

❌ Expectativa: "Puedo copiar y pegar sin entender"
✅ Realidad: "Necesito entender y validar cada sugerencia"

❌ Expectativa: "Funciona igual para todo"
✅ Realidad: "Diferentes herramientas para diferentes tareas"
```

## Mi Stack de IA Actual

### GitHub Copilot: El Compañero de Código

Copilot brilla en tareas de implementación inmediata:

```typescript
// Escribo un comentario descriptivo...
// Función para validar email con regex que soporte dominios internacionales

// Copilot sugiere:
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Pero si necesito más robustez, refino el comentario:
// Función para validar email según RFC 5322, soportando caracteres unicode en el dominio

function validateEmailRFC5322(email: string): boolean {
  const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return emailRegex.test(email);
}
```

**Donde Copilot destaca:**

- ✅ Completar patrones repetitivos
- ✅ Generar boilerplate
- ✅ Tests unitarios basados en implementación
- ✅ Documentación JSDoc
- ✅ Código que sigue convenciones del proyecto

### Claude: El Arquitecto y Mentor

Claude (especialmente con Claude Code en VS Code) es mi herramienta para tareas que requieren razonamiento más profundo:

**Revisión de arquitectura:**

```text
Prompt: "Revisa esta estructura de carpetas para un proyecto React 
con micro-frontends. Identifica problemas potenciales de escalabilidad 
y sugiere mejoras basadas en las mejores prácticas actuales."

[pego la estructura]
```

**Debugging complejo:**

```text
Prompt: "Este componente tiene un memory leak que solo aparece 
después de 10+ navegaciones. El useEffect tiene cleanup pero 
algo persiste. Aquí está el código completo del componente 
y los hooks que usa..."

[pego código relevante]
```

**Refactoring con contexto:**

```text
Prompt: "Necesito migrar este hook de clase a functional component 
con hooks. Mantén la misma API pública pero mejora el manejo de 
errores y añade soporte para cancelación de requests."
```

## Vibe Coding: El Arte del Prompt Engineering

El término "vibe coding" captura perfectamente cómo trabajo con IA. No es solo escribir prompts, es establecer un flujo de comunicación efectivo.

### Patrones de Prompt Efectivos

**1. Contexto → Tarea → Restricciones**

```text
❌ "Haz un formulario de login"

✅ "Contexto: Aplicación React con TypeScript, usando React Hook Form 
y Zod para validación. Diseño con Tailwind CSS.

Tarea: Crear un formulario de login con email y password.

Restricciones:
- Validación en cliente antes de submit
- Mostrar errores inline
- Estado de loading durante submit
- Accesible (WCAG 2.1 AA)
- No usar librerías adicionales"
```

**2. Ejemplos de entrada/salida**

```text
✅ "Genera un hook para debounce. 

Ejemplo de uso:
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    fetchResults(debouncedSearch);
  }
}, [debouncedSearch]);

El hook debe:
- Ser genérico (funcionar con cualquier tipo)
- Limpiar el timeout en unmount
- Permitir cancelar el debounce manualmente"
```

**3. Iteración guiada**

```text
Prompt inicial: "Crea un componente de tabla con sorting"
[reviso el resultado]

Seguimiento: "Bien, pero necesito que el sorting sea multi-columna 
y que persista en URL params"
[reviso]

Refinamiento: "Perfecto. Ahora añade virtualización para 
manejar 10k+ filas sin problemas de performance"
```

### Mi Workflow de Vibe Coding

```text
1. DEFINIR - Escribo qué necesito en lenguaje natural
2. GENERAR - La IA produce una primera versión
3. EVALUAR - Reviso críticamente el código
4. REFINAR - Pido cambios específicos o ajusto manualmente
5. INTEGRAR - Adapto al contexto de mi proyecto
6. VALIDAR - Tests y revisión final
```

## Casos de Uso Reales

### Caso 1: Generando Tests

Una de las aplicaciones más valiosas. Copilot entiende la implementación y genera tests relevantes:

```typescript
// Mi implementación
export function calculateDiscount(
  price: number,
  discountPercent: number,
  maxDiscount?: number
): number {
  const discount = price * (discountPercent / 100);
  const finalDiscount = maxDiscount 
    ? Math.min(discount, maxDiscount) 
    : discount;
  return Math.round((price - finalDiscount) * 100) / 100;
}

// Escribo: "// Tests para calculateDiscount"
// Copilot genera:

describe('calculateDiscount', () => {
  it('should calculate basic percentage discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should handle decimal prices', () => {
    expect(calculateDiscount(99.99, 15)).toBe(84.99);
  });

  it('should apply max discount cap', () => {
    expect(calculateDiscount(1000, 50, 100)).toBe(900);
  });

  it('should not apply cap when discount is lower', () => {
    expect(calculateDiscount(100, 10, 50)).toBe(90);
  });

  it('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
```

### Caso 2: Documentación Automática

```typescript
// Selecciono la función y pido a Claude:
// "Genera documentación JSDoc completa incluyendo ejemplos"

/**
 * Calculates the final price after applying a percentage discount.
 * 
 * @param price - The original price before discount
 * @param discountPercent - The discount percentage (0-100)
 * @param maxDiscount - Optional maximum discount amount cap
 * @returns The final price after discount, rounded to 2 decimal places
 * 
 * @example
 * // Basic discount
 * calculateDiscount(100, 10) // Returns: 90
 * 
 * @example
 * // With maximum discount cap
 * calculateDiscount(1000, 50, 100) // Returns: 900 (capped at $100 off)
 * 
 * @throws {Error} If price is negative
 * @throws {Error} If discountPercent is outside 0-100 range
 */
export function calculateDiscount(
  price: number,
  discountPercent: number,
  maxDiscount?: number
): number {
  // ...
}
```

### Caso 3: Refactoring de Legacy Code

Tenía un componente de clase de 500 líneas. En lugar de refactorizar manualmente:

```text
Prompt a Claude:

"Tengo este componente de clase React que necesita modernizarse. 

Requisitos:
1. Convertir a functional component con hooks
2. Extraer lógica reutilizable en custom hooks
3. Mantener exactamente la misma funcionalidad
4. Mejorar el manejo de errores
5. Añadir TypeScript types estrictos

El componente actual tiene:
- State complejo con múltiples propiedades relacionadas
- componentDidMount con fetch de datos
- componentDidUpdate con comparación de props
- Múltiples event handlers
- Renderizado condicional complejo

[código del componente]"
```

Claude no solo refactorizó, sino que identificó un bug sutil en el `componentDidUpdate` que causaba renders infinitos en edge cases.

### Caso 4: Aprendiendo Nuevas APIs

Cuando necesité implementar Web Workers por primera vez:

```text
Prompt:

"Explícame cómo usar Web Workers en una aplicación React con 
TypeScript. Necesito procesar imágenes pesadas sin bloquear el UI.

Incluye:
- Setup del worker con TypeScript
- Comunicación bidireccional con el main thread
- Manejo de errores
- Cleanup cuando el componente se desmonta
- Ejemplo práctico de redimensionar una imagen"
```

La respuesta de Claude incluyó no solo el código, sino explicaciones de cada decisión y gotchas comunes que me ahorró horas de debugging.

## Errores que Cometí y Cómo Evitarlos

### Error 1: Confiar Ciegamente

```typescript
// Copilot sugirió esto para "shuffle array"
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

// ❌ Problema: Esta implementación NO es un shuffle uniforme
// El algoritmo sort() no garantiza distribución uniforme

// ✅ La solución correcta (Fisher-Yates):
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

**Lección:** Siempre verificar algoritmos críticos. La IA puede dar soluciones "que funcionan" pero no óptimas.

### Error 2: No Dar Suficiente Contexto

```text
❌ "Crea un hook para fetch de datos"
// Resultado: Implementación genérica que no encaja con mi proyecto

✅ "Crea un hook para fetch de datos que:
- Use nuestra instancia de axios en /lib/axios
- Integre con React Query para caching
- Siga nuestro patrón de error handling con toast notifications
- Soporte TypeScript generics para el tipo de respuesta
- Incluya retry logic con backoff exponencial"
// Resultado: Código que encaja perfectamente
```

### Error 3: Usar la Herramienta Equivocada

| Tarea | Mejor Herramienta |
|-------|-------------------|
| Autocompletar código en contexto | Copilot |
| Generar boilerplate | Copilot |
| Explicar código complejo | Claude |
| Debugging con razonamiento | Claude |
| Refactoring arquitectural | Claude |
| Documentación inline | Copilot |
| Code review | Claude |
| Regex complejas | Claude |

## Configuración Óptima

### VS Code con Copilot

```json
// settings.json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "yaml": true
  },
  "github.copilot.advanced": {
    "inlineSuggestCount": 3
  },
  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first"
}
```

### Atajos de Teclado Que Uso

```text
Alt + ] / Alt + [  → Navegar entre sugerencias de Copilot
Tab               → Aceptar sugerencia
Esc               → Rechazar sugerencia
Ctrl + Enter      → Ver panel de sugerencias
Cmd + I           → Abrir Copilot Chat
Cmd + Shift + I   → Abrir Claude Code (si está instalado)
```

### Prompts Templates que Guardo

```markdown
## Template: Nuevo Componente React
Crea un componente React funcional en TypeScript llamado [NOMBRE].

Props:
- [listar props con tipos]

Comportamiento:
- [describir funcionalidad]

Requisitos técnicos:
- Usar forwardRef si necesita ref
- Memoizar si recibe callbacks
- Accesible (aria labels apropiados)
- Estilos con Tailwind CSS

## Template: Code Review
Revisa este código y proporciona feedback en estas categorías:
1. Bugs potenciales
2. Performance
3. Seguridad  
4. Mantenibilidad
5. Testing

Sé específico con líneas de código problemáticas.

## Template: Debugging
Tengo un bug con las siguientes características:
- Comportamiento esperado: [X]
- Comportamiento actual: [Y]
- Pasos para reproducir: [1, 2, 3]
- Código relevante: [adjunto]
- Ya intenté: [lista]

Ayúdame a identificar la causa raíz.
```

## El Futuro del Desarrollo con IA

Mi predicción para los próximos años:

1. **Agentes autónomos**: IA que puede ejecutar tareas completas (como Devin, pero más maduro)
2. **Context-aware coding**: Herramientas que entienden todo el proyecto, no solo el archivo actual
3. **Testing automático**: Generación de tests basada en especificaciones
4. **Documentation as code**: Documentación que se mantiene sincronizada automáticamente

Pero el desarrollador seguirá siendo esencial para:

- Definir qué construir
- Tomar decisiones de arquitectura
- Validar calidad y seguridad
- Entender el dominio del negocio

## Conclusión

La IA no me ha reemplazado. Me ha hecho más productivo y me permite enfocarme en los problemas interesantes mientras delego lo tedioso. La clave está en:

- ✅ Entender las fortalezas de cada herramienta
- ✅ Escribir prompts con contexto suficiente
- ✅ Verificar siempre el output
- ✅ Iterar y refinar
- ✅ Mantener el pensamiento crítico

El "vibe coding" no es programar sin pensar. Es programar en colaboración con herramientas que amplifican nuestras capacidades.

¿Cómo estás usando IA en tu desarrollo? ¿Qué herramientas te han funcionado mejor? 🤖
