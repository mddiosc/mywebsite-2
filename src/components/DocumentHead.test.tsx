import { beforeEach, describe, expect, it } from 'vitest'

import { render } from '@testing-library/react'

import { DocumentHead } from './DocumentHead'

function clearSeoHeadTags() {
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach((el) => {
    el.remove()
  })
}

describe('DocumentHead', () => {
  beforeEach(() => {
    clearSeoHeadTags()
  })

  it('renders canonical and alternate links when provided', () => {
    render(
      <DocumentHead
        title="Title"
        description="Description"
        ogType="article"
        ogImage="https://example.com/og.png"
        articlePublishedTime="2026-05-12T12:00:00.000Z"
        articleAuthor="Miguel"
        articleTags={['react', 'seo']}
        canonicalUrl="https://example.com/en/blog/test-post"
        alternateUrls={[
          { hreflang: 'es', href: 'https://example.com/es/blog/test-post' },
          { hreflang: 'en', href: 'https://example.com/en/blog/test-post' },
          { hreflang: 'x-default', href: 'https://example.com/es/blog/test-post' },
        ]}
      />,
    )

    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://example.com/en/blog/test-post',
    )
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(3)
    expect(
      document.head.querySelector('link[rel="alternate"][hrefLang="es"]')?.getAttribute('href'),
    ).toBe('https://example.com/es/blog/test-post')
    expect(
      document.head.querySelector('link[rel="alternate"][hrefLang="en"]')?.getAttribute('href'),
    ).toBe('https://example.com/en/blog/test-post')
    expect(
      document.head
        .querySelector('link[rel="alternate"][hrefLang="x-default"]')
        ?.getAttribute('href'),
    ).toBe('https://example.com/es/blog/test-post')

    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Title',
    )
    expect(
      document.head.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    ).toBe('Description')
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article',
    )
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://example.com/og.png',
    )
    expect(
      document.head
        .querySelector('meta[property="article:published_time"]')
        ?.getAttribute('content'),
    ).toBe('2026-05-12T12:00:00.000Z')
    expect(
      document.head.querySelector('meta[property="article:author"]')?.getAttribute('content'),
    ).toBe('Miguel')
    expect(document.head.querySelectorAll('meta[property="article:tag"]')).toHaveLength(2)
    expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    )
    expect(document.head.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(
      'Title',
    )
    expect(
      document.head.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    ).toBe('Description')
  })

  it('does not render canonical or alternates when omitted', () => {
    render(<DocumentHead title="Title" description="Description" robots="noindex, nofollow" />)

    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(0)
  })
})
