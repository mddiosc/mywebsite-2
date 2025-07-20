# Guía de Contribución

Bienvenido a la guía de contribución del portafolio de Miguel Ángel de Dios. Esta guía te ayudará a entender cómo contribuir efectivamente al proyecto.

## 🤝 Formas de Contribuir

### Tipos de Contribuciones Bienvenidas

- 🐛 **Reportes de bugs**: Identifica y reporta problemas
- ✨ **Nuevas funcionalidades**: Propone e implementa mejoras
- 📝 **Documentación**: Mejora y actualiza la documentación
- 🎨 **Mejoras de UI/UX**: Optimiza la interfaz y experiencia de usuario
- ⚡ **Optimizaciones**: Mejora el rendimiento y la eficiencia
- 🧪 **Pruebas**: Añade o mejora la cobertura de pruebas
- 🌐 **Traducciones**: Ayuda con la internacionalización
- 🔧 **Herramientas**: Mejora el flujo de desarrollo

## 🚀 Configuración Inicial

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18.0.0 o superior
- **pnpm** v8.0.0 o superior (recomendado)
- **Git** v2.30.0 o superior
- **VS Code** (recomendado para desarrollo)

### Fork y Clone

1. **Haz fork del repositorio** en GitHub
2. **Clona tu fork** localmente:

   ```bash
   git clone https://github.com/tu-usuario/mywebsite-2.git
   cd mywebsite-2
   ```

3. **Añade el repositorio original** como upstream:

   ```bash
   git remote add upstream https://github.com/mddiosc/mywebsite-2.git
   ```

4. **Instala las dependencias**:

   ```bash
   pnpm install
   ```

5. **Configura el entorno**:

   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus configuraciones
   ```

### Verificación de la Configuración

```bash
# Ejecutar pruebas
pnpm test

# Verificar linting
pnpm lint

# Iniciar servidor de desarrollo
pnpm dev
```

## 📋 Flujo de Trabajo

### Proceso de Desarrollo

1. **Sincroniza con upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Crea una rama para tu funcionalidad**:

   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/descripcion-del-bug
   # o
   git checkout -b docs/actualizacion-documentation
   ```

3. **Realiza tus cambios** siguiendo las convenciones del proyecto

4. **Ejecuta pruebas** antes de hacer commit:

   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

5. **Haz commits** usando conventional commits:

   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

6. **Push a tu fork**:

   ```bash
   git push origin feature/nombre-descriptivo
   ```

7. **Crea un Pull Request** en GitHub

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit consistentes:

```text
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[pie opcional]
```

#### Tipos de Commits

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, punto y coma, etc.)
- **refactor**: Refactorización de código
- **test**: Añadir o modificar pruebas
- **chore**: Cambios en build o herramientas auxiliares
- **perf**: Mejoras de rendimiento
- **ci**: Cambios en configuración de CI
- **build**: Cambios en sistema de build

#### Ejemplos de Commits

```bash
# Nuevas funcionalidades
feat(projects): agregar filtro por tecnología
feat(contact): implementar validación con Zod

# Correcciones
fix(navbar): corregir navegación en móvil
fix(api): manejar errores de red correctamente

# Documentación
docs(readme): actualizar instrucciones de instalación
docs(contributing): agregar guía de convenciones

# Estilos y formato
style(components): mejorar espaciado en ProjectCard
style: aplicar formato Prettier

# Refactoring
refactor(hooks): extraer lógica común de useProjects
refactor(types): reorganizar interfaces TypeScript

# Pruebas
test(components): agregar pruebas para ContactForm
test(utils): mejorar cobertura de helpers

# Tareas de mantenimiento
chore(deps): actualizar dependencias
chore(config): actualizar configuración ESLint
```

## 📐 Estándares de Código

### Estructura de Archivos

Sigue la estructura establecida del proyecto:

```text
src/
├── components/           # Componentes reutilizables
│   ├── ComponentName/
│   │   ├── index.tsx    # Componente principal
│   │   ├── types.ts     # Tipos específicos
│   │   └── __tests__/   # Pruebas
├── pages/               # Páginas de la aplicación
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuración
├── constants/           # Constantes de aplicación
└── types.ts            # Tipos globales
```

### Convenciones de Nomenclatura

