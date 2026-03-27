const SUPPORTED_LOCALES = ['es', 'en'] as const

type Locale = (typeof SUPPORTED_LOCALES)[number]
type Hreflang = Locale | 'x-default'

export interface AlternateUrl {
  hreflang: Hreflang
  href: string
}

interface LocalizedSeoUrls {
  canonicalUrl: string
  alternateUrls: AlternateUrl[]
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '')
}

function normalizePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withoutDuplicateSlashes = normalized.replace(/\/+/g, '/')

  if (withoutDuplicateSlashes === '/') {
    return '/'
  }

  return withoutDuplicateSlashes.replace(/\/+$/, '')
}

function withLocale(path: string, locale: Locale): string {
  const normalizedPath = normalizePath(path)
  return normalizedPath === '/' ? `/${locale}/` : `/${locale}${normalizedPath}`
}

export function buildLocalizedSeoUrls(
  siteUrl: string,
  path: string,
  currentLocale: Locale,
  defaultLocale: Locale = 'es',
): LocalizedSeoUrls {
  const baseUrl = normalizeBaseUrl(siteUrl)

  const canonicalUrl = `${baseUrl}${withLocale(path, currentLocale)}`

  const localeAlternates: AlternateUrl[] = SUPPORTED_LOCALES.map((locale) => ({
    hreflang: locale,
    href: `${baseUrl}${withLocale(path, locale)}`,
  }))

  return {
    canonicalUrl,
    alternateUrls: [
      ...localeAlternates,
      {
        hreflang: 'x-default',
        href: `${baseUrl}${withLocale(path, defaultLocale)}`,
      },
    ],
  }
}
