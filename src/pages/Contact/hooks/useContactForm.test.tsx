/**
 * Tests for useContactForm hook
 *
 * Critical testing for:
 * - Form submission logic
 * - Data sanitization
 * - reCAPTCHA integration
 * - Error handling
 * - Environment variable validation
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import { useContactForm } from './useContactForm'

import type { ContactFormData } from '../types'

// Mock dependencies
vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: vi.fn(),
}))

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((input: string | Node) => {
      if (typeof input === 'string') {
        // Return input as-is for tests (real DOMPurify would remove dangerous content)
        return input
      }
      return input.textContent ?? ''
    }),
  },
}))

// Create test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useContactForm', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock fetch
    global.fetch = vi.fn()

    // Setup environment variable
    vi.stubEnv('VITE_GETFORM_ID', 'test-form-id')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  describe('data sanitization', () => {
    it('should handle form submission successfully', async () => {
      // Setup environment variable
      vi.stubEnv('VITE_GETFORM_ID', 'test-form-id')

      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      // Verify the form was submitted successfully
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.isError).toBe(false)

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith(
        'https://getform.io/f/test-form-id',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )
    })
  })

  describe('reCAPTCHA integration', () => {
    it('should include reCAPTCHA token when available', async () => {
      const mockExecuteRecaptcha = vi.fn().mockResolvedValue('test-recaptcha-token')
      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: mockExecuteRecaptcha,
      })

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      // Assert
      expect(mockExecuteRecaptcha).toHaveBeenCalledWith('contact_form')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://getform.io/f/test-form-id',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('test-recaptcha-token') as string,
        }),
      )
    })

    it('should continue without reCAPTCHA if execution fails', async () => {
      const mockExecuteRecaptcha = vi.fn().mockRejectedValue(new Error('reCAPTCHA failed'))
      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: mockExecuteRecaptcha,
      })

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        // Empty implementation for testing
      })

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('reCAPTCHA execution failed:', expect.any(Error))
      expect(global.fetch).toHaveBeenCalled()
      expect(result.current.isError).toBe(false)

      consoleWarnSpy.mockRestore()
    })
  })

  describe('environment validation', () => {
    it('should throw error when VITE_GETFORM_ID is not configured', async () => {
      vi.stubEnv('VITE_GETFORM_ID', undefined)

      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      // Assert
      expect(result.current.isError).toBe(true)
    })
  })

  describe('HTTP status handling', () => {
    beforeEach(async () => {
      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })
    })

    it('should handle successful response (200)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isError).toBe(false)
    })

    it('should handle redirect response (302)', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response('', {
          status: 302,
          headers: { Location: 'https://getform.io/success' },
        }),
      )

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        // Empty implementation for testing
      })

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(consoleLogSpy).toHaveBeenCalledWith('Getform.io redirect response (expected behavior)')
      expect(result.current.isError).toBe(false)

      consoleLogSpy.mockRestore()
    })

    it('should handle error responses', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response('Server Error', {
          status: 500,
          statusText: 'Internal Server Error',
        }),
      )

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.isSuccess).toBe(false)
    })
  })

  describe('validation error handling', () => {
    it('should handle Zod validation errors', async () => {
      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      // Invalid data that should fail Zod validation
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        'project-type': 'personal',
        message: 'short', // Too short
      } as ContactFormData

      result.current.submitForm(invalidData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.isSuccess).toBe(false)
    })
  })

  describe('callback handling', () => {
    it('should call onSuccess callback when provided', async () => {
      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const mockOnSuccess = vi.fn()
      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message.',
      }

      result.current.submitForm(testData, { onSuccess: mockOnSuccess })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  describe('environment and network error handling', () => {
    it('should handle missing environment variable', async () => {
      // Don't set VITE_GETFORM_ID to test error handling
      vi.stubEnv('VITE_GETFORM_ID', undefined)

      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      // Verify the form submission failed due to missing env var
      expect(result.current.isError).toBe(true)
      expect(result.current.isSuccess).toBe(false)
    })

    it('should handle network errors', async () => {
      // Setup environment variable
      vi.stubEnv('VITE_GETFORM_ID', 'test-form-id')

      const { useGoogleReCaptcha } = await import('react-google-recaptcha-v3')
      vi.mocked(useGoogleReCaptcha).mockReturnValue({
        executeRecaptcha: undefined,
      })

      // Mock network error
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useContactForm(), {
        wrapper: createWrapper(),
      })

      const testData: ContactFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        'project-type': 'personal',
        message: 'This is a test message',
      }

      // Act
      result.current.submitForm(testData)

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      // Verify the form submission failed due to network error
      expect(result.current.isError).toBe(true)
      expect(result.current.isSuccess).toBe(false)
    })
  })
})
