import { useTranslation } from 'react-i18next'

interface ProjectCaseStudyErrorProps {
  message: string
  onRetry?: () => void
}

export function ProjectCaseStudyError({ message, onRetry }: Readonly<ProjectCaseStudyErrorProps>) {
  const { t } = useTranslation()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      globalThis.location.reload()
    }
  }

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 p-3">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('projects.error.title')}</h3>
      <p className="text-gray-600">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
      >
        {t('projects.error.retry')}
      </button>
    </div>
  )
}
