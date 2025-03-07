import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
})
