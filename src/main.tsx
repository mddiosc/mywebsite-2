import { StrictMode } from 'react'
import { preconnect } from 'react-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'

import App from './App'
import { initializeClientObservability } from './lib/clientObservability'
import { queryClient } from './lib/queryClient'

import './styles/fonts.css'
import './styles/index.css'

preconnect('https://mywebsite-umami.mddiosc.cloud')
initializeClientObservability()

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </StrictMode>,
  )
}
