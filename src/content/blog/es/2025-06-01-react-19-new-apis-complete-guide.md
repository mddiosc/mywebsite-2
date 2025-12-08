---
title: "React 19: Guía completa de las nuevas APIs"
description: "Exploro en profundidad las nuevas APIs de React 19: useActionState, useOptimistic, use(), ref callbacks con cleanup, y más. Una guía práctica con ejemplos reales de migración."
date: "2025-06-01"
tags: ["react", "react-19", "hooks", "javascript", "frontend", "migration"]
author: "Miguel Ángel de Dios"
slug: "react-19-new-apis-complete-guide"
featured: true
---

React 19 no es solo una actualización incremental: es una **reimaginación de cómo construimos interfaces**. Después de migrar varios proyectos a esta versión, puedo decir que las nuevas APIs resuelven problemas que llevábamos años parcheando con soluciones improvisadas.

## El contexto: Por qué React 19 importa

### Más allá del hype

Antes de React 19, manejar estados de formularios, optimistic updates y carga de datos requería un ecosistema completo de librerías. Ahora, muchas de estas funcionalidades vienen integradas:

```tsx
// ❌ Antes: Necesitabas múltiples estados y efectos
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Data | null>(null);

const handleSubmit = async (formData: FormData) => {
  setIsLoading(true);
  setError(null);
  try {
    const result = await submitForm(formData);
    setData(result);
  } catch (e) {
    setError(e.message);
  } finally {
    setIsLoading(false);
  }
};

// ✅ Ahora: Una sola API maneja todo
const [state, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const result = await submitForm(formData);
    return result;
  },
  null
);
```

## useActionState: El nuevo estándar para formularios

### Anatomía del hook

`useActionState` combina la gestión de estado con acciones asíncronas de forma elegante:

```typescript
const [state, formAction, isPending] = useActionState(
  actionFunction,
  initialState,
  permalink? // Opcional: para progressive enhancement
);
```

- **state**: El estado actual (resultado de la última acción o estado inicial)
- **formAction**: Función para pasar al `action` del form o `formAction` de un botón
- **isPending**: Booleano que indica si la acción está en progreso

### Implementación completa de un formulario de contacto

```tsx
// hooks/useContactForm.ts
import { useActionState } from 'react';

interface ContactFormState {
  success: boolean;
  error: string | null;
  data: { message: string } | null;
}

async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Validación
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  if (!email || !message) {
    return {
      success: false,
      error: 'Todos los campos son requeridos',
      data: null
    };
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email, message }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Error al enviar el mensaje');
    }

    return {
      success: true,
      error: null,
      data: { message: '¡Mensaje enviado correctamente!' }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    };
  }
}

export function useContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    { success: false, error: null, data: null }
  );

  return {
    state,
    formAction,
    isPending,
    isSuccess: state.success,
    isError: !!state.error
  };
}
```

```tsx
// components/ContactForm.tsx
import { useContactForm } from '../hooks/useContactForm';

export function ContactForm() {
  const { state, formAction, isPending, isSuccess, isError } = useContactForm();

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={isPending}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={isPending}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {isError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {state.error}
        </div>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md">
          {state.data?.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md 
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
```

## useOptimistic: UX instantánea

### El problema que resuelve

Los usuarios odian esperar. Con `useOptimistic`, puedes mostrar el resultado esperado **inmediatamente**, mientras la operación real ocurre en segundo plano:

```tsx
import { useOptimistic } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function TodoList({ todos, toggleTodo }: { 
  todos: Todo[]; 
  toggleTodo: (id: string) => Promise<void>;
}) {
  const [optimisticTodos, setOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, toggledId: string) => 
      currentTodos.map(todo =>
        todo.id === toggledId 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
  );

  const handleToggle = async (id: string) => {
    // 1. Actualización optimista inmediata
    setOptimisticTodo(id);
    
    // 2. Operación real en background
    await toggleTodo(id);
    // Si falla, React revertirá automáticamente al estado real
  };

  return (
    <ul className="space-y-2">
      {optimisticTodos.map(todo => (
        <li 
          key={todo.id}
          className="flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
            className="h-4 w-4"
          />
          <span className={todo.completed ? 'line-through text-gray-500' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Caso avanzado: Lista de comentarios con optimistic UI

```tsx
import { useOptimistic, useActionState } from 'react';

interface Comment {
  id: string;
  text: string;
  author: string;
  pending?: boolean; // Flag para estilos de pending
}

