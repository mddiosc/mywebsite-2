/**
 * Security utilities for rate limiting
 */

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
