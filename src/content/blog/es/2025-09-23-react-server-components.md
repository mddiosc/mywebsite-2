---
title: "React Server Components en Profundidad: Cuándo, Cómo y Por Qué"
description: "Guía completa sobre React Server Components: arquitectura, patrones de composición, streaming, casos de uso y cómo integrarlos en tu aplicación."
date: "2025-09-23"
tags: ["react", "server-components", "rsc", "nextjs", "performance", "architecture"]
author: "Miguel Ángel de Dios"
slug: "react-server-components-profundidad"
featured: false
---

En mi post sobre React 19, mencioné brevemente los Server Components. Hoy quiero profundizar en este paradigma que está cambiando fundamentalmente cómo construimos aplicaciones React.

## ¿Qué Son los Server Components?

Los React Server Components (RSC) son componentes que se ejecutan **exclusivamente en el servidor**. No se envían al cliente, no tienen estado, no usan efectos, y no tienen acceso a APIs del navegador.

```tsx
// Este componente NUNCA llega al bundle del cliente
async function ProductList() {
  // Puedo acceder directamente a la base de datos
  const products = await db.products.findMany();
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## Server vs Client Components

### La Directiva 'use client'

```tsx
// Por defecto, todo es Server Component
// ServerComponent.tsx
async function ServerComponent() {
  const data = await fetchData(); // ✅ Fetch directo
  return <div>{data}</div>;
}

// Para hacer un Client Component, añade la directiva
// ClientComponent.tsx
'use client';

import { useState } from 'react';

function ClientComponent() {
  const [count, setCount] = useState(0); // ✅ Puede usar hooks
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Tabla de Capacidades

| Característica | Server Component | Client Component |
|---------------|------------------|------------------|
| Fetch de datos async | ✅ | ❌ (necesita useEffect) |
| Acceso a backend directo | ✅ | ❌ |
| useState/useEffect | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| APIs del navegador | ❌ | ✅ |
| Tamaño en bundle | 0 KB | Incluido |

## Patrones de Composición

### El Patrón de Contenedor

```tsx
// ServerContainer.tsx (Server Component)
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id);
  const reviews = await db.reviews.findByProduct(id);
  
  return (
    <div>
      <ProductHeader product={product} />
      {/* Client Component para interactividad */}
      <AddToCartButton productId={id} price={product.price} />
      <ProductReviews reviews={reviews} />
    </div>
  );
}
```

```tsx
// AddToCartButton.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

interface Props {
  productId: string;
  price: number;
}

export function AddToCartButton({ productId, price }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  
  const handleClick = async () => {
    setIsAdding(true);
    await addItem(productId);
    setIsAdding(false);
  };
  
  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Añadiendo...' : `Añadir al carrito - $${price}`}
    </button>
  );
}
```

### Pasando Server Components como Children

```tsx
// Layout.tsx (Server Component)
async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  return (
    <div className="dashboard">
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}

// InteractiveWrapper.tsx (Client Component)
'use client';

import { useState } from 'react';

interface Props {
  children: React.ReactNode; // Puede recibir Server Components
}

export function CollapsibleSection({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Colapsar' : 'Expandir'}
      </button>
      {isOpen && children}
    </div>
  );
}
```

```tsx
// Page.tsx (Server Component)
async function AnalyticsPage() {
  const stats = await fetchAnalytics(); // Datos pesados del servidor
  
  return (
    <CollapsibleSection>
      {/* Este Server Component se renderiza en el servidor */}
      {/* pero la interactividad viene del Client Component padre */}
      <AnalyticsChart data={stats} />
    </CollapsibleSection>
  );
}
```

## Streaming y Suspense

### Streaming Progresivo

```tsx
// page.tsx
import { Suspense } from 'react';

export default function ProductPage({ id }: { id: string }) {
  return (
    <div>
      {/* Se muestra inmediatamente */}
      <ProductHeader id={id} />
      
      {/* Se muestra cuando esté listo */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={id} />
      </Suspense>
      
      {/* Se muestra cuando esté listo */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  );
}

// Cada componente async se resuelve independientemente
async function ProductReviews({ id }: { id: string }) {
  const reviews = await db.reviews.findByProduct(id); // 500ms
  return <ReviewList reviews={reviews} />;
}

async function Recommendations({ productId }: { productId: string }) {
  const products = await ml.getRecommendations(productId); // 2000ms
  return <ProductGrid products={products} />;
}
```

### Nested Suspense para UX Granular

```tsx
export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Suspense fallback={<CardSkeleton />}>
        <RevenueCard />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <UsersCard />
      </Suspense>
      
      <Suspense fallback={<CardSkeleton />}>
        <OrdersCard />
      </Suspense>
      
      <div className="col-span-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
      </div>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

## Data Fetching Patterns

### Fetch Paralelo vs Secuencial

```tsx
// ❌ Secuencial: cada fetch espera al anterior
async function SlowPage({ userId }: { userId: string }) {
  const user = await getUser(userId);        // 200ms
  const posts = await getPosts(userId);      // 300ms (espera a user)
  const comments = await getComments(userId); // 400ms (espera a posts)
  // Total: 900ms
  
  return <Profile user={user} posts={posts} comments={comments} />;
}

// ✅ Paralelo: todos los fetch simultáneos
async function FastPage({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    getUser(userId),      // 200ms
    getPosts(userId),     // 300ms (en paralelo)
    getComments(userId),  // 400ms (en paralelo)
  ]);
  // Total: 400ms (el más lento)
  
  return <Profile user={user} posts={posts} comments={comments} />;
}
```

### Preload Pattern

```tsx
// lib/data.ts
import { cache } from 'react';

// cache() deduplica llamadas en el mismo request
export const getUser = cache(async (id: string) => {
  const user = await db.users.findById(id);
  return user;
});

