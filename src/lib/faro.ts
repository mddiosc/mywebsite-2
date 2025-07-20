import { matchRoutes } from 'react-router'

import {
  initializeFaro,
  getWebInstrumentations,
  ReactIntegration,
  createReactRouterV6DataOptions,
} from '@grafana/faro-react'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

interface FaroWindow {
  faro?: {
    api: {
      pushError: (error: Error, context?: Record<string, unknown>) => void
      pushEvent: (name: string, attributes?: Record<string, unknown>) => void
      pushMeasurement: (measurement: {
        type: string
        name: string
        value: number
        attributes?: Record<string, unknown>
      }) => void
    }
  }
}

export const initializeFaroSDK = () => {
  if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_GRAFANA_FARO_URL) {
    console.log('Faro SDK not initialized in development mode')
    return
  }

  const faroUrl = import.meta.env.VITE_GRAFANA_FARO_URL
  const faroApiKey = import.meta.env.VITE_GRAFANA_FARO_API_KEY

  if (!faroUrl) {
    console.warn('Grafana Faro URL not configured')
    return
  }

  try {
    initializeFaro({
      url: faroUrl,
      apiKey: faroApiKey,
      app: {
        name: 'mywebsite2.0',
        version: '1.0.0',
        environment: import.meta.env.MODE,
      },
      instrumentations: [
        ...getWebInstrumentations({
          captureConsole: true,
        }),
        new TracingInstrumentation(),
        new ReactIntegration({
          router: createReactRouterV6DataOptions({
            matchRoutes,
          }),
        }),
      ],
      sessionTracking: {
        enabled: true,
        persistent: true,
      },
    })

    console.log('Grafana Faro SDK initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Grafana Faro SDK:', error)
  }
}

export const useFaroLogger = () => {
  const logError = (error: Error, context?: Record<string, unknown>) => {
    const faroWindow = window as unknown as FaroWindow
    if (typeof window !== 'undefined' && faroWindow.faro) {
      faroWindow.faro.api.pushError(error, context)
    } else {
      console.error('Faro not available:', error, context)
    }
  }

  const logEvent = (name: string, attributes?: Record<string, unknown>) => {
    const faroWindow = window as unknown as FaroWindow
    if (typeof window !== 'undefined' && faroWindow.faro) {
      faroWindow.faro.api.pushEvent(name, attributes)
    } else {
      console.log('Faro event:', name, attributes)
    }
  }

  const logMeasurement = (name: string, value: number, attributes?: Record<string, unknown>) => {
    const faroWindow = window as unknown as FaroWindow
    if (typeof window !== 'undefined' && faroWindow.faro) {
      faroWindow.faro.api.pushMeasurement({
        type: 'histogram',
        name,
        value,
        attributes,
      })
    } else {
      console.log('Faro measurement:', name, value, attributes)
    }
  }

  const logPageView = (path: string, additionalData?: Record<string, unknown>) => {
    logEvent('page_view', {
      path,
      timestamp: new Date().toISOString(),
      ...additionalData,
    })
  }

  return {
    logError,
    logEvent,
    logMeasurement,
    logPageView,
  }
}
