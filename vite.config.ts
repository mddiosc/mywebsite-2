import { readdirSync } from 'fs'
import path from 'path'
import { join } from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import sitemap from 'vite-plugin-sitemap'
import { configDefaults } from 'vitest/config'

// Generate all routes for the sitemap (static + dynamic blog routes)
function getSitemapRoutes(): string[] {
  const langs = ['es', 'en']
  const staticRoutes = langs.flatMap((lang) => [
    `/${lang}/`,
    `/${lang}/about`,
    `/${lang}/projects`,
    `/${lang}/contact`,
    `/${lang}/blog`,
  ])
  const blogRoutes = langs.flatMap((lang) => {
    const dir = join(__dirname, `src/content/blog/${lang}`)
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => `/${lang}/blog/${f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '')}`)
  })
  return [...staticRoutes, ...blogRoutes]
}

// Plugin to replace Umami analytics placeholder in index.html with env variable
function htmlEnvPlugin() {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace('%VITE_UMAMI_WEBSITE_ID%', process.env.VITE_UMAMI_WEBSITE_ID ?? '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    htmlEnvPlugin(),
    sitemap({
      hostname: process.env.VITE_SITE_URL ?? 'https://migueldedioscalles.com',
      dynamicRoutes: getSitemapRoutes(),
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // React core — highest priority, smallest stable chunk
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom)[\\/]/, priority: 30 },
            // Animations — large, changes independently of app code
            { name: 'animation-vendor', test: /node_modules[\\/]framer-motion[\\/]/, priority: 20 },
            // UI primitives
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](@headlessui|@heroicons|@floating-ui)[\\/]/,
              priority: 15,
            },
            // Data fetching, forms, validation, HTTP
            {
              name: 'data-vendor',
              test: /node_modules[\\/](@tanstack|react-hook-form|@hookform|zod|axios)[\\/]/,
              priority: 10,
            },
            // Internationalisation
            {
              name: 'i18n-vendor',
              test: /node_modules[\\/](react-i18next|i18next)[\\/]/,
              priority: 10,
            },
            // Markdown rendering — large, rarely changes
            {
              name: 'markdown-vendor',
              test: /node_modules[\\/](react-markdown|rehype|remark|highlight\.js)[\\/]/,
              priority: 5,
            },
          ],
        },
      },
    },
    // Optimize chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
    // Coverage configuration for Vitest 4
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
        'src/types/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/i18n/**',
        'src/constants/**',
      ],
      thresholds: {
        lines: 20,
        functions: 15,
        branches: 15,
        statements: 20,
      },
    },
  },
}))
