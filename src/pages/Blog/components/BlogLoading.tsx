import { useTranslation } from 'react-i18next'

export function BlogLoading() {
  const { t } = useTranslation()

  return (
    <div className="py-12">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
        <p className="text-gray-600 dark:text-gray-300">{t('blog.loading')}</p>
      </div>

      {/* Skeleton cards */}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, () => crypto.randomUUID()).map((id) => (
          <div
            key={id}
            className="animate-pulse overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="mb-4 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
