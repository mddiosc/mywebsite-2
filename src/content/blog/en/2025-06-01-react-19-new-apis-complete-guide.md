---
title: "React 19: Complete guide to the new APIs"
description: "I explore in depth the new React 19 APIs: useActionState, useOptimistic, use(), ref callbacks with cleanup, and more. A practical guide with real migration examples."
date: "2025-06-01"
tags: ["react", "react-19", "hooks", "javascript", "frontend", "migration"]
author: "Miguel Ángel de Dios"
slug: "react-19-new-apis-complete-guide"
featured: true
---

React 19 is not just an incremental update: it's a **reimagining of how we build interfaces**. After migrating several projects to this version, I can say that the new APIs solve problems we've been patching with improvised solutions for years.

## The context: Why React 19 matters

### Beyond the hype

Before React 19, handling form states, optimistic updates, and data loading required a complete ecosystem of libraries. Now, many of these functionalities come built-in:

```tsx
// ❌ Before: You needed multiple states and effects
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

// ✅ Now: A single API handles everything
const [state, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const result = await submitForm(formData);
    return result;
  },
  null
);
```

## useActionState: The new standard for forms

### Anatomy of the hook

`useActionState` elegantly combines state management with async actions:

```typescript
const [state, formAction, isPending] = useActionState(
  actionFunction,
  initialState,
  permalink? // Optional: for progressive enhancement
);
```

- **state**: The current state (result of last action or initial state)
- **formAction**: Function to pass to form's `action` or button's `formAction`
- **isPending**: Boolean indicating if the action is in progress

### Complete implementation of a contact form

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
  // Validation
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  if (!email || !message) {
    return {
      success: false,
      error: 'All fields are required',
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
      throw new Error('Error sending message');
    }

    return {
      success: true,
      error: null,
      data: { message: 'Message sent successfully!' }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
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
          Message
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
        {isPending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
```

## useOptimistic: Instant UX

### The problem it solves

Users hate waiting. With `useOptimistic`, you can show the expected result **immediately**, while the real operation happens in the background:

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
    // 1. Immediate optimistic update
    setOptimisticTodo(id);
    
    // 2. Real operation in background
    await toggleTodo(id);
    // If it fails, React will automatically revert to real state
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

### Advanced case: Comments list with optimistic UI

```tsx
import { useOptimistic, useActionState } from 'react';

interface Comment {
  id: string;
  text: string;
  author: string;
  pending?: boolean; // Flag for pending styles
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
      
      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        text,
        author: 'Current user',
        pending: true
      };
      
      addOptimisticComment(optimisticComment);
      
      // Send to server
      const savedComment = await postComment(postId, text);
      
      // Update real state
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
              <span className="text-xs text-gray-500">Sending...</span>
            )}
          </li>
        ))}
      </ul>

      <form action={submitAction} className="flex gap-2">
        <input
          name="comment"
          placeholder="Write a comment..."
          required
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

## use(): The new way to consume promises and contexts

### Consuming promises directly

The `use()` hook allows "unwrapping" promises inside render, working with Suspense:

```tsx
import { use, Suspense } from 'react';

// Function that returns a promise
async function fetchUserProfile(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // use() suspends the component until the promise resolves
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

// Usage with Suspense
function ProfilePage({ userId }: { userId: string }) {
  // Create promise outside the component that uses use()
  const userPromise = fetchUserProfile(userId);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

### Replacing useContext

`use()` can also consume contexts, and unlike `useContext`, it can be used conditionally:

```tsx
import { use, createContext } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');
const UserContext = createContext<User | null>(null);

function ConditionalTheming({ useSystemTheme }: { useSystemTheme: boolean }) {
  // ✅ Now it's possible to use context conditionally
  const theme = useSystemTheme 
    ? getSystemTheme() 
    : use(ThemeContext);

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      {/* content */}
    </div>
  );
}