function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments, newComment: Comment) => [
      ...currentComments,
      { ...newComment, pending: true }
    ]
  );

  const [, submitAction, isPending] = useActionState(
    async (_prev: null, formData: FormData) => {
      const text = formData.get('comment') as string;
      
      // Crear comentario optimista
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        text,
        author: 'Usuario actual',
        pending: true
      };
      
      addOptimisticComment(optimisticComment);
      
      // Enviar al servidor
      const savedComment = await postComment(postId, text);
      
      // Actualizar estado real
      setComments(prev => [...prev, savedComment]);
      
      return null;
    },
    null
  );

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {optimisticComments.map(comment => (
          <li 
            key={comment.id}
            className={`p-3 rounded-lg ${
              comment.pending 
                ? 'bg-gray-100 opacity-70' 
                : 'bg-white shadow'
            }`}
          >
            <p className="font-medium">{comment.author}</p>
            <p>{comment.text}</p>
            {comment.pending && (
              <span className="text-xs text-gray-500">Enviando...</span>
            )}
          </li>
        ))}
      </ul>

      <form action={submitAction} className="flex gap-2">
        <input
          name="comment"
          placeholder="Escribe un comentario..."
          required
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
```

## use(): La nueva forma de consumir promesas y contextos

### Consumiendo promesas directamente

El hook `use()` permite "desenvolver" promesas dentro del render, trabajando con Suspense:

```tsx
import { use, Suspense } from 'react';

