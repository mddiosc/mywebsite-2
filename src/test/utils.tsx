import { ReactElement } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { render, RenderOptions } from '@testing-library/react'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const testQueryClient = createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}
