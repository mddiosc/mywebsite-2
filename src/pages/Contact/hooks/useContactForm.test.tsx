import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ContactFormData } from '../types'

const mockExecuteRecaptcha = vi.hoisted(() => vi.fn())

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const okResponse = (body: unknown = { success: true }): Response =>
  ({ ok: true, status: 200, json: () => Promise.resolve(body) }) as Response

// Mock reCAPTCHA — shared mock so tests can set return value
vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: mockExecuteRecaptcha,
  }),
}))

// Mock security utilities
vi.mock('../../../lib/security', () => ({
  checkRateLimit: () => ({ allowed: true }),
}))

// Mock environment variable
vi.stubEnv('VITE_FORMSPREE_ID', 'test-formspree-id')

// Now import the hook
import { useContactForm } from './useContactForm'

describe('useContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useContactForm())

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(typeof result.current.submitForm).toBe('function')
  })

  it('should handle successful form submission', async () => {
    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockFetch.mockResolvedValue(okResponse())

    const { result } = renderHook(() => useContactForm())

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData)
    })

    // Wait for the submission to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isPending).toBe(false)

    expect(mockFetch).toHaveBeenCalledWith(
      'https://formspree.io/f/test-formspree-id',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('john@example.com'),
      }),
    )
  })

  it('should handle form submission error', async () => {
    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useContactForm())

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.isPending).toBe(false)
    })
  })

  it('should fail when reCAPTCHA returns null token', async () => {
    mockExecuteRecaptcha.mockResolvedValue(null)

    const { result } = renderHook(() => useContactForm())

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.isPending).toBe(false)
    })
  })

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useContactForm())

    // Submit invalid data (missing required fields)
    const invalidData = {
      name: '',
      email: 'invalid-email',
      'project-type': 'personal' as const,
      message: '',
    }

    act(() => {
      result.current.submitForm(invalidData)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('should provide success callback functionality', async () => {
    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockFetch.mockResolvedValue(okResponse())

    const { result } = renderHook(() => useContactForm())

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData)
    })

    // With React 19's useActionState, isSuccess becomes true after successful submission
    // The consumer should use useEffect to react to isSuccess state changes
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Verify formState contains the submitted data for optimistic UI
    expect(result.current.formState.status).toBe('success')
  })
})
