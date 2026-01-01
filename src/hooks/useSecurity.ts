import { useCallback } from 'react'

import { checkRateLimit, generateRateLimitId, sanitizeTextInput } from '@/lib/security'

/**
 * Security hook for form validation and rate limiting
 */
export const useSecurity = () => {
  /**
   * Sanitize user input to prevent XSS attacks
   */
  const sanitizeInput = useCallback((input: string): string => {
    return sanitizeTextInput(input)
  }, [])

  /**
   * Check if user can perform an action (rate limiting)
   */
  const checkActionAllowed = useCallback(
    (action?: string): { allowed: boolean; retryAfter?: number } => {
      const actionName = action ?? 'form-submit'
      const rateLimitId = generateRateLimitId()
      const identifier = `${rateLimitId}-${actionName}`

      return checkRateLimit(identifier)
    },
    [],
  )

  /**
   * Validate that input doesn't contain potentially dangerous content
   */
  const validateSecureInput = useCallback((input: string): { isValid: boolean; error?: string } => {
    // Check for obvious script injection attempts
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          error: 'Input contains potentially dangerous content',
        }
      }
    }

    return { isValid: true }
  }, [])

  /**
   * Security headers to suggest for deployment
   */
  const getSecurityHeaders = useCallback(() => {
    return {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://mywebsite-umami.mddiosc.cloud; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://mywebsite-umami.mddiosc.cloud;",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy':
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
    }
  }, [])

  return {
    sanitizeInput,
    checkActionAllowed,
    validateSecureInput,
    getSecurityHeaders,
  }
}
