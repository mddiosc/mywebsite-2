---
title: "Seguridad en Aplicaciones React: Guía Práctica"
description: "Aprende a proteger tus aplicaciones React: prevención de XSS, CSP, sanitización, autenticación segura, y mejores prácticas de seguridad frontend."
date: "2025-10-07"
tags: ["react", "security", "xss", "csp", "authentication", "best-practices"]
author: "Miguel Ángel de Dios"
slug: "seguridad-aplicaciones-react"
featured: true
---

La seguridad en aplicaciones frontend a menudo se subestima. "El verdadero trabajo de seguridad está en el backend", escucho frecuentemente. Pero la realidad es que muchas vulnerabilidades se explotan directamente en el navegador. Hoy quiero compartir las prácticas que implemento en todos mis proyectos React.

## El Mito de la Seguridad Solo en Backend

```tsx
// ❌ Pensamiento peligroso
"Si el backend valida, el frontend no necesita hacerlo"

// La realidad:
// 1. XSS puede robar tokens de sesión
// 2. CSRF puede ejecutar acciones no autorizadas
// 3. Datos sensibles pueden exponerse en el cliente
// 4. Las dependencias pueden tener vulnerabilidades
```

## Prevención de XSS (Cross-Site Scripting)

### React Escapa por Defecto... Pero No Siempre

```tsx
// ✅ Seguro: React escapa automáticamente
function UserGreeting({ name }: { name: string }) {
  return <h1>Hola, {name}</h1>; // <script> se escapa a &lt;script&gt;
}

// ❌ Peligroso: dangerouslySetInnerHTML
function BlogPost({ htmlContent }: { htmlContent: string }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

// ❌ Peligroso: URLs dinámicas
function UserProfile({ website }: { website: string }) {
  return <a href={website}>Mi sitio</a>; // javascript:alert('XSS')
}

// ❌ Peligroso: eval y similares
function DynamicComponent({ code }: { code: string }) {
  eval(code); // Nunca hagas esto
  return <div />;
}
```

### Sanitización de HTML

Cuando necesitas renderizar HTML externo, usa una librería de sanitización:

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
    ADD_ATTR: ['target'], // Para que los links abran en nueva pestaña
  };

  // Forzar rel="noopener noreferrer" en links externos
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

// Uso
<SafeHtml html={post.content} className="prose" />
```

### Validación de URLs

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
  
  // Prevenir javascript: y data: URLs
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

CSP es una capa de defensa crucial que previene la ejecución de scripts no autorizados.

### Configuración Básica

```typescript
// next.config.js o headers de servidor
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'strict-dynamic'", // Para scripts generados dinámicamente
    // Usar nonce en producción en lugar de 'unsafe-inline'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Necesario para CSS-in-JS, idealmente usar nonce
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:', // Permitir imágenes de cualquier HTTPS
  ],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://api.tudominio.com',
  ],
  'frame-ancestors': ["'none'"], // Prevenir clickjacking
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ');
```

### CSP con Nonce para Scripts Inline

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
    connect-src 'self' https://api.tudominio.com;
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
          {/* Script inline seguro */}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Autenticación y Tokens

### Almacenamiento Seguro de Tokens

```tsx
// ❌ Malo: localStorage es vulnerable a XSS
localStorage.setItem('token', accessToken);

// ❌ Malo: Token en estado global accesible
const [token, setToken] = useState(accessToken);

// ✅ Mejor: httpOnly cookies (manejadas por el backend)
// El token nunca es accesible desde JavaScript

// ✅ Alternativa: En memoria con refresh token en httpOnly cookie
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

### Interceptor de Axios Seguro

```tsx
// lib/axios.ts
import axios from 'axios';
import { tokenManager } from './token-manager';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Para enviar cookies
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
        // El refresh token está en una httpOnly cookie
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

### Protección de Rutas

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
        // Verificar sesión con el backend
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
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
}
```

## Protección CSRF

### Tokens CSRF

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

## Manejo Seguro de Datos Sensibles

### No Exponer Datos en el Cliente

```tsx
// ❌ Malo: Datos sensibles en el estado
interface User {
  id: string;
  email: string;
  password: string; // ¡NUNCA!
  ssn: string; // ¡NUNCA!
  role: string;
  permissions: string[];
}

// ✅ Bueno: Solo datos necesarios para la UI
interface UserUI {
  id: string;
  displayName: string;
  avatarUrl: string;
  role: 'admin' | 'user';
}
```

### Enmascaramiento de Datos

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
        aria-label={isVisible ? 'Ocultar email' : 'Mostrar email'}
      >
        {isVisible ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
```

## Variables de Entorno Seguras

```tsx
// ❌ Malo: Exponer secretos al cliente
NEXT_PUBLIC_API_SECRET=super_secret_key // Visible en el bundle

// ✅ Bueno: Secretos solo en el servidor
API_SECRET=super_secret_key // Solo accesible en Server Components

// ✅ Bueno: Solo valores públicos con NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
```

```tsx
// lib/env.ts
// Validación de variables de entorno
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

// Acceso tipado a variables de entorno
export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  apiSecret: process.env.API_SECRET!,
  // Variables públicas
  public: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  }
};
```

## Auditoría de Dependencias

### npm audit en CI/CD

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *' # Diario a medianoche

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

## Headers de Seguridad

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

## Checklist de Seguridad

Antes de cada deploy, verifica:

- ✅ No hay `dangerouslySetInnerHTML` sin sanitización
- ✅ URLs dinámicas validadas
- ✅ CSP configurado correctamente
- ✅ Tokens en httpOnly cookies o en memoria
- ✅ CSRF tokens en formularios
- ✅ Variables sensibles no expuestas al cliente
- ✅ npm audit sin vulnerabilidades altas
- ✅ Headers de seguridad configurados
- ✅ Rate limiting en APIs
- ✅ Logs sin datos sensibles

## Conclusión

La seguridad frontend no es opcional. Cada línea de código que escribimos puede ser un vector de ataque. Lo importante es:

- ✅ Asumir que toda entrada del usuario es maliciosa
- ✅ Implementar múltiples capas de defensa
- ✅ Mantener dependencias actualizadas
- ✅ Auditar regularmente el código
- ✅ No confiar solo en el backend

¿Qué prácticas de seguridad implementas en tus proyectos React? ¿He dejado algo importante fuera? 🔐
