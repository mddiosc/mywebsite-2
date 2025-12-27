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
        className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
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
              <h2 className="text-base/7 font-semibold text-primary">
                {t(TRANSLATION_KEYS.PORTFOLIO)}
              </h2>
              <p className="mt-2 text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
                <span className="bg-linear-to-r from-primary via-highlight to-accent bg-clip-text text-transparent">
                  {t(TRANSLATION_KEYS.TITLE)}
                </span>
              </p>
              <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-pretty text-gray-600 sm:text-xl/8 dark:text-gray-300">
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
