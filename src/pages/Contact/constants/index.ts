/**
 * Constants and configuration values for the Contact module
 *
 * This module centralizes all configuration constants, validation rules,
 * security patterns, and external URLs used throughout the contact functionality.
 */

import type { ProjectTypeOption } from '../types'

/**
 * Project type options for the contact form selector
 *
 * Defines available project categories that users can select when
 * submitting contact inquiries. Each option includes internationalization keys.
 */
export const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  { value: 'personal', label: 'contact.projectTypes.personal' },
  { value: 'business', label: 'contact.projectTypes.business' },
  { value: 'consulting', label: 'contact.projectTypes.consulting' },
  { value: 'opensource', label: 'contact.projectTypes.opensource' },
  { value: 'other', label: 'contact.projectTypes.other' },
]

/**
 * Validation configuration limits
 *
 * Centralized validation constraints used by both Zod schema
 * and client-side validation logic.
 */
export const VALIDATION_CONFIG = {
  name: {
    min: 2,
    max: 50,
  },
  email: {
    max: 100,
  },
  message: {
    min: 10,
    max: 500,
  },
} as const

/**
 * Security patterns for XSS detection
 *
 * Regular expressions used to detect potentially malicious content
 * in form submissions. Applied during message validation.
 */
export const SUSPICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /expression\s*\(/i,
] as const

/**
 * Valid HTTP status codes for form submission
 *
 * HTTP status codes that are considered successful responses
 * from the form submission endpoint (Getform.io).
 */
export const VALID_HTTP_STATUS_CODES = [200, 201, 302] as const

/**
 * External LinkedIn profile URL
 *
 * Direct link to the developer's LinkedIn profile used in the contact header
 * for professional networking and alternative contact method.
 */
export const LINKEDIN_PROFILE_URL = `https://www.linkedin.com/in/${import.meta.env.VITE_LINKEDIN_USERNAME ?? 'miguel-angel-de-dios-calles'}/`
export const LINKEDIN_URL = LINKEDIN_PROFILE_URL
