/**
 * Type definitions for the Contact module
 *
 * This module provides all TypeScript interfaces, types, and Zod schemas
 * required for contact form functionality including validation and security.
 */

import { z } from 'zod'

/**
 * Zod validation schema for contact form data
 *
 * Provides comprehensive validation including:
 * - Name: 2-50 characters, alphabetic characters only
 * - Email: Standard email format validation up to 100 characters
 * - Project type: Predefined enum values
 * - Message: 10-500 characters with XSS protection patterns
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'validation.name.min')
    .max(50, 'validation.name.max')
    .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s'-]+$/, 'validation.name.invalid'),
  email: z
    .string()
    .max(100, 'validation.email.max')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
      'validation.email.invalid',
    ),
  'project-type': z.enum(['personal', 'business', 'consulting', 'opensource', 'other']),
  message: z
    .string()
    .min(10, 'validation.message.min')
    .max(500, 'validation.message.max')
    .refine(
      (msg) => {
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /eval\s*\(/i,
          /expression\s*\(/i,
        ]
        return !suspiciousPatterns.some((pattern) => pattern.test(msg))
      },
      { message: 'validation.message.suspicious' },
    ),
})

/**
 * Contact form data type inferred from Zod schema
 *
 * Represents the validated structure of contact form submissions
 * with all security validations applied.
 */
export type ContactFormData = z.infer<typeof ContactFormSchema>

/**
 * Legacy interface for contact form data
 *
 * @deprecated Use ContactFormData type instead
 * Maintained for backward compatibility
 */
export interface ContactFormDataInterface {
  name: string
  email: string
  'project-type': string
  message: string
}

/**
 * Configuration interface for project type selector options
 *
 * Defines the structure for dropdown options in the project type field
 */
export interface ProjectTypeOption {
  /** Unique identifier for the project type */
  value: string
  /** Internationalization key for the display label */
  label: string
}

/**
 * Options interface for form submission configuration
 *
 * Provides callback configuration for the contact form hook
 */

export interface SubmitFormOptions {
  onSuccess?: () => void
}
