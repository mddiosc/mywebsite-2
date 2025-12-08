---
title: "Security in React Applications: A Practical Guide"
description: "Learn to protect your React applications: XSS prevention, CSP, sanitization, secure authentication, and frontend security best practices."
date: "2025-10-07"
tags: ["react", "security", "xss", "csp", "authentication", "best-practices"]
author: "Marco Di Dionisio"
slug: "react-security-guide"
featured: true
---

Security in frontend applications is often underestimated. "The real security work is in the backend," I hear frequently. But the reality is that many vulnerabilities are exploited directly in the browser. Today I want to share the practices I implement in all my React projects.

## The Myth of Backend-Only Security

```tsx
// ❌ Dangerous thinking
"If the backend validates, the frontend doesn't need to"

// The reality:
// 1. XSS can steal session tokens
// 2. CSRF can execute unauthorized actions
// 3. Sensitive data can be exposed in the client
// 4. Dependencies can have vulnerabilities
```

## XSS Prevention (Cross-Site Scripting)

### React Escapes by Default... But Not Always

```tsx
// ✅ Safe: React automatically escapes
function UserGreeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>; // <script> becomes &lt;script&gt;
}

// ❌ Dangerous: dangerouslySetInnerHTML
function BlogPost({ htmlContent }: { htmlContent: string }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

// ❌ Dangerous: Dynamic URLs
function UserProfile({ website }: { website: string }) {
  return <a href={website}>My site</a>; // javascript:alert('XSS')
}

// ❌ Dangerous: eval and similar
function DynamicComponent({ code }: { code: string }) {
  eval(code); // Never do this
  return <div />;
}
```

### HTML Sanitization

When you need to render external HTML, use a sanitization library:

```tsx
// lib/sanitize.ts
import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export function sanitizeHtml(
  dirty: string,
  options: SanitizeOptions = {}
): string {
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: options.allowedTags || [
      'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: options.allowedAttributes || [
      'href', 'target', 'rel', 'class'
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'], // For links to open in new tab
  };

  // Force rel="noopener noreferrer" on external links
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return DOMPurify.sanitize(dirty, config);
}
```

```tsx
// components/SafeHtml.tsx
import { sanitizeHtml } from '@/lib/sanitize';

interface Props {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: Props) {
  const cleanHtml = sanitizeHtml(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

// Usage
<SafeHtml html={post.content} className="prose" />
```

### URL Validation

```tsx
// lib/url-validation.ts
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(urlString: string): string {
  if (!urlString) return '#';
  
  // Prevent javascript: and data: URLs
  const trimmed = urlString.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '#';
  }
  
  return isValidUrl(urlString) ? urlString : '#';
}
```

```tsx
// components/SafeLink.tsx
import { sanitizeUrl } from '@/lib/url-validation';

interface Props {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function SafeLink({ href, children, external = false }: Props) {
  const safeHref = sanitizeUrl(href);
  
  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};

  return (
    <a href={safeHref} {...externalProps}>
      {children}
    </a>
  );
}
```

## Content Security Policy (CSP)

CSP is a crucial defense layer that prevents execution of unauthorized scripts.

### Basic Configuration

```typescript
// next.config.js or server headers
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'strict-dynamic'", // For dynamically generated scripts
    // Use nonce in production instead of 'unsafe-inline'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Needed for CSS-in-JS, ideally use nonce
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:', // Allow images from any HTTPS
  ],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://api.yourdomain.com',
  ],
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ');
```

### CSP with Nonce for Inline Scripts

```tsx
// middleware.ts (Next.js)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.yourdomain.com;
    frame-ancestors 'none';
  `.replace(/\n/g, '');
  
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  
  return response;
}
```

```tsx
// app/layout.tsx
import { headers } from 'next/headers';

