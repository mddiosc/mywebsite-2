import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import {
  ProjectStatistics,
  ProjectsError,
  ProjectsEmptyState,
  ProjectsGrid,
  TopicsDisplay,
} from './components'
import { PROJECTS_CONSTANTS, TRANSLATION_KEYS } from './constants'
import { useProjects } from './hooks'

import { DocumentHead } from '@/components'
import { fadeIn, fadeInUp, smoothTransition } from '@/lib/animations'

/**
 * Main Projects page component
 * Displays a showcase of GitHub projects with statistics, topics, and grid layout
 */
const ProjectsPage = () => {
  const { t } = useTranslation()
  const { data: projects, isLoading, error, statistics } = useProjects()

  const hasProjects = !isLoading && !error && projects && projects.length > 0
  const hasTopics = hasProjects && statistics.allTopics.length > 0
  const isEmpty = !isLoading && !error && (!projects || projects.length === 0)

  return (
    <>
      <DocumentHead
        title={`${t('navigation.projects')} - Portfolio`}
        description={t('pages.projects.description')}
        keywords="projects, github, repositories, code, development, open source"
      />

      <motion.div
        className="py-12 sm:py-24 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            className="mx-auto max-w-2xl lg:max-w-none"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ ...smoothTransition, delay: PROJECTS_CONSTANTS.ANIMATION_DELAYS.HEADER }}
          >
            <div className="text-center">
              <h2 className="text-base/7 font-semibold text-indigo-600">
                {t(TRANSLATION_KEYS.PORTFOLIO)}
              </h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-5xl lg:text-6xl">
                {t(TRANSLATION_KEYS.TITLE)}
              </p>
              <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">
                {t(TRANSLATION_KEYS.DESCRIPTION)}
              </p>
            </div>
          </motion.div>

          {/* Project Statistics */}
          {hasProjects && <ProjectStatistics statistics={statistics} />}

          {/* Popular Topics */}
          {hasTopics && <TopicsDisplay topics={statistics.allTopics} />}

          {/* Error State */}
          {error && <ProjectsError error={error} />}

          {/* Projects Grid - Always render unless there's an error or empty state */}
          {!error && !isEmpty && (
            <ProjectsGrid projects={projects ?? []} isLoading={isLoading} error={error} />
          )}

          {/* Empty State */}
          {isEmpty && <ProjectsEmptyState />}
        </div>
      </motion.div>
    </>
  )
}

export default ProjectsPage
