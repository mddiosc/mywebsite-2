import { useTranslation } from 'react-i18next'

interface BlogErrorProps {
  message: string
  onRetry?: () => void
}

export function BlogError({ message, onRetry }: BlogErrorProps) {
  const { t } = useTranslation()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // Fallback to page reload if no refetch function is provided
      window.location.reload()
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
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('blog.error.title')}</h3>
      <p className="text-gray-600">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        {t('blog.error.retry')}
      </button>
    </div>
  )
}
