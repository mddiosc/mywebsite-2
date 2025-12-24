import '@testing-library/jest-dom'
import { afterEach, beforeAll, vi } from 'vitest'

import { cleanup } from '@testing-library/react'

// Import and configure i18n for tests
import './i18n-for-tests'

// Store original console.error
const originalError = console.error

beforeAll(() => {
  // Suppress specific known console errors in tests
  console.error = (...args: unknown[]) => {
    const message = String(args[0])

    // Suppress expected error messages from form validation tests
    if (message.includes('Error sending message') || message.includes('Validation error')) {
      return
    }

    // Call original for other errors
    originalError(...args)
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
