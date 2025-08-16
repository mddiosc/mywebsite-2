---
title: "React Query vs Redux: Por qué elegí el state management moderno"
description: "Una comparación práctica entre Redux y la combinación Zustand + React Query. Cómo simplificar el manejo de estado en aplicaciones React modernas sin sacrificar funcionalidad."
date: "2025-02-15"
tags: ["react-query", "zustand", "redux", "state-management", "react"]
author: "Miguel Ángel de Dios"
slug: "react-query-vs-redux"
featured: false
---

El manejo de estado en React ha evolucionado enormemente en los últimos años. Después de trabajar con Redux en múltiples proyectos, decidí explorar alternativas más modernas para mi portfolio. En este post, compartiré por qué elegí la combinación **Zustand + React Query** sobre Redux y cómo esta decisión ha simplificado mi flujo de desarrollo.

## El problema con Redux en proyectos pequeños/medianos

Redux es una excelente herramienta, pero viene con un overhead considerable:

### **Boilerplate excesivo**

```typescript
// Redux: Para un simple contador necesitas múltiples archivos
// actions/counterActions.ts
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'

export const increment = () => ({ type: INCREMENT })
export const decrement = () => ({ type: DECREMENT })

// reducers/counterReducer.ts
interface CounterState {
  count: number
}

const initialState: CounterState = { count: 0 }

export const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 }
    case DECREMENT:
      return { ...state, count: state.count - 1 }
    default:
      return state
  }
}

// store/index.ts
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

### **Complejidad para datos asíncronos**

Con Redux, manejar llamadas a APIs requiere middleware adicional (Redux Thunk o Redux Saga) y mucho más código:

```typescript
// Redux + Thunk: Cargar lista de usuarios
const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await api.get('/users')
    return response.data
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})
```

## Mi solución: Zustand + React Query

He adoptado un enfoque híbrido que separa claramente las responsabilidades:

- **Zustand**: Para estado local de la aplicación (UI, configuraciones, etc.)
- **React Query**: Para estado del servidor (datos de APIs)

### **Zustand: Simplicidad para estado local**

```typescript
// stores/useAppStore.ts
import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  sidebarOpen: boolean
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: 'es' | 'en') => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'es',
  sidebarOpen: false,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}))

// Usar en cualquier componente:
const { theme, setTheme } = useAppStore()
```

**Sin boilerplate, sin reducers, sin acciones.** Solo estado y funciones para modificarlo.

### **React Query: Potencia para datos del servidor**

```typescript
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3
  })
}

// En el componente:
const { data: users, isLoading, error, refetch } = useUsers()
```

React Query me da **automáticamente**:

- ✅ Loading states
- ✅ Error handling  
- ✅ Caching inteligente
- ✅ Background refetching
- ✅ Retry automático
- ✅ Optimistic updates

## Comparación práctica: Blog posts

Veamos cómo implementar la carga de posts del blog con ambos enfoques:

### **Con Redux:**

```typescript
// Necesitas: actions, reducer, thunk, selectors...
// ~100+ líneas de código para funcionalidad básica

// En el componente:
const dispatch = useDispatch()
const { posts, loading, error } = useSelector((state) => state.blog)

useEffect(() => {
  dispatch(fetchPosts())
}, [dispatch])

if (loading) return <Spinner />
if (error) return <Error message={error} />
```

### **Con React Query:**

```typescript
// hooks/useBlogPosts.ts
export const useBlogPosts = (language: string) => {
  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: () => fetchBlogPosts(language),
    staleTime: 10 * 60 * 1000 // Cache por 10 minutos
  })
}

// En el componente:
const { data: posts, isLoading, error } = useBlogPosts(language)

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />
```

**Resultado:** ~80% menos código, funcionalidad superior.

## Ventajas específicas en mi workflow

### **1. DevTools excepcionales**

React Query DevTools me muestra en tiempo real:

- Qué queries están activas
- Estado de cache de cada query  
- Timeline de refetches
- Invalidaciones automáticas

```typescript
// En desarrollo:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

### **2. Invalidación inteligente**

```typescript
// Crear nuevo post
const createPost = useMutation({
  mutationFn: (newPost) => api.post('/posts', newPost),
  onSuccess: () => {
    // Automatically refetch blog posts
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
  }
})
```

### **3. Optimistic updates**

```typescript
const updatePost = useMutation({
  mutationFn: ({ id, data }) => api.put(`/posts/${id}`, data),
  onMutate: async ({ id, data }) => {
    // Optimistic update - UI se actualiza inmediatamente
    await queryClient.cancelQueries({ queryKey: ['post', id] })
    const previousPost = queryClient.getQueryData(['post', id])
    queryClient.setQueryData(['post', id], data)
    return { previousPost }
  },
  onError: (err, variables, context) => {
    // Rollback en caso de error
    queryClient.setQueryData(['post', variables.id], context.previousPost)
  }
})
```

## Cuándo seguir usando Redux

Redux sigue siendo la mejor opción para:

### **Aplicaciones muy complejas**

- Estados que necesitan ser compartidos entre muchos componentes
- Lógica de estado compleja con múltiples side effects
- Necesidad de time-travel debugging

### **Teams grandes**

- Cuando necesitas predictibilidad estricta
- Patrones bien establecidos que el equipo conoce
- Debugging avanzado con Redux DevTools

### **Casos específicos**

```typescript
// Ejemplo: Editor colaborativo en tiempo real
const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    document: {},
    cursors: {},
    history: [],
    undoStack: [],
    redoStack: []
  },
  reducers: {
    // Lógica compleja de undo/redo, colaboración, etc.
  }
})
```

## Mi recomendación práctica

Para **nuevos proyectos**, sugiero empezar con:

```typescript
// Stack moderno y simple
const myStack = {
  localState: 'Zustand',
  serverState: 'React Query', 
  forms: 'React Hook Form',
  routing: 'React Router'
}
```

**Migrar a Redux solo si**:

- El estado local se vuelve inmanejable
- Necesitas debugging avanzado
- El team requiere patrones más estrictos

## Implementación en mi portfolio

En mi portfolio actual, uso esta arquitectura:

```typescript
// Estado local: Configuraciones de UI
export const useAppStore = create<AppState>((set) => ({
  language: 'es',
  theme: 'light',
  setLanguage: (lang) => set({ language: lang })
}))

// Estado del servidor: Posts del blog
export const useBlogPosts = (language: string) => {
  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: () => loadBlogPosts(language)
  })
}

// Formularios: React Hook Form
export const useContactForm = () => {
  return useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })
}
```

Esta combinación me da **máxima productividad** con **mínima complejidad**.

## Conclusión

La elección de state management no debería ser dogmática. Redux fue revolucionario y sigue siendo excelente para casos específicos. Pero para muchas aplicaciones modernas, **Zustand + React Query** ofrece una experiencia de desarrollo superior con menos complejidad.

Mi filosofía actual: **empezar simple, escalar cuando sea necesario**.

¿Has experimentado con estas herramientas? ¿Cuál ha sido tu experiencia migrando de Redux a alternativas más modernas? Me encantaría escuchar tu perspectiva en el [formulario de contacto](/contact).

---

**Recursos recomendados:**

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query/TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/) (si decides quedarte con Redux)
- [State Management Comparison](https://leerob.io/blog/react-state-management)
