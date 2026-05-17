import '@testing-library/jest-dom/vitest'
import { afterEach, beforeAll, vi } from 'vitest'

import { cleanup } from '@testing-library/react'

// Import and configure i18n for tests
import './i18n-for-tests'

// Mock window.matchMedia for components using useReducedMotion
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Store original console.error
const originalError = console.error

beforeAll(() => {
  // Suppress specific known console errors in tests
  console.error = (...args: unknown[]) => {
    // Build a reliable string from the first argument, handling Error objects
    const firstArg = args[0]
    let message: string
    if (firstArg instanceof Error) {
      message = firstArg.message
    } else if (typeof firstArg === 'string') {
      message = firstArg
    } else {
      message = JSON.stringify(firstArg)
    }

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
