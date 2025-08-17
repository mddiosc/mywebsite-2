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
      className="flex items-center gap-2"
      role="group"
      aria-label={t('accessibility.languageSwitcher', { defaultValue: 'Language switcher' })}
    >
      <button
        type="button"
        onClick={() => {
          void changeLanguage('es')
        }}
        className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
          i18n.language === 'es'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:text-indigo-600'
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
        className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:text-indigo-600'
        }`}
        aria-pressed={i18n.language === 'en'}
        aria-label={t('accessibility.switchToEnglish', { defaultValue: 'Switch to English' })}
      >
        EN
      </button>
    </div>
  )
}
