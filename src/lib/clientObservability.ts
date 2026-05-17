type WebVitalName = 'cls' | 'lcp' | 'fcp' | 'fid'

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

export type ClientObservabilityEvent =
  | {
      type: 'error'
      message: string
      filename?: string
      lineno?: number
      colno?: number
      stack?: string
    }
  | {
      type: 'unhandledrejection'
      reason: string
    }
  | {
      type: 'web-vital'
      name: WebVitalName
      value: number
    }

export type ClientObservabilitySink = (event: ClientObservabilityEvent) => void

let sink: ClientObservabilitySink | null = null
let initialized = false

const observers: (() => void)[] = []

function emit(event: ClientObservabilityEvent) {
  sink?.(event)
}

function toReason(value: unknown) {
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'symbol') {
    return value.description ?? 'Symbol'
  }
  try {
    return JSON.stringify(value)
  } catch {
    return Object.prototype.toString.call(value)
  }
}

function observeWebVitals() {
  if (typeof globalThis === 'undefined' || typeof globalThis.PerformanceObserver !== 'function') {
    return
  }

  const supportedTypes = ['largest-contentful-paint', 'layout-shift', 'paint'] as const
  const observer = new globalThis.PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        const shift = entry as LayoutShiftEntry
        if (shift.hadRecentInput) continue

        emit({ type: 'web-vital', name: 'cls', value: shift.value })
        continue
      }

      if (entry.entryType === 'largest-contentful-paint') {
        emit({ type: 'web-vital', name: 'lcp', value: entry.startTime })
        continue
      }

      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        emit({ type: 'web-vital', name: 'fcp', value: entry.startTime })
      }
    }
  })

  observer.observe({ type: supportedTypes[0], buffered: true })
  observer.observe({ type: supportedTypes[1], buffered: true })
  observer.observe({ type: supportedTypes[2], buffered: true })

  observers.push(() => {
    observer.disconnect()
  })
}

export function setClientObservabilitySink(nextSink: ClientObservabilitySink | null) {
  sink = nextSink
}

export function initializeClientObservability() {
  if (typeof globalThis === 'undefined' || initialized) {
    return () => undefined
  }

  initialized = true

  const onError = (event: ErrorEvent) => {
    emit({
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error instanceof Error ? event.error.stack : undefined,
    })
  }

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    emit({
      type: 'unhandledrejection',
      reason: toReason(event.reason),
    })
  }

  globalThis.addEventListener('error', onError)
  globalThis.addEventListener('unhandledrejection', onUnhandledRejection)
  observeWebVitals()

  return () => {
    globalThis.removeEventListener('error', onError)
    globalThis.removeEventListener('unhandledrejection', onUnhandledRejection)
    while (observers.length > 0) {
      observers.pop()?.()
    }
    initialized = false
  }
}

export function resetClientObservability() {
  sink = null
  initialized = false
  while (observers.length > 0) {
    observers.pop()?.()
  }
}
