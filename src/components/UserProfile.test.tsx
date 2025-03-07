import { describe, expect, it, vi } from 'vitest'

import { screen } from '@testing-library/react'

import { UserProfile } from './UserProfile'

import { renderWithProviders } from '../test/utils'

declare global {
  interface Window {
    fetch: ReturnType<typeof vi.fn>
  }
}

describe('UserProfile', () => {
  it('muestra loading mientras carga', () => {
    renderWithProviders(<UserProfile />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('muestra el perfil del usuario después de cargar', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' }

    vi.spyOn(window, 'fetch').mockImplementationOnce(async () =>
      Promise.resolve({
        ok: true,
        json: async () => Promise.resolve(mockUser),
      } as Response),
    )

    renderWithProviders(<UserProfile />)

    // Verifica estado de loading
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Verifica que los datos se muestran
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(await screen.findByText('john@example.com')).toBeInTheDocument()
  })

  it('muestra error cuando falla la petición', async () => {
    vi.spyOn(window, 'fetch').mockImplementationOnce(async () =>
      Promise.resolve({
        ok: false,
      } as Response),
    )

    renderWithProviders(<UserProfile />)
    expect(await screen.findByText('Error loading user')).toBeInTheDocument()
  })
})