export default function RootLayout({ children }) {
  const nonce = headers().get('x-nonce') ?? undefined;
  
  return (
    <html>
      <head>
        <script nonce={nonce}>
          {/* Safe inline script */}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Authentication and Tokens

### Secure Token Storage

```tsx
// ❌ Bad: localStorage is vulnerable to XSS
localStorage.setItem('token', accessToken);

// ❌ Bad: Token in accessible global state
const [token, setToken] = useState(accessToken);

// ✅ Better: httpOnly cookies (handled by backend)
// The token is never accessible from JavaScript

// ✅ Alternative: In-memory with refresh token in httpOnly cookie
class TokenManager {
  private accessToken: string | null = null;
  
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  
  getAccessToken() {
    return this.accessToken;
  }
  
  clearTokens() {
    this.accessToken = null;
  }
}

export const tokenManager = new TokenManager();
```

### Secure Axios Interceptor

```tsx
// lib/axios.ts
import axios from 'axios';
import { tokenManager } from './token-manager';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // To send cookies
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token is in an httpOnly cookie
        const { data } = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true
        });
        
        tokenManager.setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Route Protection

```tsx
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/token-manager';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session with backend
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else if (requireAuth) {
          router.replace('/login');
        }
      } catch {
        if (requireAuth) {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router]);

  return { isLoading, isAuthenticated };
}
```

```tsx
// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback = null }: Props) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}
```

## CSRF Protection

### CSRF Tokens

```tsx
// hooks/useCsrf.ts
import { useEffect, useState } from 'react';

export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include'
      });
      const { token } = await response.json();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  return csrfToken;
}
```

```tsx
// components/SecureForm.tsx
'use client';

import { useCsrf } from '@/hooks/useCsrf';

interface Props {
  action: string;
  method?: 'POST' | 'PUT' | 'DELETE';
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export function SecureForm({ 
  action, 
  method = 'POST', 
  children,
  onSubmit 
}: Props) {
  const csrfToken = useCsrf();

  return (
    <form action={action} method={method} onSubmit={onSubmit}>
      <input type="hidden" name="_csrf" value={csrfToken ?? ''} />
      {children}
    </form>
  );
}
```

## Secure Sensitive Data Handling

### Don't Expose Data to the Client

```tsx
// ❌ Bad: Sensitive data in state
interface User {
  id: string;
  email: string;
  password: string; // NEVER!
  ssn: string; // NEVER!
  role: string;
  permissions: string[];
}

// ✅ Good: Only data needed for UI
interface UserUI {
  id: string;
  displayName: string;
  avatarUrl: string;
  role: 'admin' | 'user';
}
```

### Data Masking

```tsx
// utils/masking.ts
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  
  const maskedLocal = local.length > 2
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : '**';
  
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  return `**** **** **** ${digits.slice(-4)}`;
}
```

```tsx
// components/SensitiveData.tsx
'use client';

import { useState } from 'react';
import { maskEmail } from '@/utils/masking';

interface Props {
  email: string;
}

export function MaskedEmail({ email }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      <span>{isVisible ? email : maskEmail(email)}</span>
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? 'Hide email' : 'Show email'}
      >
        {isVisible ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
```

## Secure Environment Variables

```tsx
// ❌ Bad: Exposing secrets to client
NEXT_PUBLIC_API_SECRET=super_secret_key // Visible in bundle

// ✅ Good: Secrets only on server
API_SECRET=super_secret_key // Only accessible in Server Components

// ✅ Good: Only public values with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
// lib/env.ts
// Environment variable validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'API_SECRET'
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Typed access to environment variables
export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  apiSecret: process.env.API_SECRET!,
  // Public variables
  public: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  }
};
```

## Dependency Auditing

### npm audit in CI/CD

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *' # Daily at midnight

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security audit
        run: npm audit --audit-level=high
      
      - name: Check for known vulnerabilities
        run: npx better-npm-audit audit
```

### Snyk Integration

```yaml
# .github/workflows/snyk.yml
name: Snyk Security

on:
  push:
    branches: [main]
  pull_request:

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

## Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Security Checklist

Before each deploy, verify:

- ✅ No `dangerouslySetInnerHTML` without sanitization
- ✅ Dynamic URLs validated
- ✅ CSP properly configured
- ✅ Tokens in httpOnly cookies or in-memory
- ✅ CSRF tokens in forms
- ✅ Sensitive variables not exposed to client
- ✅ npm audit with no high vulnerabilities
- ✅ Security headers configured
- ✅ Rate limiting on APIs
- ✅ Logs without sensitive data

## Conclusion

Frontend security is not optional. Every line of code we write can be an attack vector. What matters is:

- ✅ Assume all user input is malicious
- ✅ Implement multiple layers of defense
- ✅ Keep dependencies updated
- ✅ Regularly audit code
- ✅ Don't rely solely on the backend

What security practices do you implement in your React projects? Have I left something important out? 🔐
