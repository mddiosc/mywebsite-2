import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react'
import { motion } from 'framer-motion'

import { GitHubProject } from '@/types'

/**
 * Mapping of programming languages to their representative colors (bg and text)
 */
const languageColors: Record<string, { bg: string; text: string; glow: string }> = {
  JavaScript: {
    bg: 'bg-yellow-400/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    glow: 'shadow-yellow-500/20',
  },
  TypeScript: {
    bg: 'bg-blue-400/20',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  HTML: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-500/20',
  },
  CSS: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  Python: {
    bg: 'bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    glow: 'shadow-green-500/20',
  },
  Java: { bg: 'bg-red-500/20', text: 'text-red-600 dark:text-red-400', glow: 'shadow-red-500/20' },
  Ruby: { bg: 'bg-red-600/20', text: 'text-red-600 dark:text-red-400', glow: 'shadow-red-600/20' },
  PHP: {
    bg: 'bg-indigo-400/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  Go: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
  Rust: {
    bg: 'bg-amber-600/20',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-600/20',
  },
  Swift: {
    bg: 'bg-orange-600/20',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-600/20',
  },
  Kotlin: {
    bg: 'bg-purple-600/20',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-600/20',
  },
  default: {
    bg: 'bg-gray-400/20',
    text: 'text-gray-600 dark:text-gray-400',
    glow: 'shadow-gray-500/20',
  },
}

// Language bar colors for the progress indicator
const languageBarColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  Ruby: 'bg-red-600',
  PHP: 'bg-indigo-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-amber-600',
  Swift: 'bg-orange-600',
  Kotlin: 'bg-purple-600',
  default: 'bg-gray-400',
}

interface ProjectCardProps {
  project: GitHubProject
  delay: number
}

/**
 * Component that displays a GitHub project as a card
 * Shows project details including name, description, languages, stars and forks
 *
 * @param project - The GitHub project to display
 * @param delay - Animation delay for the card entrance
 */