// Also works in loops
function UserList({ userIds }: { userIds: string[] }) {
  return (
    <ul>
      {userIds.map(id => {
        // use() inside a loop - impossible with useContext
        const user = use(fetchUser(id));
        return <li key={id}>{user.name}</li>;
      })}
    </ul>
  );
}
```

## Ref Callbacks with Cleanup

### The previous problem

Before React 19, ref callbacks had no way to do cleanup, causing memory leaks with observers:

```tsx
// ❌ React 18: Potential memory leak
function OldComponent() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    // Complicated manual cleanup
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      observerRef.current = new IntersectionObserver(/* ... */);
      observerRef.current.observe(element);
    }
  }, []);

  // ⚠️ Also need useEffect for cleanup on unmount
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return <div ref={setRef} />;
}
```

### The React 19 solution

Now ref callbacks can return a cleanup function:

```tsx
// ✅ React 19: Automatic cleanup
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

    // ✅ Cleanup function - runs automatically
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

### Practical case: Resize Observer

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
      Drag to resize
    </div>
  );
}
```

## useTransition: Non-blocking navigations

### Improving perceived speed

`useTransition` allows marking updates as "non-urgent", keeping the UI responsive:

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

### Search without debounce

```tsx
function SearchWithTransition() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    // Urgent update: input always responsive
    setQuery(value);
    
    // Non-urgent update: can be interrupted
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
        placeholder="Search..."
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

## Native Metadata: Goodbye react-helmet

### Document metadata without libraries

React 19 allows rendering `<title>`, `<meta>` and `<link>` directly in components, and React hoists them to `<head>`:

```tsx
// ✅ React 19: Native
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.coverImage} />
      <link rel="canonical" href={`https://myblog.com/posts/${post.slug}`} />
      
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Reusable DocumentHead component

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
  const fullTitle = `${title} | My Site`;
  
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

### Preloading critical resources

React 19 includes APIs for declaratively preloading resources:

```tsx
import { preload, preinit, preconnect } from 'react-dom';

function App() {
  // Preconnect to external domains
  preconnect('https://fonts.googleapis.com');
  preconnect('https://api.example.com');
  
  // Preinitialize critical styles
  preinit('/styles/critical.css', { as: 'style' });
  
  // Preload fonts
  preload('/fonts/inter-var.woff2', { 
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  });
  
  // Preload hero image
  preload('/images/hero.webp', { as: 'image' });

  return (
    <main>
      {/* Your app */}
    </main>
  );
}
```

### Hook for intelligent preloading

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

// Usage
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

## Migration guide

### Step 1: Update dependencies

```bash
# Update React
pnpm add react@19 react-dom@19

# Update types
pnpm add -D @types/react@19 @types/react-dom@19

# Remove unnecessary dependencies
pnpm remove react-helmet-async
```

### Step 2: Gradual migration by feature

```tsx
// Before: Custom hook with multiple states
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

// After: useActionState
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

### Step 3: Migration checklist

```typescript
// migration-checklist.ts
export const react19MigrationChecklist = {
  hooks: {
    'useState + loading states': 'useActionState',
    'manual optimistic updates': 'useOptimistic',
    'conditional useContext': 'use(Context)',
    'async data in render': 'use(Promise) + Suspense'
  },
  
  components: {
    'react-helmet-async': 'native <title>, <meta>',
    'forwardRef': 'ref as regular prop',
    'ref callbacks without cleanup': 'ref callbacks with return cleanup'
  },
  
  patterns: {
    'manual resource-hints': 'preload(), preinit(), preconnect()',
    'Context.Provider nesting': 'Context as direct provider'
  },
  
  dependencies_to_remove: [
    'react-helmet-async',
    'react-helmet'
  ]
};
```

## Conclusion: The future is now

React 19 represents a fundamental shift in how we think about state, actions, and resource loading. The new APIs aren't just "syntactic sugar" - they solve real architectural problems:

- **useActionState**: Eliminates the need for multiple states for forms
- **useOptimistic**: Makes the UI feel instant
- **use()**: Simplifies consuming async data and contexts
- **Ref callbacks with cleanup**: Elegantly prevents memory leaks
- **Native metadata**: Reduces dependencies and improves SSR

My recommendation: **start the migration gradually**. Identify the most used forms, components with optimistic updates, and migrate one by one. The benefit in cleaner code and better UX is completely worth the investment.

Have you started using React 19 in production? Which API have you found most useful? I'd love to hear about your experience.
