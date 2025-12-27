import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { PROJECTS_CONSTANTS, TRANSLATION_KEYS } from '../constants'
import { TopicsDisplayProps } from '../types'

import { fadeIn, smoothTransition } from '@/lib/animations'

/**
 * Component that displays popular topics/tags
 */
const TopicsDisplay = ({
  topics,
  maxTopics = PROJECTS_CONSTANTS.MAX_TOPICS_DISPLAY,
  delay = PROJECTS_CONSTANTS.ANIMATION_DELAYS.TOPICS,
}: TopicsDisplayProps) => {
  const { t } = useTranslation()

  if (topics.length === 0) {
    return null
  }

  // Remove duplicates and limit to maxTopics
  const uniqueTopics = Array.from(new Set(topics)).slice(0, maxTopics)

  return (
    <motion.div
      className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: delay }}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
          {t(TRANSLATION_KEYS.TOPICS.TITLE)}
        </h3>
        <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
          {t(TRANSLATION_KEYS.TOPICS.DESCRIPTION)}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {uniqueTopics.map((topic) => (
          <span
            key={topic}
            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 transition-colors ring-inset hover:bg-primary/20 sm:px-4 sm:py-2 sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
          >
            #{topic}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default TopicsDisplay
