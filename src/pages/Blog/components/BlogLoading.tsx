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
            className="group relative flex h-full animate-pulse flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Header skeleton with gradient background */}
            <div className="aspect-h-3 aspect-w-4 sm:aspect-none overflow-hidden bg-gray-200 sm:h-40 dark:bg-gray-700">
              <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <div className="flex h-full items-center justify-center">
                  <div className="h-14 w-14 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="flex flex-1 flex-col p-5">
              {/* Header section skeleton */}
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Description section skeleton - Fixed height */}
              <div className="mb-4 h-20">
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>

              {/* Tags section skeleton - Fixed height */}
              <div className="mb-4 h-16">
                <div className="flex flex-wrap content-start gap-1">
                  {[1, 2, 3].map((tag) => (
                    <div key={tag} className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
                  ))}
                </div>
              </div>

              {/* Bottom section skeleton */}
              <div className="mt-auto">
                {/* Author section skeleton */}
                <div className="mb-3 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Action section skeleton */}
                <div className="flex h-8 items-center justify-end">
                  <div className="h-7 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
