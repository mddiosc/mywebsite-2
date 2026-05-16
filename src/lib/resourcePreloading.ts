/**
 * Resource preloading utilities using React 19's native APIs
 *
 * React 19 introduces preconnect() and prefetchDNS() for
 * declaratively managing resource loading priorities.
 *
 * These APIs allow you to:
 * - Preconnect to origins that will be needed later
 * - Prefetch DNS for future navigations
 */

import { prefetchDNS, preconnect } from 'react-dom'

/**
 * Preconnect to external domains for faster resource loading
 *
 * Establishes early connections to known third-party origins.
 */
export function preconnectToOrigins() {
  // Formspree (contact form)
  preconnect('https://formspree.io')

  // Umami Analytics
  preconnect('https://mywebsite-umami.mddiosc.cloud')
}

/**
 * Prefetch DNS for external domains
 *
 * Resolves DNS early for domains that will be used later.
 */
export function prefetchExternalDNS() {
  prefetchDNS('https://formspree.io')
}

/**
 * Initialize all critical resources for the app
 *
 * Call this function at the app entry point for optimal loading.
 */
export function initializeCriticalResources() {
  preconnectToOrigins()
  prefetchExternalDNS()
}