export const preloadUser = (id: string) => {
  void getUser(id);
};
```

```tsx
// page.tsx
import { preloadUser, getUser } from '@/lib/data';

export default async function UserPage({ id }: { id: string }) {
  // Inicia el fetch inmediatamente
  preloadUser(id);
  
  // Otros cálculos o renders...
  
  // Cuando necesitemos el user, probablemente ya estará cacheado
  const user = await getUser(id);
  
  return <UserProfile user={user} />;
}
```

## Server Actions

Los Server Actions permiten ejecutar código del servidor desde Client Components.

### Definiendo Server Actions

```tsx
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validación del lado del servidor
  if (!title || title.length < 3) {
    return { error: 'El título debe tener al menos 3 caracteres' };
  }
  
  await db.posts.create({
    data: { title, content }
  });
  
  revalidatePath('/posts');
  redirect('/posts');
}

export async function deletePost(id: string) {
  await db.posts.delete({ where: { id } });
  revalidatePath('/posts');
}
```

### Usando Server Actions en Forms

```tsx
// CreatePostForm.tsx
'use client';

import { useActionState } from 'react';
import { createPost } from './actions';

export function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  
  return (
    <form action={formAction}>
      <input
        name="title"
        placeholder="Título"
        disabled={isPending}
      />
      <textarea
        name="content"
        placeholder="Contenido"
        disabled={isPending}
      />
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear Post'}
      </button>
    </form>
  );
}
```

### Server Actions con Optimistic Updates

```tsx
// LikeButton.tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { likePost } from './actions';

interface Props {
  postId: string;
  initialLikes: number;
  isLiked: boolean;
}

export function LikeButton({ postId, initialLikes, isLiked }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimistic] = useOptimistic(
    { likes: initialLikes, isLiked },
    (state, newIsLiked: boolean) => ({
      likes: newIsLiked ? state.likes + 1 : state.likes - 1,
      isLiked: newIsLiked,
    })
  );

  const handleClick = () => {
    startTransition(async () => {
      setOptimistic(!optimisticState.isLiked);
      await likePost(postId);
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {optimisticState.isLiked ? '❤️' : '🤍'} {optimisticState.likes}
    </button>
  );
}
```

## Caché y Revalidación

### Estrategias de Caché

```tsx
// Fetch con caché por defecto (recomendado)
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

// Sin caché - siempre fresco
async function getCurrentUser() {
  const res = await fetch('https://api.example.com/me', {
    cache: 'no-store'
  });
  return res.json();
}

// Revalidación basada en tiempo
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidar cada hora
  });
  return res.json();
}

// Revalidación basada en tags
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`] }
  });
  return res.json();
}
```

### Revalidación Manual

```tsx
// actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updatePost(id: string, data: PostData) {
  await db.posts.update({ where: { id }, data });
  
  // Opción 1: Revalidar ruta específica
  revalidatePath(`/posts/${id}`);
  
  // Opción 2: Revalidar tag (afecta a todos los fetches con ese tag)
  revalidateTag(`post-${id}`);
  
  // Opción 3: Revalidar toda la sección
  revalidatePath('/posts', 'layout');
}
```

## Error Handling

### Error Boundaries para Server Components

```tsx
// error.tsx (Client Component por convención)
'use client';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="error-container">
      <h2>Algo salió mal</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
```

```tsx
// not-found.tsx
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>No encontrado</h2>
      <p>No pudimos encontrar el recurso solicitado.</p>
    </div>
  );
}
```

### Manejo Granular de Errores

```tsx
// page.tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Dashboard() {
  return (
    <div className="grid">
      <ErrorBoundary fallback={<CardError />}>
        <Suspense fallback={<CardSkeleton />}>
          <RevenueCard />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary fallback={<CardError />}>
        <Suspense fallback={<CardSkeleton />}>
          <UsersCard />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

## Casos de Uso Ideales

### ✅ Perfectos para Server Components

**Listados de datos:**

```tsx
async function BlogList() {
  const posts = await db.posts.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

**Páginas de detalle:**

```tsx
async function ProductDetail({ slug }: { slug: string }) {
  const product = await db.products.findUnique({
    where: { slug },
    include: { category: true, images: true }
  });
  
  if (!product) notFound();
  
  return <ProductView product={product} />;
}
```

**Markdown/MDX rendering:**

```tsx
async function BlogPost({ slug }: { slug: string }) {
  const { content, frontmatter } = await getPost(slug);
  const html = await markdownToHtml(content);
  
  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
```

### ❌ Requieren Client Components

1. **Interactividad del usuario** (clicks, forms dinámicos)
2. **Estado local** (toggles, modales, tabs)
3. **Efectos del navegador** (localStorage, geolocation)
4. **Librerías client-only** (algunos charts, editores)

## Migración Gradual

### De CSR/SSR Tradicional a RSC

```tsx
// Antes: Client Component con useEffect
'use client';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <Skeleton />;
  return <ul>{products.map(...)}</ul>;
}

// Después: Server Component
async function ProductList() {
  const products = await db.products.findMany();
  return <ul>{products.map(...)}</ul>;
}
```

## Conclusión

Los React Server Components representan un cambio de paradigma en cómo construimos aplicaciones. No son un reemplazo de los Client Components, sino un complemento que nos permite:

- ✅ Reducir drásticamente el JavaScript enviado al cliente
- ✅ Acceder directamente a datos del servidor
- ✅ Streaming progresivo con Suspense
- ✅ Mejor SEO y performance inicial
- ✅ Arquitectura más clara y mantenible

La clave está en entender cuándo usar cada tipo y cómo componerlos efectivamente.

¿Ya estás usando Server Components en tus proyectos? ¿Qué desafíos has encontrado? 🚀
