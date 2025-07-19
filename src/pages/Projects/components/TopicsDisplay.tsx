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

  return (
    <motion.div
      className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: delay }}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
          {t(TRANSLATION_KEYS.TOPICS.TITLE)}
        </h3>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          {t(TRANSLATION_KEYS.TOPICS.DESCRIPTION)}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {topics.slice(0, maxTopics).map((topic) => (
          <span
            key={topic}
            className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 transition-colors hover:bg-indigo-200 sm:px-4 sm:py-2 sm:text-sm"
          >
            #{topic}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default TopicsDisplay
