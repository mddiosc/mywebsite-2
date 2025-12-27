import { useTranslation } from 'react-i18next'

import { TRANSLATION_KEYS } from '../constants'

/**
 * Component that displays empty state when no projects are found
 */
const ProjectsEmptyState = () => {
  const { t } = useTranslation()

  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {t(TRANSLATION_KEYS.EMPTY.TITLE)}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t(TRANSLATION_KEYS.EMPTY.MESSAGE)}
      </p>
    </div>
  )
}

export default ProjectsEmptyState