const ProjectCard = ({ project, delay }: ProjectCardProps) => {
  const { t, i18n } = useTranslation()
  const [isTopicsOpen, setIsTopicsOpen] = useState(false)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const descriptionTextRef = useRef<HTMLParagraphElement>(null)

  const {
    refs: topicsRefs,
    floatingStyles: topicsFloatingStyles,
    context: topicsContext,
  } = useFloating({
    open: isTopicsOpen,
    onOpenChange: setIsTopicsOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const {
    refs: descriptionRefs,
    floatingStyles: descriptionFloatingStyles,
    context: descriptionContext,
  } = useFloating({
    open: isDescriptionOpen,
    onOpenChange: setIsDescriptionOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const topicsHover = useHover(topicsContext, {
    enabled: !('ontouchstart' in window), // Disable hover on touch devices
  })
  const topicsFocus = useFocus(topicsContext)
  const topicsDismiss = useDismiss(topicsContext)
  const topicsRole = useRole(topicsContext, { role: 'tooltip' })

  const descriptionHover = useHover(descriptionContext, {
    enabled: !('ontouchstart' in window), // Disable hover on touch devices
  })
  const descriptionFocus = useFocus(descriptionContext)
  const descriptionDismiss = useDismiss(descriptionContext)
  const descriptionRole = useRole(descriptionContext, { role: 'tooltip' })

  const { getReferenceProps: getTopicsReferenceProps, getFloatingProps: getTopicsFloatingProps } =
    useInteractions([topicsHover, topicsFocus, topicsDismiss, topicsRole])
  const {
    getReferenceProps: getDescriptionReferenceProps,
    getFloatingProps: getDescriptionFloatingProps,
  } = useInteractions([descriptionHover, descriptionFocus, descriptionDismiss, descriptionRole])

  // Get current language from i18n
  const currentLocale = i18n.language === 'es' ? 'es-ES' : 'en-US'

  const formattedUpdatedDate = new Date(project.updated_at).toLocaleDateString(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedCreatedDate = new Date(project.created_at).toLocaleDateString(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Determine the color for the primary language
  const langColors =
    project.language && project.language in languageColors
      ? languageColors[project.language]
      : languageColors['default']

  // Process languages if available
  const hasMultipleLanguages = project.languages && Object.keys(project.languages).length > 0

  // Calculate total bytes to determine percentages
  const totalBytes = project.languages
    ? Object.values(project.languages).reduce((sum, bytes) => sum + bytes, 0)
    : 0

  // Sort languages by byte count (descending) and limit to top 4
  const sortedLanguages = project.languages
    ? Object.entries(project.languages)
        .sort(([, bytesA], [, bytesB]) => bytesB - bytesA)
        .slice(0, 4)
    : []

  // Get description with fallback
  const description = project.description ?? t('pages.projects.card.noDescription')

  // Effect to check if description is truncated by checking scroll height vs client height
  useEffect(() => {
    if (descriptionTextRef.current) {
      const element = descriptionTextRef.current
      // Check if content overflows the container (is truncated)
      const isTruncated = element.scrollHeight > element.clientHeight
      setIsDescriptionTruncated(isTruncated)
    }
  }, [description])

  // Handle mobile tap for description tooltip
  const handleDescriptionClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window && isDescriptionTruncated) {
      e.stopPropagation()
      setIsDescriptionOpen(!isDescriptionOpen)
    }
  }

  // Handle mobile tap for topics tooltip
  const handleTopicsClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window) {
      e.stopPropagation()
      setIsTopicsOpen(!isTopicsOpen)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={(e) => {
        // Only navigate to GitHub if not clicking on an interactive element
        const target = e.target as HTMLElement
        const hasHelperCursor =
          target.classList.contains('cursor-help') || target.closest('.cursor-help')
        if (!target.closest('a') && !target.closest('button') && !hasHelperCursor) {
          window.open(project.html_url, '_blank')
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 dark:border-gray-700/50 dark:bg-gray-900/80 dark:hover:border-primary/40 dark:hover:shadow-primary/20"
    >
      {/* Animated glow effect on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-r from-primary via-highlight to-accent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

      {/* Glassmorphism overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />

      {/* Header section with gradient background */}
      <div className="relative overflow-hidden sm:h-40">
        <div className="h-full w-full bg-linear-to-br from-primary/10 via-highlight/10 to-accent/10 dark:from-primary/20 dark:via-highlight/20 dark:to-accent/20">
          <div className="flex h-full items-center justify-center py-8 sm:py-0">
            {/* Project icon with animation */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {/* Icon glow */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-14 w-14 text-primary dark:text-primary-light"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          </div>
        </div>
        {/* Corner decoration */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-linear-to-br from-accent/20 to-primary/20 blur-2xl transition-all duration-500 group-hover:scale-150" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* Header section - Fixed position */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-light">
            <a href={project.html_url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          </h3>
        </div>

        {/* Description section - Fixed height */}
        <div className="mb-4 h-24">
          <div className="relative h-full">
            <div
              ref={isDescriptionTruncated ? descriptionRefs.setReference : undefined}
              {...(isDescriptionTruncated ? getDescriptionReferenceProps() : {})}
              className={`h-full overflow-hidden ${isDescriptionTruncated ? 'cursor-help' : ''}`}
              onClick={handleDescriptionClick}
            >
              <p
                ref={descriptionTextRef}
                className="line-clamp-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {description}
              </p>
            </div>
            {isDescriptionOpen && isDescriptionTruncated && (
              <FloatingPortal>
                <div
                  ref={descriptionRefs.setFloating}
                  style={descriptionFloatingStyles}
                  {...getDescriptionFloatingProps()}
                  className="z-50 w-max max-w-md rounded-xl border border-gray-200/50 bg-white/90 px-4 py-3 text-sm shadow-xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/90"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t('pages.projects.card.fullDescription')}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {description}
                      </p>
                    </div>
                    {/* Close button for mobile */}
                    {'ontouchstart' in window && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDescriptionOpen(false)
                        }}
                        className="ml-2 shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        aria-label="Cerrar"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </FloatingPortal>
            )}
          </div>
        </div>

        {/* Languages section - Fixed height */}
        <div className="mb-6 min-h-16">
          {/* Display multiple languages if available */}
          {hasMultipleLanguages ? (
            <div>
              <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('pages.projects.card.languages')}
              </p>
              <div className="flex flex-wrap gap-1">
                {/* Languages progress bar */}
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  {sortedLanguages.map(([lang, bytes]) => {
                    const percentage = (bytes / totalBytes) * 100
                    const barColor = languageBarColors[lang] ?? 'bg-gray-400'
                    return (
                      <div
                        key={lang}
                        className={`${barColor} h-full transition-all duration-300`}
                        style={{ width: `${String(percentage)}%` }}
                        title={`${lang}: ${percentage.toFixed(1)}%`}
                      />
                    )
                  })}
                </div>
                {/* Languages legend */}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {sortedLanguages.slice(0, 3).map(([lang, bytes]) => {
                    const percentage = ((bytes / totalBytes) * 100).toFixed(1)
                    const colors = languageColors[lang] ?? languageColors['default']
                    return (
                      <div key={lang} className="flex items-center gap-x-1.5">
                        <div className={`h-2 w-2 rounded-full ${colors?.bg ?? 'bg-gray-400/20'}`} />
                        <span className={`text-xs font-medium ${colors?.text ?? 'text-gray-600'}`}>
                          {lang} {percentage}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Display only primary language if multiple languages not available
            <div
              className={`inline-flex items-center gap-x-2 rounded-lg px-2 py-1 ${langColors?.bg ?? 'bg-gray-400/20'}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${project.language ? (languageBarColors[project.language] ?? 'bg-gray-400') : 'bg-gray-400'}`}
              />
              <span className={`text-xs font-medium ${langColors?.text ?? 'text-gray-600'}`}>
                {project.language || 'No language'}
              </span>
            </div>
          )}
        </div>

        {/* Topics section - Fixed height */}
        <div className="mb-4 min-h-16">
          {project.topics.length > 0 ? (
            <div className="flex flex-wrap content-start gap-1">
              {project.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 transition-colors dark:bg-primary/20 dark:text-primary-light dark:ring-primary/30"
                >
                  {topic}
                </span>
              ))}
              {project.topics.length > 4 && (
                <>
                  <span
                    ref={topicsRefs.setReference}
                    {...getTopicsReferenceProps()}
                    onClick={handleTopicsClick}
                    className="inline-flex cursor-help items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/20 transition-colors hover:bg-accent/20 dark:bg-accent/20 dark:text-accent dark:ring-accent/30"
                  >
                    +{project.topics.length - 4} {t('pages.projects.card.moreTopics')}
                  </span>
                  {isTopicsOpen && (
                    <FloatingPortal>
                      <div
                        ref={topicsRefs.setFloating}
                        style={topicsFloatingStyles}
                        {...getTopicsFloatingProps()}
                        className="z-50 w-max max-w-xs rounded-xl border border-gray-200/50 bg-white/90 px-4 py-3 text-xs shadow-xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/90"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t('pages.projects.card.additionalTopics')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.topics.slice(4).map((topic) => (
                                <span
                                  key={topic}
                                  className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 dark:bg-primary/20 dark:text-primary-light dark:ring-primary/30"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Close button for mobile */}
                          {'ontouchstart' in window && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsTopicsOpen(false)
                              }}
                              className="ml-2 shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                              aria-label="Cerrar"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </FloatingPortal>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* Bottom section - Always at the bottom with consistent height */}
        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
          {/* Fixed height container for dates */}
          <div className="mb-3 h-8 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('pages.projects.card.createdOn')} {formattedCreatedDate}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('pages.projects.card.updatedOn')} {formattedUpdatedDate}
            </p>
          </div>

          {/* Fixed height container for actions */}
          <div className="flex h-8 items-center justify-between">
            <div className="flex items-center gap-x-4">
              {/* Stars count */}
              <div className="flex items-center gap-x-1.5 rounded-lg bg-yellow-500/10 px-2 py-1 transition-colors group-hover:bg-yellow-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-500"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  {project.stargazers_count}
                </span>
              </div>
              {/* Forks count */}
              <div className="flex items-center gap-x-1.5 rounded-lg bg-gray-500/10 px-2 py-1 transition-colors group-hover:bg-gray-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {project.forks_count}
                </span>
              </div>
            </div>

            {/* Demo Link - Fixed width container */}
            <div className="flex h-full items-center">
              {project.homepage && project.homepage.trim() !== '' && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/demo relative inline-flex items-center gap-x-1.5 overflow-hidden rounded-lg bg-linear-to-r from-primary to-highlight px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/demo:translate-x-full" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                    />
                  </svg>
                  <span className="relative">{t('pages.projects.card.demo')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
