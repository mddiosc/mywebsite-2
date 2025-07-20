import { StrictMode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'

import App from './App'
import { queryClient } from './lib/queryClient'

import './styles/index.css'

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
      </QueryClientProvider>
    </StrictMode>,
  )
}
