/**
 * Contact form submission hook with enhanced security and validation
 *
 * This module provides secure form submission functionality with Google reCAPTCHA v3
 * integration, comprehensive input sanitization, rate limiting, and security monitoring.
 * Utilizes React 19's useActionState for declarative form state management and
 * useOptimistic for immediate UI feedback during submission.
 */

import { useActionState, useOptimistic, useCallback, useTransition } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import type { AxiosResponse } from 'axios'
import { z } from 'zod'

import { useSecurity } from '../../../hooks/useSecurity'
import { sanitizeHtml, sanitizeTextInput, checkRateLimit } from '../../../lib/security'
import { ContactFormSchema, type ContactFormData } from '../types'

import { axiosInstance } from '@/lib/axios'

/**
 * Form submission state for useActionState
 *
 * Represents all possible states during the form submission lifecycle
 */
export interface FormState {
  /** Current status of the form submission */
  status: 'idle' | 'pending' | 'success' | 'error'
  /** Error message when status is 'error' */
  error?: string
  /** Submitted data for optimistic updates */
  submittedData?: ContactFormData
}

/**
 * Sanitizes contact form data using enhanced security utilities
 *
 * Applies comprehensive sanitization to all text inputs while preserving
 * the project type selection which comes from a controlled dropdown.
 * Uses our enhanced security utilities for better XSS protection.
 *
 * @param data - Raw form data from user input
 * @returns Sanitized form data safe for submission
 */
const sanitizeData = (data: ContactFormData): ContactFormData => {
  return {
    name: sanitizeTextInput(data.name.trim()),
    email: sanitizeTextInput(data.email.trim().toLowerCase()),
    'project-type': data['project-type'], // Controlled dropdown, no sanitization needed
    message: sanitizeHtml(data.message.trim()),
  }
}

/**
 * Submits contact form data with comprehensive security validations
 *
 * Performs multi-layered security checks and validation:
 * 1. Validates data against Zod schema
 * 2. Checks rate limiting to prevent spam
 * 3. Sanitizes all user inputs
 * 4. Includes reCAPTCHA token if available
 * 5. Submits to Formspree.io endpoint with security headers
 * 6. Handles various HTTP response statuses
 *
 * @param data - Contact form data to submit
 * @param recaptchaToken - Optional Google reCAPTCHA v3 token
 * @returns Promise resolving to the HTTP response
 * @throws Error if validation fails, rate limit exceeded, or submission encounters issues
 */
const submitContactForm = async (
  data: ContactFormData,
  recaptchaToken?: string,
): Promise<AxiosResponse> => {
  // 1. Validate form data structure
  try {
    ContactFormSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(', ')
      throw new Error(`Validation error: ${errorMessages}`)
    }
    throw error
  }

  // 2. Check rate limiting
  const rateLimitId = `contact_form_${data.email}`
  const rateLimitResult = checkRateLimit(rateLimitId, 3, 60000) // 3 attempts per minute
  if (!rateLimitResult.allowed) {
    const retryMessage = rateLimitResult.retryAfter
      ? `Rate limit exceeded. Please wait ${String(rateLimitResult.retryAfter)} seconds before submitting again.`
      : 'Rate limit exceeded. Please wait before submitting again.'
    throw new Error(retryMessage)
  }

  // 3. Sanitize form data
  const sanitizedData = sanitizeData(data)

  // 4. Verify environment configuration
  const formspreeId = import.meta.env['VITE_FORMSPREE_ID'] as string
  if (!formspreeId) {
    throw new Error('VITE_FORMSPREE_ID environment variable is not configured')
  }

  // 5. Prepare form payload with optional reCAPTCHA
  const formData = recaptchaToken
    ? { ...sanitizedData, 'g-recaptcha-response': recaptchaToken }
    : sanitizedData

  // 6. Submit using axios for consistency with rest of app
  const response = await axiosInstance.post(`https://formspree.io/f/${formspreeId}`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Axios throws on error status codes automatically, so if we get here, it was successful
  return response
}

/**
 * Initial state for the form submission
 */
const initialFormState: FormState = {
  status: 'idle',
}

/**
 * React 19 hook for secure contact form submission with enhanced security
 *
 * Provides a complete form submission solution with:
 * - Google reCAPTCHA v3 integration for spam protection
 * - Rate limiting to prevent form abuse
 * - Input sanitization and validation
 * - Security monitoring and logging
 * - React 19's useActionState for declarative form handling
 * - useOptimistic for immediate UI feedback during submission
 * - Loading states and comprehensive error handling
 *
 * @returns Object containing submission function, state flags, and optimistic state
 */
export const useContactForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { validateSecureInput, getSecurityHeaders } = useSecurity()

  /**
   * Form action handler for useActionState
   *
   * Processes the form submission with all security validations
   */
  const formAction = useCallback(
    async (_previousState: FormState, data: ContactFormData): Promise<FormState> => {
      try {
        // Pre-submission security validation
        try {
          validateSecureInput(data.message)
        } catch (error) {
          throw new Error(`Security validation failed: ${String(error)}`)
        }

        // Get reCAPTCHA token
        let recaptchaToken: string | undefined
        if (executeRecaptcha) {
          try {
            recaptchaToken = await executeRecaptcha('contact_form')
          } catch (error) {
            console.warn('reCAPTCHA execution failed:', error)
            // Don't throw here, allow submission without reCAPTCHA as fallback
          }
        }

        await submitContactForm(data, recaptchaToken)

        return {
          status: 'success',
          submittedData: data,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

        console.error('Error sending message:', error)

        // Log security-related errors for monitoring
        if (errorMessage.includes('Rate limit') || errorMessage.includes('Security validation')) {
          console.warn('Security event:', {
            error: errorMessage,
            timestamp: new Date().toISOString(),
            headers: getSecurityHeaders(),
          })
        }

        return {
          status: 'error',
          error: errorMessage,
        }
      }
    },
    [executeRecaptcha, validateSecureInput, getSecurityHeaders],
  )

  // React 19's useActionState for declarative form state management
  const [formState, formActionDispatch, isFormPending] = useActionState(
    formAction,
    initialFormState,
  )

  // React 19's useOptimistic for immediate UI feedback
  const [optimisticState, addOptimistic] = useOptimistic(
    formState,
    (_currentState: FormState, optimisticData: ContactFormData): FormState => ({
      status: 'pending',
      submittedData: optimisticData,
    }),
  )

  // React 19's useTransition for wrapping async state updates
  const [isTransitionPending, startTransition] = useTransition()

  /**
   * Submit form with optimistic update wrapped in transition
   *
   * Uses React 19's startTransition to properly handle async state updates
   * and provide immediate visual feedback while the actual submission is processing.
   *
   * @param data - Contact form data to submit
   */
  const submitForm = useCallback(
    (data: ContactFormData): void => {
      startTransition(() => {
        // Show optimistic pending state immediately
        addOptimistic(data)
        // Dispatch the actual form action
        formActionDispatch(data)
      })
    },
    [addOptimistic, formActionDispatch, startTransition],
  )

  return {
    /** Function to submit form data */
    submitForm,
    /** Whether the submission is currently in progress (includes optimistic state) */
    isPending: isFormPending || isTransitionPending || optimisticState.status === 'pending',
    /** Whether the submission completed successfully */
    isSuccess: formState.status === 'success',
    /** Whether the submission encountered an error */
    isError: formState.status === 'error',
    /** Error message if submission failed */
    errorMessage: formState.error,
    /** Full form state for advanced use cases */
    formState: optimisticState,
    /** Raw action dispatch for form element action attribute */
    formAction: formActionDispatch,
  }
}
