import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { ProjectCard, ProjectSkeleton } from '../components'
import useProjects from '../hooks/useProjects'
import { commonTransition, slideIn } from '../lib/animations'

const ProjectsPage = () => {
  const { t } = useTranslation()
  const { data: projects, isLoading, error } = useProjects()

  const skeletons = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:max-w-none"
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.1 }}
        >
          <h2 className="text-base/7 font-semibold text-indigo-600">
            {t('pages.projects.portfolio')}
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            {t('pages.projects.title')}
          </p>
          <p className="mt-6 max-w-2xl text-lg/8 text-gray-600">
            {t('pages.projects.description')}
          </p>
        </motion.div>

        {/* GitHub filter info */}
        {!isLoading && !error && projects && projects.length > 0 && (
          <motion.div
            className="mt-6 flex items-center gap-x-3 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>{t('pages.projects.githubInfo', { count: projects.length })}</span>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            className="mt-12 rounded-md bg-red-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {t('pages.projects.error.title')}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{t('pages.projects.error.message')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects grid */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loading state */}
          {isLoading &&
            skeletons.map((index) => <ProjectSkeleton key={`skeleton-${index.toString()}`} />)}

          {/* Projects loaded */}
          {!isLoading &&
            !error &&
            projects
              ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={0.1 + index * 0.05} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && !error && (!projects || projects.length === 0) && (
          <motion.div
            className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('pages.projects.empty.title')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t('pages.projects.empty.message')}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
