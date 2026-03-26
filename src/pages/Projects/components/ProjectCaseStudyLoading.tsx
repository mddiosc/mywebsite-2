import { useTranslation } from 'react-i18next'

export function ProjectCaseStudyLoading() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="mb-8 h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Title skeleton */}
        <div className="mb-6 h-12 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

        {/* Summary skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-6 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Metadata skeleton */}
        <div className="my-8 space-y-4 border-t border-b border-gray-200 py-4 dark:border-gray-700">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="mt-12 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>

        {/* Project details skeleton */}
        <div className="mt-12 space-y-4 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600/20 border-t-indigo-600 dark:border-indigo-400/20 dark:border-t-indigo-400" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    </div>
  )
}
