/**
 * Resource preloading utilities using React 19's native APIs
 *
 * React 19 introduces preload(), preinit(), and other APIs for
 * declaratively managing resource loading priorities.
 *
 * These APIs allow you to:
 * - Preload resources that will be needed later
 * - Initialize scripts and stylesheets with priority hints
 * - Prefetch resources for future navigations
 */

import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'

/**
 * Preload critical fonts for better LCP (Largest Contentful Paint)
 *
 * Call this early in your app to start loading fonts before they're needed.
 */
export function preloadCriticalFonts() {
  // Preload Inter font which is commonly used
  preload('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', {
    as: 'style',
  })
}

/**
 * Preconnect to external domains for faster resource loading
 *
 * Establishes early connections to known third-party origins.
 */
export function preconnectToOrigins() {
  // Google Fonts
  preconnect('https://fonts.googleapis.com')
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' })

  // Formspree (contact form)
  preconnect('https://formspree.io')

  // Google reCAPTCHA
  preconnect('https://www.google.com')
  preconnect('https://www.gstatic.com')

  // Umami Analytics
  preconnect('https://mywebsite-umami.mddiosc.cloud')
}

/**
 * Prefetch DNS for external domains
 *
 * Resolves DNS early for domains that will be used later.
 */
export function prefetchExternalDNS() {
  prefetchDNS('https://fonts.googleapis.com')
  prefetchDNS('https://formspree.io')
}

/**
 * Preinitialize critical stylesheets
 *
 * Loads and applies stylesheets with high priority.
 *
 * @param href - URL of the stylesheet
 * @param options - Optional precedence setting
 */
export function preinitStylesheet(
  href: string,
  options?: { precedence?: 'reset' | 'low' | 'medium' | 'high' },
) {
  preinit(href, { as: 'style', ...options })
}

/**
 * Preinitialize critical scripts
 *
 * Loads scripts with specified priority.
 *
 * @param src - URL of the script
 */
export function preinitScript(src: string) {
  preinit(src, { as: 'script' })
}

/**
 * Preload an image for faster rendering
 *
 * Useful for hero images or above-the-fold content.
 *
 * @param src - Image URL
 * @param options - Image attributes
 */
export function preloadImage(
  src: string,
  options?: {
    fetchPriority?: 'high' | 'low' | 'auto'
    imageSrcSet?: string
    imageSizes?: string
  },
) {
  preload(src, { as: 'image', ...options })
}

/**
 * Preload a font file
 *
 * @param href - Font file URL
 * @param type - Font MIME type
 */
export function preloadFont(href: string, type = 'font/woff2') {
  preload(href, { as: 'font', type, crossOrigin: 'anonymous' })
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
