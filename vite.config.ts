import path from 'path'

import faroUploader from '@grafana/faro-rollup-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'production' && process.env.VITE_GRAFANA_FARO_API_KEY
      ? [
          faroUploader({
            appName: 'mywebsite2.0',
            endpoint: process.env.VITE_GRAFANA_FARO_ENDPOINT ?? '',
            appId: process.env.VITE_GRAFANA_FARO_APP_ID ?? '',
            stackId: process.env.VITE_GRAFANA_FARO_STACK_ID ?? '',
            apiKey: process.env.VITE_GRAFANA_FARO_API_KEY,
            gzipContents: true,
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
}))
