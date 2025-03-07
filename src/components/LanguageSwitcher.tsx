import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const changeLanguage = (language: string) => {
    const currentPath = location.pathname
    const newPath = currentPath.replace(/\/(es|en)\//, `/${language}/`)
    i18n.changeLanguage(language)
    navigate(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors
          ${
            i18n.language === 'es'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-purple-600'
          }`}
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors
          ${
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
