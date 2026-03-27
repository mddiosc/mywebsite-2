import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useBlogPost } from '../../hooks/useBlog'
import i18n from '../../test/i18n-for-tests'
import { renderWithProviders } from '../../test/utils'

import Home from '../Home'
import { BlogPost } from '../Blog/components/BlogPost'
import NotFoundPage from '../NotFound'

vi.mock('../../hooks/useBlog', () => ({
  useBlogPost: vi.fn(),
}))

vi.mock('@/context', () => ({
  useThemeContext: () => ({ isDark: false }),
}))

vi.mock('highlight.js/styles/github.css', () => ({}))
vi.mock('highlight.js/styles/github-dark.css', () => ({}))

const mockedUseBlogPost = vi.mocked(useBlogPost)

function clearSeoTags() {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[name="robots"]')
    .forEach((el) => {
      el.remove()
    })
}

function getSiteUrl() {
  return String(process.env.VITE_SITE_URL ?? 'https://example.com').replace(/\/+$/, '')
}

describe('SEO metadata for localized routes', () => {
  beforeEach(() => {
    mockedUseBlogPost.mockReset()
    clearSeoTags()
  })

  it.each(['es', 'en'] as const)(
    'renders canonical and alternates for static home route in %s',
    async (locale) => {
      await i18n.changeLanguage(locale)

      renderWithProviders(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
      )

      const siteUrl = getSiteUrl()

      await waitFor(() => {
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
          `${siteUrl}/${locale}/`,
        )
      })

      expect(
        document.head.querySelector('link[rel="alternate"][hrefLang="es"]')?.getAttribute('href'),
      ).toBe(`${siteUrl}/es/`)
      expect(
        document.head.querySelector('link[rel="alternate"][hrefLang="en"]')?.getAttribute('href'),
      ).toBe(`${siteUrl}/en/`)
      expect(
        document.head
          .querySelector('link[rel="alternate"][hrefLang="x-default"]')
          ?.getAttribute('href'),
      ).toBe(`${siteUrl}/es/`)
    },
  )

  it.each(['es', 'en'] as const)(
    'renders canonical and alternates for detail blog route in %s',
    async (locale) => {
      await i18n.changeLanguage(locale)
      mockedUseBlogPost.mockReturnValue({
        data: {
          meta: {
            title: 'Test Post',
            description: 'Test description',
            date: '2026-03-27',
            author: 'Miguel',
            tags: ['react'],
            featured: false,
            slug: 'my-post',
          },
          content: '# Test',
          slug: 'my-post',
          readingTime: 2,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })

      renderWithProviders(
        <MemoryRouter initialEntries={[`/${locale}/blog/my-post`]}>
          <Routes>
            <Route path="/:lang/blog/:slug" element={<BlogPost />} />
          </Routes>
        </MemoryRouter>,
      )

      const siteUrl = getSiteUrl()

      await waitFor(() => {
        expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
          `${siteUrl}/${locale}/blog/my-post`,
        )
      })

      expect(
        document.head.querySelector('link[rel="alternate"][hrefLang="es"]')?.getAttribute('href'),
      ).toBe(`${siteUrl}/es/blog/my-post`)
      expect(
        document.head.querySelector('link[rel="alternate"][hrefLang="en"]')?.getAttribute('href'),
      ).toBe(`${siteUrl}/en/blog/my-post`)
      expect(
        document.head
          .querySelector('link[rel="alternate"][hrefLang="x-default"]')
          ?.getAttribute('href'),
      ).toBe(`${siteUrl}/es/blog/my-post`)
    },
  )

  it('keeps 404 page as non-indexable without canonical or alternates', async () => {
    await i18n.changeLanguage('en')

    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, nofollow',
    )
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(0)
  })
})