- **Archivos de componentes**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase con prefijo 'use' (`useProjects.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Tipos/Interfaces**: PascalCase (`UserInterface`, `ApiResponse`)

### Estándares TypeScript

#### Definición de Tipos

```typescript
// ✅ Preferir interfaces para objetos
interface ComponentProps {
  title: string
  children: React.ReactNode
  className?: string
  onSubmit?: (data: FormData) => void
}

// ✅ Usar types para uniones y computados
type Status = 'idle' | 'loading' | 'success' | 'error'
type ComponentVariant = 'default' | 'primary' | 'secondary'

// ✅ Exportar tipos cuando sea necesario
export interface PublicApiResponse {
  data: DataItem[]
  meta: ResponseMeta
}
```

#### Componentes React

```typescript
// ✅ Estructura recomendada
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Tipos e interfaces al inicio
interface ComponentProps {
  title: string
  variant?: 'default' | 'featured'
  children: React.ReactNode
}

// Constantes del componente
const ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// Componente principal
export const Component: React.FC<ComponentProps> = ({
  title,
  variant = 'default',
  children
}) => {
  // Hooks al inicio
  const { t } = useTranslation()
  
  // Estado local
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Handlers
  const handleToggle = () => {
    setIsExpanded(prev => !prev)
  }
  
  // Renderizado
  return (
    <motion.div
      variants={ANIMATION_VARIANTS}
      initial="hidden"
      animate="visible"
      className={cn(
        'component-base',
        `component-${variant}`,
        { 'component-expanded': isExpanded }
      )}
    >
      <h2>{title}</h2>
      {children}
    </motion.div>
  )
}

// Exportación por defecto opcional
export default Component
```

### Estándares de Estilos

#### Tailwind CSS

```typescript
// ✅ Orden recomendado de clases
<div className="
  flex items-center justify-between    // Layout
  w-full max-w-md                     // Dimensiones
  p-4 m-2                             // Espaciado
  bg-white border border-gray-200     // Colores y bordes
  rounded-lg shadow-sm                // Decoración
  hover:shadow-md focus:outline-none  // Estados
  transition-shadow duration-200      // Transiciones
" />

// ✅ Uso de clases utilitarias helper
<div className={cn(
  'base-styles',
  {
    'conditional-styles': condition,
    'variant-styles': variant === 'primary'
  },
  className
)} />
```

#### CSS Personalizado

```css
/* ✅ Usar @apply para estilos reutilizables */
.button-base {
  @apply inline-flex items-center justify-center;
  @apply px-4 py-2 text-sm font-medium;
  @apply border border-transparent rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply transition-colors duration-200;
}

/* ✅ Variables CSS para temas */
.component {
  background-color: var(--background);
  color: var(--foreground);
  border-color: var(--border);
}
```

## 🧪 Estándares de Pruebas

### Escribir Pruebas

Cada nueva funcionalidad debe incluir pruebas apropiadas:

```typescript
// ✅ Estructura de prueba recomendada
describe('ComponentName', () => {
  // Setup común
  const defaultProps = {
    title: 'Test Title',
    onSubmit: vi.fn()
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  // Pruebas de renderizado
  it('renderiza correctamente', () => {
    render(<ComponentName {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
  
  // Pruebas de interacción
  it('maneja clics correctamente', () => {
    render(<ComponentName {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(defaultProps.onSubmit).toHaveBeenCalledOnce()
  })
  
  // Pruebas de casos edge
  it('maneja props faltantes', () => {
    render(<ComponentName title="Test" />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Cobertura de Pruebas

- **Nuevas funcionalidades**: 100% cobertura de líneas críticas
- **Componentes**: Pruebas de renderizado y interacciones principales
- **Hooks**: Pruebas de estado y efectos
- **Utilidades**: Pruebas de casos edge y validaciones

## 📖 Documentación

### Documentando Componentes

```typescript
/**
 * ProjectCard - Componente para mostrar información de proyectos
 * 
 * @example
 * ```tsx
 * <ProjectCard
 *   project={projectData}
 *   variant="featured"
 *   onCardClick={handleClick}
 * />
 * ```
 */
interface ProjectCardProps {
  /** Datos del proyecto a mostrar */
  project: GitHubProject
  /** Variante visual de la tarjeta */
  variant?: 'default' | 'featured' | 'compact'
  /** Callback ejecutado al hacer clic en la tarjeta */
  onCardClick?: (project: GitHubProject) => void
}
```

### Actualizando Documentación

- Actualiza README.md si cambias configuración o scripts
- Documenta nuevas APIs en docs/
- Añade ejemplos de uso para funcionalidades nuevas
- Mantén actualizadas las traducciones

## 🔍 Proceso de Review

### Criterios de Pull Request

Un PR será considerado para merge cuando:

- ✅ Todas las pruebas pasan
- ✅ El código sigue las convenciones establecidas
- ✅ Tiene cobertura de pruebas adecuada
- ✅ La documentación está actualizada
- ✅ No introduce breaking changes sin justificación
- ✅ Está libre de conflictos de merge

### Checklist de Pull Request

Antes de enviar tu PR, verifica:

```markdown
## Checklist

- [ ] Mi código sigue las convenciones del proyecto
- [ ] He ejecutado las pruebas localmente (`pnpm test`)
- [ ] He ejecutado el linter (`pnpm lint`)
- [ ] He verificado los tipos TypeScript (`pnpm type-check`)
- [ ] He añadido pruebas para mi cambio
- [ ] He actualizado la documentación relevante
- [ ] Mi cambio no introduce breaking changes
- [ ] He probado mi cambio en múltiples navegadores/dispositivos
```

### Plantilla de Pull Request

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Tipo de Cambio

- [ ] Bug fix (cambio no-breaking que corrige un problema)
- [ ] Nueva funcionalidad (cambio no-breaking que añade funcionalidad)
- [ ] Breaking change (fix o funcionalidad que causa cambios incompatibles)
- [ ] Actualización de documentación

## Testing

Describe las pruebas que ejecutaste para verificar tus cambios:

- [ ] Pruebas unitarias
- [ ] Pruebas de integración
- [ ] Pruebas manuales

## Screenshots (si aplica)

Añade screenshots para cambios visuales.

## Contexto Adicional

Cualquier información adicional relevante para el reviewer.
```

## 🐛 Reportar Bugs

### Información Requerida

Al reportar un bug, incluye:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el error
3. **Comportamiento esperado** vs actual
4. **Información del entorno**:
   - SO (macOS, Windows, Linux)
   - Navegador y versión
   - Versión de Node.js
   - Versión del proyecto

### Plantilla de Issue para Bugs

```markdown
## Descripción del Bug

Una descripción clara y concisa del bug.

## Pasos para Reproducir

1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hasta '...'
4. El error aparece

## Comportamiento Esperado

Descripción clara de lo que esperabas que ocurriera.

## Comportamiento Actual

Descripción de lo que realmente ocurre.

## Screenshots

Si aplica, añade screenshots del problema.

## Información del Entorno

- SO: [ej. macOS 14.0]
- Navegador: [ej. Chrome 120.0]
- Versión Node.js: [ej. 18.18.0]
- Versión del proyecto: [ej. 1.2.0]

## Contexto Adicional

Cualquier otra información relevante sobre el problema.
```

## ✨ Proponer Funcionalidades

### Antes de Proponer

1. **Busca** si ya existe una propuesta similar
2. **Considera** si la funcionalidad encaja con los objetivos del proyecto
3. **Piensa** en la implementación y mantenimiento a largo plazo

### Plantilla de Feature Request

```markdown
## Descripción de la Funcionalidad

Descripción clara y concisa de la funcionalidad propuesta.

## Problema que Resuelve

Explica qué problema resuelve esta funcionalidad.

## Solución Propuesta

Describe la solución que te gustaría ver implementada.

## Alternativas Consideradas

Describe alternativas que hayas considerado.

## Información Adicional

Cualquier contexto adicional, screenshots, o ejemplos.
```

## 🌐 Contribuir con Traducciones

### Añadir Nuevos Idiomas

1. Crea archivos en `src/locales/[codigo-idioma]/`
2. Traduce todo el contenido manteniendo la estructura
3. Actualiza la configuración de i18n
4. Añade el idioma al selector de idiomas
5. Actualiza la documentación

### Mejorar Traducciones Existentes

1. Revisa archivos en `src/locales/es/` o `src/locales/en/`
2. Mejora traduciones manteniendo contexto
3. Verifica que todas las claves estén traducidas
4. Prueba los cambios en la aplicación

## 💡 Consejos para Contribuidores

### Mejores Prácticas

- **Comunica temprano**: Abre issues para discutir grandes cambios
- **Cambios pequeños**: Prefiere PRs pequeños y focalizados
- **Documenta**: Explica el "por qué" en commits y PRs
- **Sé paciente**: El proceso de review toma tiempo
- **Aprende**: Usa el proyecto para mejorar tus habilidades

### Recursos Útiles

- **Documentación React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Conventional Commits**: [conventionalcommits.org](https://www.conventionalcommits.org)
- **Testing Library**: [testing-library.com](https://testing-library.com)

## 🎉 Reconocimiento

Todos los contribuidores serán reconocidos en el proyecto. Las contribuciones valiosas incluyen:

- Reportes de bugs detallados
- Mejoras de código y nuevas funcionalidades
- Mejoras en documentación
- Traducciones y correcciones
- Revisión de PRs y feedback constructivo

## 📞 Obtener Ayuda

Si tienes preguntas o necesitas ayuda:

1. **Revisa la documentación** en `docs/`
2. **Busca en issues** existentes
3. **Abre un nuevo issue** con tus preguntas
4. **Únete a las discusiones** del proyecto

## 📄 Código de Conducta

Este proyecto se adhiere a un código de conducta inclusivo. Al participar, te comprometes a:

- Ser respetuoso con todos los participantes
- Aceptar críticas constructivas
- Enfocarte en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

---

¡Gracias por tu interés en contribuir al proyecto! Cada contribución, por pequeña que sea, es valiosa y ayuda a mejorar el proyecto para todos. 🚀
