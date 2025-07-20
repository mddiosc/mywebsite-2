/**
 * Tests for Contact form validation schemas and security
 *
 * Critical testing for:
 * - Zod schema validation rules
 * - XSS protection patterns
 * - Input sanitization validation
 * - Edge cases and security vulnerabilities
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'

import { ContactFormSchema, type ContactFormData } from './index'

describe('ContactFormSchema', () => {
  describe('name validation', () => {
    it('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'María García',
        'Jean-Pierre',
        "O'Connor",
        'José María',
        'Ana Sofía',
      ]

      validNames.forEach((name) => {
        const data = {
          name,
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).not.toThrow()
      })
    })

    it('should reject invalid names', () => {
      const invalidNames = [
        'J', // Too short
        'A'.repeat(51), // Too long
        'John123', // Contains numbers
        'John@Doe', // Contains special characters
        'John<script>', // Contains HTML
        '', // Empty
      ]

      invalidNames.forEach((name) => {
        const data = {
          name,
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).toThrow(z.ZodError)
      })
    })
  })

  describe('email validation', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+label@gmail.com',
        'user123@test-domain.org',
      ]

      validEmails.forEach((email) => {
        const data = {
          name: 'John Doe',
          email,
          'project-type': 'personal' as const,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).not.toThrow()
      })
    })

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user spaces@domain.com',
        'user@domain..com',
        'A'.repeat(95) + '@test.com', // Too long (over 100 chars)
      ]

      invalidEmails.forEach((email) => {
        const data = {
          name: 'John Doe',
          email,
          'project-type': 'personal' as const,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).toThrow(z.ZodError)
      })
    })
  })

  describe('project-type validation', () => {
    it('should accept valid project types', () => {
      const validTypes = ['personal', 'business', 'consulting', 'opensource', 'other'] as const

      validTypes.forEach((projectType) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': projectType,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).not.toThrow()
      })
    })

    it('should reject invalid project types', () => {
      const invalidTypes = ['invalid', 'random', '', 'hack']

      invalidTypes.forEach((projectType) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': projectType,
          message: 'This is a valid message with enough characters.',
        }
        expect(() => ContactFormSchema.parse(data)).toThrow(z.ZodError)
      })
    })
  })

  describe('message validation', () => {
    it('should accept valid messages', () => {
      const validMessages = [
        'This is a valid message with exactly ten chars.',
        'A'.repeat(10), // Minimum length
        'A'.repeat(500), // Maximum length
        'Message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      ]

      validMessages.forEach((message) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message,
        }
        expect(() => ContactFormSchema.parse(data)).not.toThrow()
      })
    })

    it('should reject messages that are too short or too long', () => {
      const invalidMessages = [
        'Short', // Too short (less than 10 chars)
        'A'.repeat(9), // Just under minimum
        'A'.repeat(501), // Just over maximum
        '', // Empty
      ]

      invalidMessages.forEach((message) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message,
        }
        expect(() => ContactFormSchema.parse(data)).toThrow(z.ZodError)
      })
    })

    it('should reject messages with suspicious XSS patterns', () => {
      const suspiciousMessages = [
        'This message contains <script>alert("xss")</script> malicious code.',
        'Click here: javascript:alert("xss")',
        'Image with onload: <img onload="alert(\'xss\')" src="x">',
        'Eval attempt: eval(alert("xss"))',
        'CSS expression: expression(alert("xss"))',
      ]

      suspiciousMessages.forEach((message) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message,
        }
        expect(() => ContactFormSchema.parse(data)).toThrow(z.ZodError)
      })
    })

    it('should accept messages with safe HTML-like content', () => {
      const safeMessages = [
        'I love the <3 symbol in messages',
        'Price: $100 < $200 for this project',
        'Math: 2 > 1 and 1 < 2 are true statements',
        'Email: contact@company.com for more info',
      ]

      safeMessages.forEach((message) => {
        const data = {
          name: 'John Doe',
          email: 'test@example.com',
          'project-type': 'personal' as const,
          message,
        }
        expect(() => ContactFormSchema.parse(data)).not.toThrow()
      })
    })
  })

  describe('complete form validation', () => {
    it('should validate a complete valid form', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        'project-type': 'business',
        message: 'I would like to discuss a potential collaboration project.',
      }

      expect(() => ContactFormSchema.parse(validData)).not.toThrow()
      const parsed = ContactFormSchema.parse(validData)
      expect(parsed).toEqual(validData)
    })

    it('should provide localized error keys', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid',
        'project-type': 'invalid',
        message: 'short',
      }

      try {
        ContactFormSchema.parse(invalidData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues
          expect(issues.some((issue) => issue.message === 'validation.name.min')).toBe(true)
          expect(issues.some((issue) => issue.message === 'validation.email.invalid')).toBe(true)
          expect(issues.some((issue) => issue.message === 'validation.message.min')).toBe(true)
        }
      }
    })
  })
})
