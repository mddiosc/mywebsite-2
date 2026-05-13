import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  initializeClientObservability,
  resetClientObservability,
  setClientObservabilitySink,
  type ClientObservabilityEvent,
} from '../clientObservability'

class MockPerformanceObserver {
  static readonly instances: MockPerformanceObserver[] = []

  constructor(private readonly callback: (list: { getEntries: () => PerformanceEntry[] }) => void) {
    MockPerformanceObserver.instances.push(this)
  }

  observe = () => undefined

  disconnect = vi.fn()

  trigger(entries: PerformanceEntry[]) {
    this.callback({ getEntries: () => entries })
  }
}

describe('clientObservability', () => {
  beforeEach(() => {
    resetClientObservability()
    MockPerformanceObserver.instances.length = 0
    vi.stubGlobal('PerformanceObserver', MockPerformanceObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    resetClientObservability()
  })

  it('forwards runtime errors and web vitals to the configured sink', () => {
    const events: ClientObservabilityEvent[] = []
    setClientObservabilitySink((event) => {
      events.push(event)
    })

    initializeClientObservability()

    globalThis.dispatchEvent(new ErrorEvent('error', { message: 'Boom', error: new Error('Boom') }))

    const observer = MockPerformanceObserver.instances[0]
    observer.trigger([
      {
        entryType: 'largest-contentful-paint',
        name: 'largest-contentful-paint',
        startTime: 1234,
        duration: 0,
        toJSON: () => ({}),
      },
      {
        entryType: 'layout-shift',
        name: 'layout-shift',
        startTime: 0,
        duration: 0,
        value: 0.12,
        hadRecentInput: false,
        toJSON: () => ({}),
      } as PerformanceEntry,
    ])

    expect(events).toEqual([
      expect.objectContaining({ type: 'error', message: 'Boom' }),
      expect.objectContaining({ type: 'web-vital', name: 'lcp', value: 1234 }),
      expect.objectContaining({ type: 'web-vital', name: 'cls', value: 0.12 }),
    ])
  })

  it('is a no-op when no sink is configured', () => {
    expect(() => initializeClientObservability()).not.toThrow()
    globalThis.dispatchEvent(new ErrorEvent('error', { message: 'Ignored' }))
    expect(MockPerformanceObserver.instances.length).toBeGreaterThan(0)
  })
})
