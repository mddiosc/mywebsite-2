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
  })

  it('does not render canonical or alternates when omitted', () => {
    render(<DocumentHead title="Title" description="Description" robots="noindex, nofollow" />)

    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(0)
  })
})
