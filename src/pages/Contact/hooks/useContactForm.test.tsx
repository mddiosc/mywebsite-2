import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { AxiosResponse } from 'axios'
import type { ContactFormData } from '../types'

// Mock axios
vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}))

// Mock reCAPTCHA
vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: vi.fn(),
  }),
}))

// Mock security hooks
vi.mock('../../../hooks/useSecurity', () => ({
  useSecurity: () => ({
    validateSecureInput: vi.fn(),
    getSecurityHeaders: () => ({ 'X-Security': 'test' }),
  }),
}))

// Mock security utilities
vi.mock('../../../lib/security', () => ({
  sanitizeHtml: (str: string) => str,
  sanitizeTextInput: (str: string) => str,
  checkRateLimit: () => ({ allowed: true }),
}))

// Mock environment variable
vi.stubEnv('VITE_GETFORM_ID', 'test-form-id')

// Now import the hook
import { useContactForm } from './useContactForm'

describe('useContactForm', () => {
  let queryClient: QueryClient

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(typeof result.current.submitForm).toBe('function')
  })

  it('should handle successful form submission', async () => {
    const { axiosInstance } = (await vi.importMock('@/lib/axios')) as {
      axiosInstance: { post: any }
    }
    const { useGoogleReCaptcha } = (await vi.importMock('react-google-recaptcha-v3')) as {
      useGoogleReCaptcha: () => { executeRecaptcha: any }
    }

    const mockPost = axiosInstance.post as any
    const mockExecuteRecaptcha = useGoogleReCaptcha().executeRecaptcha as any

    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockPost.mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse)

    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData)
    })

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isPending).toBe(false)

    expect(mockPost).toHaveBeenCalledWith(
      'https://getform.io/f/test-form-id',
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        'project-type': 'personal',
        message: 'Test message',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should handle form submission error', async () => {
    const { axiosInstance } = (await vi.importMock('@/lib/axios')) as {
      axiosInstance: { post: any }
    }
    const { useGoogleReCaptcha } = (await vi.importMock('react-google-recaptcha-v3')) as {
      useGoogleReCaptcha: () => { executeRecaptcha: any }
    }

    const mockPost = axiosInstance.post as any
    const mockExecuteRecaptcha = useGoogleReCaptcha().executeRecaptcha as any

    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockPost.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

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

  it('should handle missing reCAPTCHA token gracefully', async () => {
    const { axiosInstance } = (await vi.importMock('@/lib/axios')) as {
      axiosInstance: { post: any }
    }
    const { useGoogleReCaptcha } = (await vi.importMock('react-google-recaptcha-v3')) as {
      useGoogleReCaptcha: () => { executeRecaptcha: any }
    }

    const mockPost = axiosInstance.post as any
    const mockExecuteRecaptcha = useGoogleReCaptcha().executeRecaptcha as any

    mockExecuteRecaptcha.mockResolvedValue(null)
    mockPost.mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse)

    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

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
      expect(result.current.isSuccess).toBe(true)
    })

    // Should submit without reCAPTCHA token
    expect(mockPost).toHaveBeenCalledWith(
      'https://getform.io/f/test-form-id',
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        'project-type': 'personal',
        message: 'Test message',
      }),
      expect.any(Object),
    )

    // Should NOT include g-recaptcha-response when token is null
    const callArgs = mockPost.mock.calls[0]
    expect(callArgs[1]).not.toHaveProperty('g-recaptcha-response')
  })

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

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
    const { axiosInstance } = (await vi.importMock('@/lib/axios')) as {
      axiosInstance: { post: any }
    }
    const { useGoogleReCaptcha } = (await vi.importMock('react-google-recaptcha-v3')) as {
      useGoogleReCaptcha: () => { executeRecaptcha: any }
    }

    const mockPost = axiosInstance.post as any
    const mockExecuteRecaptcha = useGoogleReCaptcha().executeRecaptcha as any

    mockExecuteRecaptcha.mockResolvedValue('recaptcha-token')
    mockPost.mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse)

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useContactForm(), {
      wrapper: createWrapper(),
    })

    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      'project-type': 'personal',
      message: 'Test message',
    }

    act(() => {
      result.current.submitForm(formData, { onSuccess })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(onSuccess).toHaveBeenCalled()
  })
})
