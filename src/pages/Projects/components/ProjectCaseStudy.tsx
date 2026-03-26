import type { ComponentPropsWithoutRef } from 'react'
import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown, { type ExtraProps } from 'react-markdown'
import { useParams, Navigate, Link } from 'react-router'

import { motion } from 'framer-motion'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { ProjectCaseStudyError } from './ProjectCaseStudyError'
import { ProjectCaseStudyLoading } from './ProjectCaseStudyLoading'

import { DocumentHead } from '../../../components/DocumentHead'
import { useThemeContext } from '../../../context'
import { useProjectWithCaseStudy } from '../../../hooks/useProjectsWithCaseStudies'
import { fadeIn, smoothTransition } from '../../../lib/animations'

// Helpers to strip the `node` prop that react-markdown injects (not forwarded to DOM)
type MdProps<T extends keyof React.JSX.IntrinsicElements> = Omit<
  ComponentPropsWithoutRef<T> & ExtraProps,
  'node'
>

// Markdown components – defined outside render to avoid re-creation on each render.
// children is destructured explicitly so jsx-a11y can verify accessible content.
const MarkdownH1 = ({ children, ...props }: MdProps<'h1'>) => (
  <h1 className="mt-8 mb-4 text-3xl font-bold" {...props}>
    {children}
  </h1>
)
const MarkdownH2 = ({ children, ...props }: MdProps<'h2'>) => (
  <h2 className="mt-6 mb-3 text-2xl font-bold" {...props}>
    {children}
  </h2>
)
const MarkdownH3 = ({ children, ...props }: MdProps<'h3'>) => (
  <h3 className="mt-4 mb-2 text-xl font-bold" {...props}>
    {children}
  </h3>
)
const MarkdownP = ({ children, ...props }: MdProps<'p'>) => (
  <p className="mb-4 leading-relaxed" {...props}>
    {children}
  </p>
)
const MarkdownA = ({ children, ...props }: MdProps<'a'>) => (
  <a
    className="text-indigo-600 underline hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
    {...props}
  >
    {children}
  </a>
)
const MarkdownCode = ({ children, ...props }: MdProps<'code'>) => (
  <code
    className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-red-600 dark:bg-gray-800 dark:text-red-400"
    {...props}
  >
    {children}
  </code>
)
const MarkdownPre = ({ children, ...props }: MdProps<'pre'>) => (
  <pre
    className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100"
    {...props}
  >
    {children}
  </pre>
)

export function ProjectCaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { isDark } = useThemeContext()
  const {
    data: projectWithCaseStudy,
    isLoading: loading,
    error,
    refetch,
  } = useProjectWithCaseStudy(slug ?? '')

  // Dynamically load highlight.js theme based on dark mode
  useEffect(() => {
    const loadTheme = async () => {
      if (isDark) {
        await import('highlight.js/styles/github-dark.css')
      } else {
        await import('highlight.js/styles/github.css')
      }
    }
    void loadTheme()
  }, [isDark])

  if (!slug) {
    return <Navigate to={`/${i18n.language}/projects`} replace />
  }

  if (loading) {
    return <ProjectCaseStudyLoading />
  }

  if (error || !projectWithCaseStudy?.hasCaseStudy) {
    return (
      <ProjectCaseStudyError
        message={error?.message ?? t('pages.projects.caseStudyNotFound')}
        onRetry={() => void refetch()}
      />
    )
  }

  const { project, caseStudy } = projectWithCaseStudy

  if (!caseStudy) {
    return (
      <ProjectCaseStudyError
        message={t('pages.projects.caseStudyNotFound')}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <>
      <DocumentHead
        title={`${caseStudy.meta.title} - Portfolio`}
        description={caseStudy.meta.summary}
        ogType="article"
        articlePublishedTime={caseStudy.meta.published}
        canonicalUrl={`${import.meta.env.VITE_SITE_URL}/${i18n.language}/projects/${slug}`}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Back to projects button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to={`/${i18n.language}/projects`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span className="mr-2">←</span>
            {t('common.backTo', { page: t('common.projects') })}
          </Link>
        </motion.div>

        {/* Header section */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
            {caseStudy.meta.title}
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">{caseStudy.meta.summary}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 border-t border-b border-gray-200 py-4 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.published')}</p>
              <time
                dateTime={caseStudy.meta.published}
                className="font-medium text-gray-900 dark:text-white"
              >
                {new Date(caseStudy.meta.published).toLocaleDateString(i18n.language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {caseStudy.meta.role && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('pages.projects.role')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{caseStudy.meta.role}</p>
              </div>
            )}

            {caseStudy.meta.status && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('pages.projects.status')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{caseStudy.meta.status}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.readingTime')}</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {t('common.minutesRead', { minutes: caseStudy.readingTime })}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="prose prose-sm dark:prose-invert md:prose-base max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: MarkdownH1,
              h2: MarkdownH2,
              h3: MarkdownH3,
              p: MarkdownP,
              a: MarkdownA,
              code: MarkdownCode,
              pre: MarkdownPre,
            }}
          >
            {caseStudy.content}
          </ReactMarkdown>
        </motion.article>

        {/* Project metadata from snapshot */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700"
        >
          <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            {t('pages.projects.projectDetails')}
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Repository link */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('pages.projects.repository')}
              </p>
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {project.full_name}
                <span className="ml-2">↗</span>
              </a>
            </div>

            {/* Technologies */}
            {project.language && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('pages.projects.mainLanguage')}
                </p>
                <p className="mt-2 font-medium text-gray-900 dark:text-white">{project.language}</p>
              </div>
            )}

            {/* Stars */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('pages.projects.stars')}
              </p>
              <p className="mt-2 font-medium text-gray-900 dark:text-white">
                {project.stargazers_count.toLocaleString()}
              </p>
            </div>

            {/* Demo URL */}
            {project.homepage && project.homepage.trim() !== '' && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('pages.projects.demo')}
                </p>
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {t('common.visit')}
                  <span className="ml-2">↗</span>
                </a>
              </div>
            )}

            {/* Topics */}
            {project.topics.length > 0 && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('pages.projects.topics.title')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      </motion.div>
    </>
  )
}
