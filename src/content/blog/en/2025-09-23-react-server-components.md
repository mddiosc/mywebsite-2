---
title: "React Server Components in Depth: When, How, and Why"
description: "Complete guide to React Server Components: architecture, composition patterns, streaming, use cases, and how to integrate them into your application."
date: "2025-09-23"
tags: ["react", "server-components", "rsc", "nextjs", "performance", "architecture"]
author: "Marco Di Dionisio"
slug: "react-server-components-depth"
featured: true
---

In my post about React 19, I briefly mentioned Server Components. Today I want to dive deep into this paradigm that is fundamentally changing how we build React applications.

## What Are Server Components?

React Server Components (RSC) are components that run **exclusively on the server**. They're not sent to the client, they have no state, they don't use effects, and they don't have access to browser APIs.

```tsx
// This component NEVER reaches the client bundle
async function ProductList() {
  // I can access the database directly
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

### The 'use client' Directive

```tsx
// By default, everything is a Server Component
// ServerComponent.tsx
async function ServerComponent() {
  const data = await fetchData(); // ✅ Direct fetch
  return <div>{data}</div>;
}

// To make a Client Component, add the directive
// ClientComponent.tsx
'use client';

import { useState } from 'react';

function ClientComponent() {
  const [count, setCount] = useState(0); // ✅ Can use hooks
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Capabilities Table

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Async data fetching | ✅ | ❌ (needs useEffect) |
| Direct backend access | ✅ | ❌ |
| useState/useEffect | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Bundle size | 0 KB | Included |

## Composition Patterns

### The Container Pattern

```tsx
// ServerContainer.tsx (Server Component)
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id);
  const reviews = await db.reviews.findByProduct(id);
  
  return (
    <div>
      <ProductHeader product={product} />
      {/* Client Component for interactivity */}
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
      {isAdding ? 'Adding...' : `Add to cart - $${price}`}
    </button>
  );
}
```

### Passing Server Components as Children

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
  children: React.ReactNode; // Can receive Server Components
}

export function CollapsibleSection({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Collapse' : 'Expand'}
      </button>
      {isOpen && children}
    </div>
  );
}
```

```tsx
// Page.tsx (Server Component)
async function AnalyticsPage() {
  const stats = await fetchAnalytics(); // Heavy data from server
  
  return (
    <CollapsibleSection>
      {/* This Server Component renders on the server */}
      {/* but interactivity comes from the parent Client Component */}
      <AnalyticsChart data={stats} />
    </CollapsibleSection>
  );
}
```

## Streaming and Suspense

### Progressive Streaming

```tsx
// page.tsx
import { Suspense } from 'react';

export default function ProductPage({ id }: { id: string }) {
  return (
    <div>
      {/* Shows immediately */}
      <ProductHeader id={id} />
      
      {/* Shows when ready */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews id={id} />
      </Suspense>
      
      {/* Shows when ready */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  );
}

// Each async component resolves independently
async function ProductReviews({ id }: { id: string }) {
  const reviews = await db.reviews.findByProduct(id); // 500ms
  return <ReviewList reviews={reviews} />;
}

async function Recommendations({ productId }: { productId: string }) {
  const products = await ml.getRecommendations(productId); // 2000ms
  return <ProductGrid products={products} />;
}
```

### Nested Suspense for Granular UX

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

### Parallel vs Sequential Fetch

```tsx
// ❌ Sequential: each fetch waits for the previous one
async function SlowPage({ userId }: { userId: string }) {
  const user = await getUser(userId);        // 200ms
  const posts = await getPosts(userId);      // 300ms (waits for user)
  const comments = await getComments(userId); // 400ms (waits for posts)
  // Total: 900ms
  
  return <Profile user={user} posts={posts} comments={comments} />;
}

// ✅ Parallel: all fetches simultaneous
async function FastPage({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    getUser(userId),      // 200ms
    getPosts(userId),     // 300ms (in parallel)
    getComments(userId),  // 400ms (in parallel)
  ]);
  // Total: 400ms (the slowest one)
  
  return <Profile user={user} posts={posts} comments={comments} />;
}
```

### Preload Pattern

```tsx
// lib/data.ts
import { cache } from 'react';

// cache() deduplicates calls in the same request
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
  // Start fetch immediately
  preloadUser(id);
  
  // Other calculations or renders...
  
  // When we need the user, it's probably already cached
  const user = await getUser(id);
  
  return <UserProfile user={user} />;
}
```

## Server Actions

Server Actions allow executing server code from Client Components.

### Defining Server Actions

```tsx
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Server-side validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
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

### Using Server Actions in Forms

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
        placeholder="Title"
        disabled={isPending}
      />
      <textarea
        name="content"
        placeholder="Content"
        disabled={isPending}
      />
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### Server Actions with Optimistic Updates

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

## Caching and Revalidation

### Caching Strategies

```tsx
// Fetch with cache by default (recommended)
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

// No cache - always fresh
async function getCurrentUser() {
  const res = await fetch('https://api.example.com/me', {
    cache: 'no-store'
  });
  return res.json();
}

// Time-based revalidation
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return res.json();
}

// Tag-based revalidation
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`] }
  });
  return res.json();
}
```

### Manual Revalidation

```tsx
// actions.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updatePost(id: string, data: PostData) {
  await db.posts.update({ where: { id }, data });
  
  // Option 1: Revalidate specific path
  revalidatePath(`/posts/${id}`);
  
  // Option 2: Revalidate tag (affects all fetches with that tag)
  revalidateTag(`post-${id}`);
  
  // Option 3: Revalidate entire section
  revalidatePath('/posts', 'layout');
}
```

## Error Handling

### Error Boundaries for Server Components

```tsx
// error.tsx (Client Component by convention)
'use client';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```tsx
// not-found.tsx
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <p>We couldn't find the requested resource.</p>
    </div>
  );
}
```

### Granular Error Handling

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

## Ideal Use Cases

### ✅ Perfect for Server Components

**Data listings:**

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

**Detail pages:**

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

### ❌ Require Client Components

- **User interactivity** (clicks, dynamic forms)
- **Local state** (toggles, modals, tabs)
- **Browser effects** (localStorage, geolocation)
- **Client-only libraries** (some charts, editors)

## Gradual Migration

### From Traditional CSR/SSR to RSC

```tsx
// Before: Client Component with useEffect
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

// After: Server Component
async function ProductList() {
  const products = await db.products.findMany();
  return <ul>{products.map(...)}</ul>;
}
```

## Conclusion

React Server Components represent a paradigm shift in how we build applications. They're not a replacement for Client Components, but a complement that allows us to:

- ✅ Drastically reduce JavaScript sent to the client
- ✅ Access server data directly
- ✅ Progressive streaming with Suspense
- ✅ Better SEO and initial performance
- ✅ Clearer, more maintainable architecture

The key is understanding when to use each type and how to compose them effectively.

Are you already using Server Components in your projects? What challenges have you encountered? 🚀
