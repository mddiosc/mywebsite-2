import { StrictMode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { queryClient } from './lib/queryClient'
import { initializeCriticalResources } from './lib/resourcePreloading'

import './styles/index.css'

// React 19: Initialize critical resource preloading
initializeCriticalResources()

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {recaptchaSiteKey ? (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <App />
          </GoogleReCaptchaProvider>
        ) : (
          <App />
        )}
        <ReactQueryDevtools initialIsOpen={false} />
        <SpeedInsights />
      </QueryClientProvider>
    </StrictMode>,
  )
}
