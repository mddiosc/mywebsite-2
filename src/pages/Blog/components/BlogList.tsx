import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

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

import { BlogFilters, type FilterState } from './BlogFilters'

import type { BlogPost } from '../../../types/blog'
import { filterAndSortPosts, getFilteredStats } from '../utils/filterUtils'

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedTags: [],
    sortBy: 'date-desc',
    showFeatured: false,
  })

  // Filter and sort posts
  const filteredPosts = filterAndSortPosts(posts, filters)
  const stats = getFilteredStats(posts, filteredPosts)

  // Handle no posts
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">{t('blog.noPosts')}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <BlogFilters posts={posts} filters={filters} onFiltersChange={setFilters} />

      {/* Results */}
      {stats.hasResults ? (
        <>
          {/* Results count */}
          {stats.filtered !== stats.total && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {t('blog.filters.showingResults', {
                count: stats.filtered,
                total: stats.total,
              })}
            </div>
          )}

          {/* Blog grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </>
      ) : (
        /* No results */
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-accent/10 ring-1 ring-primary/20 dark:from-primary/20 dark:to-accent/20 dark:ring-primary/30">
            <svg
              className="h-8 w-8 text-primary dark:text-primary-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            {t('blog.filters.noResults')}
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-600 dark:text-gray-300">
            {t('blog.filters.noResultsDescription')}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilters({
                search: '',
                selectedTags: [],
                sortBy: 'date-desc',
                showFeatured: false,
              })
            }}
            className="rounded-xl bg-linear-to-r from-primary to-highlight px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
          >
            {t('blog.filters.clearAll')}
          </button>
        </div>
      )}
    </div>
  )
}

interface BlogCardProps {
  post: BlogPost
  index: number
}

