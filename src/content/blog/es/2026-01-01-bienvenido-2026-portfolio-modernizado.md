---
title: "¡Bienvenido 2026! Portfolio Modernizado con Dark Mode y Glassmorphism"
description: "Celebrando la llegada de 2026 con un portfolio completamente renovado. Descubre los cambios visuales y técnicos que he implementado: dark mode, glassmorphism, animaciones 3D y una experiencia móvil rediseñada."
date: "2026-01-01"
tags: ["portfolio", "react", "design", "dark-mode", "glassmorphism", "ui-ux", "2026"]
author: "Miguel Ángel de Dios"
slug: "bienvenido-2026-portfolio-modernizado"
featured: true
---

## 🎉 ¡Feliz Año Nuevo 2026

¡Bienvenido a 2026! Espero que hayas tenido unas excelentes fiestas y que este nuevo año venga cargado de proyectos emocionantes, aprendizaje continuo y mucho código de calidad.

Como mencioné en mi [último post sobre los retos frontend para 2026](/es/blog/felices-fiestas-retos-frontend-2026), este año promete ser transformador para el desarrollo web. Y qué mejor manera de empezarlo que con un portfolio completamente renovado.

---

## 🎨 ¿Por Qué Modernizar Ahora?

Durante las últimas semanas, en algunos ratos libres entre las celebraciones navideñas, decidí darle un refresh completo a mi portfolio. No solo por estética (aunque eso también cuenta), sino para:

1. **Practicar con las tendencias de diseño 2026** - Glassmorphism, dark mode, micro-interacciones
2. **Mejorar la experiencia de usuario** - Especialmente en dispositivos móviles
3. **Aplicar lo que predico** - Si hablo de tendencias, debo implementarlas
4. **Tener un playground personal** - Para experimentar con nuevas técnicas

El resultado: **dos Pull Requests** que transformaron completamente la experiencia visual del sitio.

---

## 🌓 Dark Mode: Más Que Un Toggle

### El Reto

Implementar dark mode no es solo invertir colores. Es crear una experiencia coherente que:

- Sea cómoda para los ojos en ambientes oscuros
- Mantenga la jerarquía visual
- Preserve la identidad de marca
- Persista la preferencia del usuario

### La Implementación

Opté por un sistema basado en clases con un contexto de React:

```tsx
// ThemeContext simplificado
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Recuperar preferencia guardada
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Aplicar clase al documento
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Paleta de Colores Optimizada

Una de las decisiones más importantes fue crear una paleta más brillante para el modo oscuro:

```css
/* Modo claro */
--primary: hsl(220, 90%, 56%);
--accent: hsl(340, 82%, 52%);

/* Modo oscuro - colores más vibrantes */
--primary-light: hsl(220, 90%, 65%);
--accent-light: hsl(340, 82%, 60%);
```

**Resultado:** Mejor contraste y legibilidad sin sacrificar la estética.

---

## ✨ Glassmorphism: El Efecto Premium

Glassmorphism es **LA** tendencia visual de 2026. Ese efecto de vidrio esmerilado que ves en iOS, Windows 11, y ahora en mi portfolio.

### La Receta

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* En dark mode */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Dónde Lo Apliqué

- **Cards de proyectos** - Con efectos hover 3D
- **Navbar** - Con transparencia adaptativa al scroll
- **Formulario de contacto** - Para un look más moderno
- **Badges y botones** - Detalles que marcan la diferencia

**Tip:** No abuses del glassmorphism. Úsalo estratégicamente para crear jerarquía visual.

---

## 🎭 Micro-Interacciones: Los Detalles Importan

Las micro-interacciones son lo que separa un sitio funcional de uno que se siente **vivo**.

### Animaciones de Letras Escalonadas

En el hero, cada letra del título aparece con un ligero delay:

```tsx
const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};
```

### Efectos Hover 3D

Los cards de proyectos ahora tienen profundidad:

```css
.project-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
```

### Botones con Shine Effect

Un efecto de brillo que cruza el botón al hacer hover:

```css
.button {
  position: relative;
  overflow: hidden;
}

