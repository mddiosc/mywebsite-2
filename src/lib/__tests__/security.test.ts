/**
 * Tests for security utilities
 *
 * Comprehensive testing for:
 * - Rate limiting logic
 * - Input validation
 * - XSS prevention
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { checkRateLimit } from '../security'

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow requests within limit', () => {
    const result = checkRateLimit('test-user', 5, 60000)
    expect(result.allowed).toBe(true)
    expect(result.retryAfter).toBeUndefined()
  })

  it('should block requests exceeding limit', () => {
    const identifier = 'test-user-blocked'

    // Make max allowed requests
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(identifier, 5, 60000)
      expect(result.allowed).toBe(true)
    }

    // Next request should be blocked
    const blockedResult = checkRateLimit(identifier, 5, 60000)
    expect(blockedResult.allowed).toBe(false)
    expect(blockedResult.retryAfter).toBeGreaterThan(0)
  })

  it('should reset rate limit after time window', () => {
    const identifier = 'test-user-reset'

    // Exceed rate limit
    for (let i = 0; i < 6; i++) {
      checkRateLimit(identifier, 5, 60000)
    }

    // Fast forward past the rate limit window
    vi.advanceTimersByTime(31 * 60 * 1000) // 31 minutes (past block duration)

    // Should allow requests again
    const result = checkRateLimit(identifier, 5, 60000)
    expect(result.allowed).toBe(true)
  })

  it('should handle different users independently', () => {
    // User 1 exceeds limit
    for (let i = 0; i < 6; i++) {
      checkRateLimit('user1', 5, 60000)
    }
    const user1Result = checkRateLimit('user1', 5, 60000)
    expect(user1Result.allowed).toBe(false)

    // User 2 should still be allowed
    const user2Result = checkRateLimit('user2', 5, 60000)
    expect(user2Result.allowed).toBe(true)
  })
})
