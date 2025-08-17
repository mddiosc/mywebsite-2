/**
 * Security utilities for input sanitization and validation
 */

/**
 * Basic HTML sanitization to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export const sanitizeHtml = (input: string): string => {
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove dangerous HTML tags
  const dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'link',
    'style',
    'meta',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'option',
  ]

  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<\\/?${tag}[^>]*>`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:/gi, '')

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  return sanitized
}

/**
 * Validate and sanitize email addresses
 */
export const sanitizeEmail = (email: string): string => {
  // Remove dangerous characters but preserve valid email format
  return email
    .replace(/[<>'"&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .toLowerCase()
    .trim()
}

/**
 * Sanitize text input to prevent injection attacks
 */
export const sanitizeTextInput = (input: string): string => {
  return input
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<':
          return '&lt;'
        case '>':
          return '&gt;'
        case '"':
          return '&quot;'
        case "'":
          return '&#x27;'
        case '&':
          return '&amp;'
        default:
          return char
      }
    })
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim()
}

/**
 * Validate URL to prevent dangerous protocols
 */
export const sanitizeUrl = (url: string): string => {
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']

  try {
    const urlObj = new URL(url.trim())

    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '#'
    }

    return urlObj.toString()
  } catch {
    // If URL parsing fails, return safe default
    return '#'
  }
}

/**
 * Rate limiting utility for form submissions
 */
interface RateLimitState {
  attempts: number
  lastAttempt: number
  blocked: boolean
}

const rateLimitStore = new Map<string, RateLimitState>()

export const checkRateLimit = (
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000, // 15 minutes
  blockDurationMs = 30 * 60 * 1000, // 30 minutes
): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now()
  const state = rateLimitStore.get(identifier) ?? {
    attempts: 0,
    lastAttempt: 0,
    blocked: false,
  }

  // Check if user is currently blocked
  if (state.blocked) {
    const timeSinceBlock = now - state.lastAttempt
    if (timeSinceBlock < blockDurationMs) {
      return {
        allowed: false,
        retryAfter: Math.ceil((blockDurationMs - timeSinceBlock) / 1000),
      }
    } else {
      // Reset after block period
      state.blocked = false
      state.attempts = 0
    }
  }

  // Reset attempts if window has passed
  const timeSinceLastAttempt = now - state.lastAttempt
  if (timeSinceLastAttempt > windowMs) {
    state.attempts = 0
  }

  // Increment attempts
  state.attempts++
  state.lastAttempt = now

  // Check if limit exceeded
  if (state.attempts > maxAttempts) {
    state.blocked = true
    rateLimitStore.set(identifier, state)
    return {
      allowed: false,
      retryAfter: Math.ceil(blockDurationMs / 1000),
    }
  }

  rateLimitStore.set(identifier, state)
  return { allowed: true }
}

/**
 * Generate a simple hash for rate limiting identifiers
 */
export const generateRateLimitId = (ip?: string, userAgent?: string): string => {
  // In a real application, you'd use IP and User-Agent
  // For client-side, we'll use a combination of available data
  const fingerprint = [
    ip ?? 'unknown-ip',
    userAgent ?? navigator.userAgent,
    window.location.hostname,
  ].join('|')

  // Simple hash function (in production, consider using crypto.subtle)
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return hash.toString(36)
}
