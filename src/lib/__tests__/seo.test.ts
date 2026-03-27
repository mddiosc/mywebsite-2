import { describe, expect, it } from 'vitest'

import { buildLocalizedSeoUrls } from '../seo'

describe('buildLocalizedSeoUrls', () => {
  it('builds canonical and alternates for root route', () => {
    const result = buildLocalizedSeoUrls('https://example.com/', '/', 'es')

    expect(result.canonicalUrl).toBe('https://example.com/es/')
    expect(result.alternateUrls).toEqual([
      { hreflang: 'es', href: 'https://example.com/es/' },
      { hreflang: 'en', href: 'https://example.com/en/' },
      { hreflang: 'x-default', href: 'https://example.com/es/' },
    ])
  })

  it('normalizes nested path routes', () => {
    const result = buildLocalizedSeoUrls('https://example.com///', 'about/', 'en')

    expect(result.canonicalUrl).toBe('https://example.com/en/about')
    expect(result.alternateUrls).toEqual([
      { hreflang: 'es', href: 'https://example.com/es/about' },
      { hreflang: 'en', href: 'https://example.com/en/about' },
      { hreflang: 'x-default', href: 'https://example.com/es/about' },
    ])
  })

  it('preserves slug routes and switches only locale prefix', () => {
    const result = buildLocalizedSeoUrls('https://example.com', '/blog/my-post', 'en')

    expect(result.canonicalUrl).toBe('https://example.com/en/blog/my-post')
    expect(result.alternateUrls).toEqual([
      { hreflang: 'es', href: 'https://example.com/es/blog/my-post' },
      { hreflang: 'en', href: 'https://example.com/en/blog/my-post' },
      { hreflang: 'x-default', href: 'https://example.com/es/blog/my-post' },
    ])
  })
})
