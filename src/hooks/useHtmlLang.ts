import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

const SUPPORTED_LANGUAGES = ['es', 'en'] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

function isSupportedLanguage(lang: string | undefined): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * Hook to manage HTML lang attribute for accessibility and sync the active
 * i18next language with the `:lang` URL param.
 *
 * The URL is the source of truth for language in this app (routes are
 * prefixed with `/:lang`). This hook ensures that whenever the `:lang` param
 * changes via client-side navigation, i18next is updated to match — preventing
 * a stale language state that would cause case studies and other locale-keyed
 * queries to return data for the wrong locale.
 *
 * It also keeps the HTML `lang` attribute in sync for accessibility.
 *
 * @example
 * ```tsx
 * function Layout() {
 *   useHtmlLang() // Syncs URL lang → i18next + updates <html lang>
 *   return <Outlet />
 * }
 * ```
 */
export const useHtmlLang = (): void => {
  const { i18n } = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  useEffect(() => {
    // Sync URL :lang param → i18next when they differ.
    // The URL is the source of truth; this covers deep links, back/forward
    // navigation, and any client-side route change that bypasses LanguageSwitcher.
    if (isSupportedLanguage(lang) && lang !== i18n.language) {
      void i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    // Update the HTML lang attribute when language changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language
    }
  }, [i18n.language])
}
