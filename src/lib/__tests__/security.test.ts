/**
 * Tests for security utilities
 *
 * Comprehensive testing for:
 * - HTML sanitization functions
 * - Rate limiting logic
 * - Input validation
 * - XSS prevention
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  checkRateLimit,
  generateRateLimitId,
  sanitizeEmail,
  sanitizeHtml,
  sanitizeTextInput,
  sanitizeUrl,
} from '../security'

describe('sanitizeHtml', () => {
  it('should remove script tags and content', () => {
    const input = 'Hello <script>alert("xss")</script> world'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert("xss")')
    expect(result).toContain('Hello')
    expect(result).toContain('world')
  })

  it('should remove dangerous HTML tags', () => {
    const input = 'Test <iframe src="evil.com"></iframe> content'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('<iframe>')
    expect(result).not.toContain('src="evil.com"')
    expect(result).toContain('Test')
    expect(result).toContain('content')
  })

  it('should remove event handlers', () => {
    const input = '<div onclick="alert(1)">Click me</div>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('onclick')
    expect(result).not.toContain('alert(1)')
  })

  it('should handle empty or null input', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml('   ')).toBe('   ')
  })

  it('should preserve safe content', () => {
    const input = 'This is <strong>bold</strong> text with a <a href="https://example.com">link</a>'
    const result = sanitizeHtml(input)
    expect(result).toContain('This is')
    expect(result).toContain('bold')
    expect(result).toContain('text with a')
    expect(result).toContain('link')
  })
})

describe('sanitizeTextInput', () => {
  it('should escape HTML characters', () => {
    const input = 'Hello <b>world</b>'
    const result = sanitizeTextInput(input)
    expect(result).toBe('Hello &lt;b&gt;world&lt;/b&gt;')
  })

  it('should escape special characters', () => {
    const input = 'Test & more "<script>alert(1)</script>"'
    const result = sanitizeTextInput(input)
    expect(result).toContain('&amp;')
    expect(result).toContain('&quot;')
    expect(result).toContain('&lt;script&gt;')
    expect(result).not.toContain('<script>')
  })

  it('should handle special characters', () => {
    const input = 'Test with émojis 😀 and accénts'
    const result = sanitizeTextInput(input)
    expect(result).toBe(input) // Should preserve safe special characters
  })

  it('should remove dangerous URL schemes', () => {
    const input = 'Check this javascript:alert(1) and data:text/html,evil'
    const result = sanitizeTextInput(input)
    expect(result).not.toContain('javascript:')
    expect(result).not.toContain('data:')
  })
})

describe('sanitizeEmail', () => {
  it('should sanitize email addresses properly', () => {
    expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com')
    expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com')
  })

  it('should handle invalid characters in email', () => {
    const result = sanitizeEmail('test<script>@example.com')
    expect(result).not.toContain('<script>')
    expect(result).toContain('test')
    expect(result).toContain('@example.com')
  })

  it('should preserve valid email format', () => {
    const validEmail = 'user.name+tag@domain.co.uk'
    const result = sanitizeEmail(validEmail)
    expect(result).toBe(validEmail.toLowerCase())
  })
})

describe('sanitizeUrl', () => {
  it('should handle valid URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
    expect(sanitizeUrl('http://test.org/path')).toBe('http://test.org/path')
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com')
  })

  it('should reject javascript URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#')
    expect(sanitizeUrl('JAVASCRIPT:void(0)')).toBe('#')
  })

  it('should reject data URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#')
  })

  it('should handle empty or invalid input', () => {
    expect(sanitizeUrl('')).toBe('#')
    expect(sanitizeUrl('not-a-url')).toBe('#')
    expect(sanitizeUrl('ftp://example.com')).toBe('#') // Not allowed protocol
  })
})

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

describe('generateRateLimitId', () => {
  it('should generate consistent IDs for same input', () => {
    const email = 'test@example.com'
    const id1 = generateRateLimitId(email)
    const id2 = generateRateLimitId(email)
    expect(id1).toBe(id2)
  })

  it('should generate different IDs for different inputs', () => {
    const id1 = generateRateLimitId('user1@example.com')
    const id2 = generateRateLimitId('user2@example.com')
    expect(id1).not.toBe(id2)
  })

  it('should handle empty input', () => {
    const result = generateRateLimitId('')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
