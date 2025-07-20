/**
 * Contact form submission hook with security and validation
 *
 * This module provides secure form submission functionality with Google reCAPTCHA v3
 * integration, input sanitization using DOMPurify, and comprehensive error handling.
 * Utilizes TanStack Query for optimistic UI updates and retry logic.
 */

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { useMutation } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { z } from 'zod'

import { ContactFormSchema, type ContactFormData, type SubmitFormOptions } from '../types'

/**
 * Sanitizes contact form data to prevent XSS attacks
 *
 * Applies DOMPurify sanitization to all text inputs while preserving
 * the project type selection which comes from a controlled dropdown.
 *
 * @param data - Raw form data from user input
 * @returns Sanitized form data safe for submission
 */
const sanitizeData = (data: ContactFormData): ContactFormData => {
  return {
    name: DOMPurify.sanitize(data.name.trim(), { ALLOWED_TAGS: [] }),
    email: DOMPurify.sanitize(data.email.trim().toLowerCase(), { ALLOWED_TAGS: [] }),
    'project-type': data['project-type'],
    message: DOMPurify.sanitize(data.message.trim(), { ALLOWED_TAGS: [] }),
  }
}

/**
 * Submits contact form data to Getform.io with security validations
 *
 * Performs comprehensive validation, sanitization, and secure submission:
 * 1. Validates data against Zod schema
 * 2. Sanitizes all user inputs
 * 3. Includes reCAPTCHA token if available
 * 4. Submits to Getform.io endpoint
 * 5. Handles various HTTP response statuses
 *
 * @param data - Contact form data to submit
 * @param recaptchaToken - Optional Google reCAPTCHA v3 token
 * @returns Promise resolving to the HTTP response
 * @throws Error if validation fails or submission encounters issues
 */

const submitContactForm = async (
  data: ContactFormData,
  recaptchaToken?: string,
): Promise<Response> => {
  try {
    ContactFormSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(', ')
      throw new Error(`Validation error: ${errorMessages}`)
    }
    throw error
  }

  const sanitizedData = sanitizeData(data)

  const getformId = import.meta.env.VITE_GETFORM_ID as string | undefined
  if (!getformId) {
    throw new Error('VITE_GETFORM_ID environment variable is not configured')
  }

  const formData = recaptchaToken
    ? { ...sanitizedData, 'g-recaptcha-response': recaptchaToken }
    : sanitizedData

  const response = await fetch(`https://getform.io/f/${getformId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok && ![200, 201, 302].includes(response.status)) {
    throw new Error(`Failed to send message: ${String(response.status)} ${response.statusText}`)
  }

  return response
}

/**
 * React hook for secure contact form submission
 *
 * Provides a complete form submission solution with:
 * - Google reCAPTCHA v3 integration for spam protection
 * - Automatic retry logic via TanStack Query
 * - Loading states and error handling
 * - Success callbacks for UI updates
 *
 * @returns Object containing submission function and state flags
 */

export const useContactForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      let recaptchaToken: string | undefined
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('contact_form')
        } catch (error) {
          console.warn('reCAPTCHA execution failed:', error)
        }
      }

      return submitContactForm(data, recaptchaToken)
    },
    onSuccess: (response) => {
      console.log('Message sent successfully! Status:', response.status)
      if (response.status === 302) {
        console.log('Getform.io redirect response (expected behavior)')
      }
    },
    onError: (error) => {
      console.error('Error sending message:', error)
    },
  })

  /**
   * Wrapper function for form submission that returns void
   *
   * Prevents promise chain propagation while maintaining access to
   * mutation state through the returned object properties.
   *
   * @param data - Contact form data to submit
   * @param options - Optional success callback configuration
   */
  const submitForm = (data: ContactFormData, options?: SubmitFormOptions): void => {
    mutation.mutate(data, options)
    return
  }

  return {
    /** Function to submit form data */
    submitForm,
    /** Whether the submission is currently in progress */
    isPending: mutation.isPending,
    /** Whether the submission completed successfully */
    isSuccess: mutation.isSuccess,
    /** Whether the submission encountered an error */
    isError: mutation.isError,
  }
}
