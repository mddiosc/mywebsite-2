import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const changeLanguage = async (language: string) => {
    const currentPath = location.pathname
    const newPath = currentPath.replace(/\/(es|en)\//, `/${language}/`)
    await i18n.changeLanguage(language)
    await navigate(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          void changeLanguage('es')
        }}
        className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
          i18n.language === 'es'
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-600 hover:text-purple-600'
        }`}
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
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-600 hover:text-purple-600'
        }`}
      >
        EN
      </button>
    </div>
  )
}
