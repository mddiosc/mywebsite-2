import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const changeLanguage = async (language: string) => {
    const currentPath = location.pathname
    const newPath = currentPath.replace(/\/(es|en)\//, `/${language}/`)
    await i18n.changeLanguage(language)
    await navigate(newPath)
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800"
      role="group"
      aria-label={t('accessibility.languageSwitcher', { defaultValue: 'Language switcher' })}
    >
      <button
        type="button"
        onClick={() => {
          void changeLanguage('es')
        }}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          i18n.language === 'es'
            ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary-light'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
        aria-pressed={i18n.language === 'es'}
        aria-label={t('accessibility.switchToSpanish', { defaultValue: 'Switch to Spanish' })}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => {
          void changeLanguage('en')
        }}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          i18n.language === 'en'
            ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary-light'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
        aria-pressed={i18n.language === 'en'}
        aria-label={t('accessibility.switchToEnglish', { defaultValue: 'Switch to English' })}
      >
        EN
      </button>
    </div>
  )
}
