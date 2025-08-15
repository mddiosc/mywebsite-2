import { useTranslation } from 'react-i18next'

interface BlogErrorProps {
  message: string
}

export function BlogError({ message }: BlogErrorProps) {
  const { t } = useTranslation()

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 p-3 dark:bg-red-900">
        <svg
          className="h-6 w-6 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {t('blog.error.title')}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
      <button
        type="button"
        onClick={() => {
          window.location.reload()
        }}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {t('blog.error.retry')}
      </button>
    </div>
  )
}
