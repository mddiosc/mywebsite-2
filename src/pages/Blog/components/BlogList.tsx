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
        <p className="text-gray-600">{t('blog.noPosts')}</p>
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
            <div className="mb-4 text-sm text-gray-600">
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
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-50 to-purple-50 ring-1 ring-gray-100">
            <svg
              className="h-8 w-8 text-indigo-400"
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
          <h3 className="mb-3 text-xl font-semibold text-gray-900">
            {t('blog.filters.noResults')}
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-600">
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
            className="rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={(e) => {
        // Only navigate if not clicking on an interactive element
        const target = e.target as HTMLElement
        const hasHelperCursor =
          target.classList.contains('cursor-help') || target.closest('.cursor-help')
        if (!target.closest('a') && !target.closest('button') && !hasHelperCursor) {
          void navigate(`/${i18n.language}/blog/${post.slug}`)
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Header section with gradient background */}
      <div className="aspect-h-3 aspect-w-4 sm:aspect-none overflow-hidden bg-gray-200 group-hover:opacity-75 sm:h-40">
        <div className="h-full w-full bg-linear-to-br from-blue-50 to-purple-100 object-cover object-center sm:h-full sm:w-full">
          <div className="flex h-full items-center justify-center">
            {/* Blog icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-blue-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </div>
          {/* Featured badge overlay */}
          {post.meta.featured && (
            <div className="absolute top-2 right-2">
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                {t('blog.featured')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header section with date and reading time - Fixed height */}
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString(i18n.language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>{t('blog.readingTime', { minutes: post.readingTime })}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            <Link
              to={`/${i18n.language}/blog/${post.slug}`}
              className="transition-colors duration-200 hover:text-blue-600"
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
                className="line-clamp-3 text-sm leading-relaxed text-gray-600"
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
                  className="z-50 w-max max-w-md rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="mb-2 text-xs font-medium text-gray-600">
                        {t('blog.fullDescription')}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700">
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
                        className="ml-2 shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-600"
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
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
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
                    className="inline-flex cursor-help items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-200"
                  >
                    +{post.meta.tags.length - 3} {t('blog.moreTags')}
                  </span>
                  {isTagsOpen && (
                    <FloatingPortal>
                      <div
                        ref={tagsRefs.setFloating}
                        style={tagsFloatingStyles}
                        {...getTagsFloatingProps()}
                        className="z-50 w-max max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-2 text-xs font-medium text-gray-600">
                              {t('blog.additionalTags')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {post.meta.tags.slice(3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
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
                              className="ml-2 shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-600"
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
        <div className="mt-auto">
          {/* Author section - Fixed height */}
          <div className="mb-3 h-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">{post.meta.author}</span>
            </div>
          </div>

          {/* Action section - Fixed height */}
          <div className="flex h-8 items-center justify-end">
            <Link
              to={`/${i18n.language}/blog/${post.slug}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {t('blog.readMore')}
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