// Función que retorna una promesa
async function fetchUserProfile(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // use() suspende el componente hasta que la promesa resuelve
  const user = use(userPromise);

  return (
    <div className="p-4">
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-16 h-16 rounded-full"
      />
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

// Uso con Suspense
function ProfilePage({ userId }: { userId: string }) {
  // Crear la promesa fuera del componente que usa use()
  const userPromise = fetchUserProfile(userId);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

### Reemplazando useContext

`use()` también puede consumir contextos, y a diferencia de `useContext`, puede usarse condicionalmente:

```tsx
import { use, createContext } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');
const UserContext = createContext<User | null>(null);

function ConditionalTheming({ useSystemTheme }: { useSystemTheme: boolean }) {
  // ✅ Ahora es posible usar contexto condicionalmente
  const theme = useSystemTheme 
    ? getSystemTheme() 
    : use(ThemeContext);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      {/* contenido */}
    </div>
  );
}

// También funciona en loops
function UserList({ userIds }: { userIds: string[] }) {
  return (
    <ul>
      {userIds.map(id => {
        // use() dentro de un loop - imposible con useContext
        const user = use(fetchUser(id));
        return <li key={id}>{user.name}</li>;
      })}
    </ul>
  );
}
```

## Ref Callbacks con Cleanup

### El problema anterior

Antes de React 19, los ref callbacks no tenían forma de hacer cleanup, lo que causaba memory leaks con observers:

```tsx
// ❌ React 18: Memory leak potencial
function OldComponent() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    // Cleanup manual complicado
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      observerRef.current = new IntersectionObserver(/* ... */);
      observerRef.current.observe(element);
    }
  }, []);

  // ⚠️ También necesitas useEffect para cleanup en unmount
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return <div ref={setRef} />;
}
```

### La solución en React 19

Ahora los ref callbacks pueden retornar una función de cleanup:

```tsx
// ✅ React 19: Cleanup automático
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const observerRef = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(element);

    // ✅ Cleanup function - se ejecuta automáticamente
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={observerRef} className="min-h-[200px]">
      {isVisible ? (
        <img src={src} alt={alt} className="w-full" />
      ) : (
        <div className="animate-pulse bg-gray-200 h-full" />
      )}
    </div>
  );
}
```

### Caso práctico: Resize Observer

```tsx
function ResizablePanel({ onResize }: { onResize: (size: DOMRect) => void }) {
  const panelRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          onResize(entry.contentRect);
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    },
    [onResize]
  );

  return (
    <div 
      ref={panelRef}
      className="resize overflow-auto border rounded-lg p-4"
    >
      Arrastra para redimensionar
    </div>
  );
}
```

## useTransition: Navegaciones sin bloqueo

### Mejorando la percepción de velocidad

`useTransition` permite marcar actualizaciones como "no urgentes", manteniendo la UI responsiva:

```tsx
import { useTransition, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NavigationWithTransition() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  return (
    <nav className="relative">
      {isPending && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
      )}
      
      <ul className="flex gap-4">
        <li>
          <button 
            onClick={() => handleNavigation('/dashboard')}
            disabled={isPending}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleNavigation('/settings')}
            disabled={isPending}
          >
            Settings
          </button>
        </li>
      </ul>
    </nav>
  );
}
```

### Búsqueda sin debounce

```tsx
function SearchWithTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    // Actualización urgente: input siempre responsivo
    setQuery(value);
    
    // Actualización no urgente: puede ser interrumpida
    startTransition(async () => {
      const searchResults = await searchAPI(value);
      setResults(searchResults);
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      <div className={isPending ? 'opacity-50' : ''}>
        {results.map(result => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}
```

## Metadata nativo: Adiós react-helmet

### Document metadata sin librerías

React 19 permite renderizar `<title>`, `<meta>` y `<link>` directamente en componentes, y React los hoistea al `<head>`:

```tsx
// ✅ React 19: Nativo
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title} | Mi Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />
      <link rel="canonical" href={`https://miblog.com/posts/${post.slug}`} />
      
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Componente DocumentHead reutilizable

```tsx
interface DocumentHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function DocumentHead({ 
  title, 
  description, 
  image,
  url,
  type = 'website'
}: DocumentHeadProps) {
  const fullTitle = `${title} | Mi Sitio`;
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
```

## Resource Preloading APIs

### Precargar recursos críticos

React 19 incluye APIs para precargar recursos de forma declarativa:

```tsx
import { preload, preinit, preconnect } from 'react-dom';

function App() {
  // Preconectar a dominios externos
  preconnect('https://fonts.googleapis.com');
  preconnect('https://api.example.com');
  
  // Preinicializar estilos críticos
  preinit('/styles/critical.css', { as: 'style' });
  
  // Precargar fuentes
  preload('/fonts/inter-var.woff2', { 
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  });
  
  // Precargar imagen hero
  preload('/images/hero.webp', { as: 'image' });

  return (
    <main>
      {/* Tu app */}
    </main>
  );
}
```

### Hook para preloading inteligente

```tsx
import { preload, preinit } from 'react-dom';

export function useResourcePreloader() {
  const preloadImage = useCallback((src: string) => {
    preload(src, { as: 'image' });
  }, []);

  const preloadFont = useCallback((
    href: string, 
    type: string = 'font/woff2'
  ) => {
    preload(href, { 
      as: 'font', 
      type,
      crossOrigin: 'anonymous'
    });
  }, []);

  const preloadScript = useCallback((src: string) => {
    preinit(src, { as: 'script' });
  }, []);

  const preloadStylesheet = useCallback((href: string) => {
    preinit(href, { as: 'style' });
  }, []);

  return {
    preloadImage,
    preloadFont,
    preloadScript,
    preloadStylesheet
  };
}

// Uso
function ProductCard({ product }: { product: Product }) {
  const { preloadImage } = useResourcePreloader();

  return (
    <div 
      onMouseEnter={() => preloadImage(product.fullImage)}
      className="cursor-pointer"
    >
      <img src={product.thumbnail} alt={product.name} />
      <h3>{product.name}</h3>
    </div>
  );
}
```

## Guía de migración

### Paso 1: Actualizar dependencias

```bash
# Actualizar React
pnpm add react@19 react-dom@19

# Actualizar types
pnpm add -D @types/react@19 @types/react-dom@19

# Eliminar dependencias innecesarias
pnpm remove react-helmet-async
```

### Paso 2: Migración gradual por feature

```tsx
// Antes: Custom hook con múltiples estados
function useFormOld(action: (data: FormData) => Promise<Result>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Result | null>(null);

  const submit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await action(formData);
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error, data };
}

// Después: useActionState
function useFormNew(
  action: (prev: State, data: FormData) => Promise<State>,
  initialState: State
) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  
  return { 
    state, 
    formAction, 
    isPending,
    error: state.error,
    data: state.data
  };
}
```

### Paso 3: Checklist de migración

```typescript
// migration-checklist.ts
export const react19MigrationChecklist = {
  hooks: {
    'useState + loading states': 'useActionState',
    'optimistic updates manuales': 'useOptimistic',
    'useContext condicional': 'use(Context)',
    'async data en render': 'use(Promise) + Suspense'
  },
  
  components: {
    'react-helmet-async': 'native <title>, <meta>',
    'forwardRef': 'ref como prop regular',
    'ref callbacks sin cleanup': 'ref callbacks con return cleanup'
  },
  
  patterns: {
    'resource-hints manuales': 'preload(), preinit(), preconnect()',
    'Context.Provider nesting': 'Context como provider directo'
  },
  
  dependencies_to_remove: [
    'react-helmet-async',
    'react-helmet'
  ]
};
```

## Conclusión: El futuro es ahora

React 19 representa un cambio fundamental en cómo pensamos sobre el estado, las acciones y la carga de recursos. Las nuevas APIs no son solo "azúcar sintáctica" - resuelven problemas arquitectónicos reales:

- **useActionState**: Elimina la necesidad de múltiples estados para formularios
- **useOptimistic**: Hace que la UI se sienta instantánea
- **use()**: Simplifica el consumo de datos asíncronos y contextos
- **Ref callbacks con cleanup**: Previene memory leaks de forma elegante
- **Metadata nativo**: Reduce dependencias y mejora el SSR

Mi recomendación: **empieza la migración gradualmente**. Identifica los formularios más usados, los componentes con optimistic updates, y migra uno por uno. El beneficio en código más limpio y mejor UX vale completamente la inversión.

¿Ya has empezado a usar React 19 en producción? ¿Qué API te ha resultado más útil? Me encantaría conocer tu experiencia.
