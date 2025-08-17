import { useTranslation } from 'react-i18next'

/**
 * Skip Links component for improved keyboard navigation accessibility
 *
 * Provides quick navigation options for keyboard and screen reader users
 * to skip to main content areas and bypass repetitive navigation elements.
 *
 * Skip links are visually hidden by default but become visible when focused,
 * allowing keyboard users to quickly jump to important page sections.
 */
export const SkipLinks = () => {
  const { t } = useTranslation()

  const skipLinks = [
    {
      href: '#main-content',
      text: t('accessibility.skipToMain', { defaultValue: 'Skip to main content' }),
    },
    {
      href: '#navigation',
      text: t('accessibility.skipToNavigation', { defaultValue: 'Skip to navigation' }),
    },
    {
      href: '#footer',
      text: t('accessibility.skipToFooter', { defaultValue: 'Skip to footer' }),
    },
  ]

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
        >
          {link.text}
        </a>
      ))}
    </div>
  )
}