.button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.button:hover::after {
  transform: translateX(100%);
}
```

---

## 📱 Navegación Móvil Rediseñada

La experiencia móvil era funcional, pero básica. Ahora es **espectacular**.

### Antes vs Después

**Antes:**

- Menú hamburguesa estándar
- Lista simple de enlaces
- Sin animaciones

**Después:**

- Overlay glassmorphism con orbes animados
- Iconos para cada sección
- Animaciones fluidas de entrada/salida
- Bloqueo de scroll del body
- Mejor accesibilidad táctil

### Código Destacado

```tsx
// Bloqueo de scroll cuando el menú está abierto
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [mobileMenuOpen]);
```

### Iconos Significativos

Cada enlace ahora tiene un icono que refuerza su significado:

- 🏠 Home → `HomeIcon`
- 👤 About → `UserIcon`
- 📁 Projects → `FolderIcon`
- 📰 Blog → `NewspaperIcon`
- ✉️ Contact → `EnvelopeIcon`

**Resultado:** Navegación más intuitiva y visualmente atractiva.

---

## 🎯 Bento Grid Layout

Inspirado en diseños modernos de Apple y Notion, implementé un layout tipo Bento Grid para la sección de features:

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {features.map((feature, index) => (
    <motion.div
      key={feature.name}
      className="glass-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Contenido del feature */}
    </motion.div>
  ))}
</div>
```

Este layout:

- Se adapta perfectamente a diferentes tamaños de pantalla
- Crea una jerarquía visual clara
- Permite destacar elementos importantes con tamaños diferentes

---

## 📊 Mejoras de Contenido

No todo fue visual. También optimicé el contenido:

### Skills Curados

**Antes:** 28 tecnologías listadas
**Después:** 10 skills esenciales

¿Por qué? Menos es más. Prefiero mostrar lo que realmente domino que una lista interminable.

### Textos Más Concisos

Cada sección fue reescrita para ser:

- Más directa
- Más impactante
- Más fácil de escanear

### Terminología Consistente

Unificación de términos en todo el sitio para mejor coherencia.

---

## 🛠️ Stack Técnico

Todo esto fue posible gracias a:

- **React 19** - Con las últimas características
- **TypeScript** - Type safety en todo momento
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animaciones declarativas
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos consistentes
- **Vite** - Build tool ultrarrápido

---

## 📈 Resultados y Aprendizajes

### Métricas de Mejora

- **Tiempo de carga:** Sin cambios significativos (optimizado desde el inicio)
- **Engagement visual:** Subjetivamente mucho mejor
- **Experiencia móvil:** Transformación completa
- **Accesibilidad:** Mejorada con mejor contraste y áreas táctiles

### Lo Que Aprendí

1. **Glassmorphism requiere balance** - Muy poco y no se nota, mucho y es abrumador
2. **Dark mode es un arte** - No es solo invertir colores
3. **Las micro-interacciones importan** - Son los detalles que la gente recuerda
4. **Mobile-first es crítico** - La mayoría del tráfico viene de móviles
5. **La consistencia visual es clave** - Un sistema de diseño coherente hace la diferencia

---

## 🔮 Próximos Pasos

Este es solo el comienzo. Para las próximas semanas planeo:

1. **Agregar animaciones de página** - View Transitions API
2. **Optimizar imágenes** - Lazy loading mejorado
3. **Crear más contenido** - Posts técnicos regulares
4. **Experimentar con AI** - Integrar alguna funcionalidad interesante
5. **Mejorar SEO** - Optimización continua

---

## 💭 Reflexiones Finales

Modernizar mi portfolio fue más que un ejercicio técnico. Fue una oportunidad para:

- **Practicar lo que predico** - Implementar las tendencias que analizo
- **Salir de mi zona de confort** - Experimentar con diseño visual
- **Crear algo de lo que estar orgulloso** - Un escaparate de mis habilidades
- **Aprender haciendo** - La mejor forma de dominar nuevas técnicas

Si estás pensando en renovar tu portfolio, mi consejo:

> No esperes a que sea perfecto. Empieza con pequeños cambios, itera constantemente, y sobre todo: **diviértete en el proceso**.

---

## 🎊 ¡Feliz 2026

Que este año te traiga:

- 🚀 Proyectos emocionantes
- 💡 Aprendizaje continuo
- 🤝 Grandes colaboraciones
- ⚡ Código limpio y eficiente
- 🎯 Metas alcanzadas

**¡Nos vemos en el próximo post!**

¿Qué mejoras has hecho (o planeas hacer) a tu portfolio este año? Me encantaría saberlo en los comentarios.

---

*P.D.: Si te gustó este post, compártelo con otros developers que estén pensando en renovar su portfolio. ¡Gracias por leer!* ✨
