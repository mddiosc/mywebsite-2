import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Hook to manage HTML lang attribute for accessibility
 *
 * Automatically updates the document's lang attribute when the language changes,
 * ensuring screen readers and other assistive technologies can properly
 * identify the content language.
 *
 * This is crucial for accessibility as it helps screen readers use the
 * correct pronunciation and language-specific features.
 *
 * @example
 * ```tsx
 * function App() {
 *   useHtmlLang() // Automatically manages lang attribute
 *
 *   return (
 *     <div>App content</div>
 *   )
 * }
 * ```
 */
export const useHtmlLang = (): void => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update the HTML lang attribute when language changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language
    }
  }, [i18n.language])
}
