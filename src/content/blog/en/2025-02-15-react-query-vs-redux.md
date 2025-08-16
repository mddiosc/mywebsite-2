---
title: "React Query vs Redux: Why I chose modern state management"
description: "A practical comparison between Redux and the Zustand + React Query combination. How to simplify state management in modern React applications without sacrificing functionality."
date: "2025-02-15"
tags: ["react-query", "zustand", "redux", "state-management", "react"]
author: "Miguel Ángel de Dios"
slug: "react-query-vs-redux"
featured: true
---

State management in React has evolved tremendously in recent years. After working with Redux on multiple projects, I decided to explore more modern alternatives for my portfolio. In this post, I'll share why I chose the **Zustand + React Query** combination over Redux and how this decision has simplified my development workflow.

## The problem with Redux in small/medium projects

Redux is an excellent tool, but it comes with considerable overhead:

### **Excessive boilerplate**

```typescript
// Redux: For a simple counter you need multiple files
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

### **Complexity for async data**

With Redux, handling API calls requires additional middleware (Redux Thunk or Redux Saga) and much more code:

```typescript
// Redux + Thunk: Load user list
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

## My solution: Zustand + React Query

I've adopted a hybrid approach that clearly separates responsibilities:

- **Zustand**: For local application state (UI, settings, etc.)
- **React Query**: For server state (API data)

### **Zustand: Simplicity for local state**

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

// Use in any component:
const { theme, setTheme } = useAppStore()
```

**No boilerplate, no reducers, no actions.** Just state and functions to modify it.

### **React Query: Power for server data**

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
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  })
}

// In component:
const { data: users, isLoading, error, refetch } = useUsers()
```

React Query gives me **automatically**:

- ✅ Loading states
- ✅ Error handling  
- ✅ Smart caching
- ✅ Background refetching
- ✅ Automatic retry
- ✅ Optimistic updates

## Practical comparison: Blog posts

Let's see how to implement blog post loading with both approaches:

### **With Redux:**

```typescript
// You need: actions, reducer, thunk, selectors...
// ~100+ lines of code for basic functionality

// In component:
const dispatch = useDispatch()
const { posts, loading, error } = useSelector((state) => state.blog)

useEffect(() => {
  dispatch(fetchPosts())
}, [dispatch])

if (loading) return <Spinner />
if (error) return <Error message={error} />
```

### **With React Query:**

```typescript
// hooks/useBlogPosts.ts
export const useBlogPosts = (language: string) => {
  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: () => fetchBlogPosts(language),
    staleTime: 10 * 60 * 1000 // Cache for 10 minutes
  })
}

// In component:
const { data: posts, isLoading, error } = useBlogPosts(language)

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />
```

**Result:** ~80% less code, superior functionality.

## Specific advantages in my workflow

### **1. Exceptional DevTools**

React Query DevTools shows me in real time:

- Which queries are active
- Cache state of each query  
- Timeline of refetches
- Automatic invalidations

```typescript
// In development:
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

### **2. Smart invalidation**

```typescript
// Create new post
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
    // Optimistic update - UI updates immediately
    await queryClient.cancelQueries({ queryKey: ['post', id] })
    const previousPost = queryClient.getQueryData(['post', id])
    queryClient.setQueryData(['post', id], data)
    return { previousPost }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['post', variables.id], context.previousPost)
  }
})
```

## When to keep using Redux

Redux is still the best option for:

### **Very complex applications**

- State that needs to be shared between many components
- Complex state logic with multiple side effects
- Need for time-travel debugging

### **Large teams**

- When you need strict predictability
- Well-established patterns the team knows
- Advanced debugging with Redux DevTools

### **Specific cases**

```typescript
// Example: Real-time collaborative editor
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
    // Complex undo/redo logic, collaboration, etc.
  }
})
```

## My practical recommendation

For **new projects**, I suggest starting with:

```typescript
// Modern and simple stack
const myStack = {
  localState: 'Zustand',
  serverState: 'React Query', 
  forms: 'React Hook Form',
  routing: 'React Router'
}
```

**Migrate to Redux only if**:

- Local state becomes unmanageable
- You need advanced debugging
- Team requires stricter patterns

## Implementation in my portfolio

In my current portfolio, I use this architecture:

```typescript
// Local state: UI configurations
export const useAppStore = create<AppState>((set) => ({
  language: 'es',
  theme: 'light',
  setLanguage: (lang) => set({ language: lang })
}))

// Server state: Blog posts
export const useBlogPosts = (language: string) => {
  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: () => loadBlogPosts(language)
  })
}

// Forms: React Hook Form
export const useContactForm = () => {
  return useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })
}
```

This combination gives me **maximum productivity** with **minimal complexity**.

## Conclusion

The choice of state management shouldn't be dogmatic. Redux was revolutionary and continues to be excellent for specific cases. But for many modern applications, **Zustand + React Query** offers a superior development experience with less complexity.

My current philosophy: **start simple, scale when necessary**.

Have you experimented with these tools? What has been your experience migrating from Redux to more modern alternatives? I'd love to hear your perspective through the [contact form](/contact).

---

**Recommended resources:**

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query/TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/) (if you decide to stick with Redux)
- [State Management Comparison](https://leerob.io/blog/react-state-management)