function BlogCard({ post, index }: BlogCardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const descriptionTextRef = useRef<HTMLParagraphElement>(null)

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

  const {
    refs: tagsRefs,
    floatingStyles: tagsFloatingStyles,
    context: tagsContext,
  } = useFloating({
    open: isTagsOpen,
    onOpenChange: setIsTagsOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const descriptionHover = useHover(descriptionContext, {
    enabled: !('ontouchstart' in window),
  })
  const descriptionFocus = useFocus(descriptionContext)
  const descriptionDismiss = useDismiss(descriptionContext)
  const descriptionRole = useRole(descriptionContext, { role: 'tooltip' })

  const tagsHover = useHover(tagsContext, {
    enabled: !('ontouchstart' in window),
  })
  const tagsFocus = useFocus(tagsContext)
  const tagsDismiss = useDismiss(tagsContext)
  const tagsRole = useRole(tagsContext, { role: 'tooltip' })

  const {
    getReferenceProps: getDescriptionReferenceProps,
    getFloatingProps: getDescriptionFloatingProps,
  } = useInteractions([descriptionHover, descriptionFocus, descriptionDismiss, descriptionRole])
  const { getReferenceProps: getTagsReferenceProps, getFloatingProps: getTagsFloatingProps } =
    useInteractions([tagsHover, tagsFocus, tagsDismiss, tagsRole])

  // Check if description is truncated
  useEffect(() => {
    if (descriptionTextRef.current) {
      const element = descriptionTextRef.current
      const isTruncated = element.scrollHeight > element.clientHeight
      setIsDescriptionTruncated(isTruncated)
    }
  }, [post.meta.description])

  // Handle mobile tap for description tooltip
  const handleDescriptionClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window && isDescriptionTruncated) {
      e.stopPropagation()
      setIsDescriptionOpen(!isDescriptionOpen)
    }
  }

  // Handle mobile tap for tags tooltip
  const handleTagsClick = (e: React.MouseEvent) => {
    if ('ontouchstart' in window) {
      e.stopPropagation()
      setIsTagsOpen(!isTagsOpen)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={(e) => {
        // Only navigate if not clicking on an interactive element
        const target = e.target as HTMLElement
        const hasHelperCursor =
          target.classList.contains('cursor-help') || target.closest('.cursor-help')
        if (!target.closest('a') && !target.closest('button') && !hasHelperCursor) {
          void navigate(`/${i18n.language}/blog/${post.slug}`)
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
        <div className="h-full w-full bg-linear-to-br from-highlight/10 via-primary/10 to-accent/10 dark:from-highlight/20 dark:via-primary/20 dark:to-accent/20">
          <div className="flex h-full items-center justify-center py-8 sm:py-0">
            {/* Blog icon with animation */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {/* Icon glow */}
              <div className="absolute inset-0 rounded-full bg-highlight/20 blur-xl" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-14 w-14 text-highlight dark:text-highlight"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </motion.div>
          </div>
          {/* Featured badge overlay */}
          {post.meta.featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-600 ring-1 ring-yellow-500/30 backdrop-blur-sm dark:bg-yellow-500/30 dark:text-yellow-400 dark:ring-yellow-500/40">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('blog.featured')}
              </span>
            </div>
          )}
        </div>
        {/* Corner decoration */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-linear-to-br from-highlight/20 to-primary/20 blur-2xl transition-all duration-500 group-hover:scale-150" />
      </div>

      {/* Content section */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        {/* Header section with date and reading time - Fixed height */}
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.meta.date} className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(post.meta.date).toLocaleDateString(i18n.language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium dark:bg-gray-800">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('blog.readingTime', { minutes: post.readingTime })}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-light">
            <Link
              to={`/${i18n.language}/blog/${post.slug}`}
              className="transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {post.meta.title}
            </Link>
          </h3>
        </div>

        {/* Description section - Fixed height with tooltip */}
        <div className="mb-4 h-20">
          <div className="relative h-full">
            <div
              ref={isDescriptionTruncated ? descriptionRefs.setReference : undefined}
              {...(isDescriptionTruncated ? getDescriptionReferenceProps() : {})}
              className={`h-full overflow-hidden ${isDescriptionTruncated ? 'cursor-help' : ''}`}
              onClick={handleDescriptionClick}
            >
              <p
                ref={descriptionTextRef}
                className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {post.meta.description}
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
                        {t('blog.fullDescription')}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                        {post.meta.description}
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

        {/* Tags section - Fixed height with smart tooltips */}
        <div className="mb-4 h-16">
          {post.meta.tags.length > 0 && (
            <div className="flex flex-wrap content-start gap-1">
              {post.meta.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg bg-highlight/10 px-2.5 py-1 text-xs font-medium text-highlight ring-1 ring-highlight/20 transition-colors dark:bg-highlight/20 dark:ring-highlight/30"
                >
                  {tag}
                </span>
              ))}
              {post.meta.tags.length > 3 && (
                <>
                  <span
                    ref={tagsRefs.setReference}
                    {...getTagsReferenceProps()}
                    onClick={handleTagsClick}
                    className="inline-flex cursor-help items-center rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/20 transition-colors hover:bg-accent/20 dark:bg-accent/20 dark:ring-accent/30"
                  >
                    +{post.meta.tags.length - 3} {t('blog.moreTags')}
                  </span>
                  {isTagsOpen && (
                    <FloatingPortal>
                      <div
                        ref={tagsRefs.setFloating}
                        style={tagsFloatingStyles}
                        {...getTagsFloatingProps()}
                        className="z-50 w-max max-w-xs rounded-xl border border-gray-200/50 bg-white/90 px-4 py-3 text-xs shadow-xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/90"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              {t('blog.additionalTags')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {post.meta.tags.slice(3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-lg bg-highlight/10 px-2.5 py-1 text-xs font-medium text-highlight ring-1 ring-highlight/20 dark:bg-highlight/20 dark:ring-highlight/30"
                                >
                                  {tag}
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
                                setIsTagsOpen(false)
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
          )}
        </div>

        {/* Bottom section - Always at the bottom */}
        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
          {/* Author section - Fixed height */}
          <div className="mb-3 h-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-highlight/20 text-sm font-bold text-primary dark:from-primary/30 dark:to-highlight/30 dark:text-primary-light">
                {post.meta.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.meta.author}
              </span>
            </div>
          </div>

          {/* Action section - Fixed height */}
          <div className="flex h-8 items-center justify-end">
            <Link
              to={`/${i18n.language}/blog/${post.slug}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="group/btn relative inline-flex items-center gap-x-1.5 overflow-hidden rounded-lg bg-linear-to-r from-highlight to-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-highlight/25 transition-all duration-300 hover:shadow-xl hover:shadow-highlight/30"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
              <span className="relative">{t('blog.readMore')}</span>
              <svg
                className="relative h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
