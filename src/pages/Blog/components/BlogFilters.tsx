import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { motion, AnimatePresence } from 'framer-motion'

import type { BlogPost } from '../../../types/blog'

export interface FilterState {
  search: string
  selectedTags: string[]
  sortBy: 'date-desc' | 'date-asc' | 'reading-time' | 'title'
  showFeatured: boolean
}

interface BlogFiltersProps {
  posts: BlogPost[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function BlogFilters({ posts, filters, onFiltersChange }: BlogFiltersProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.meta.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Get filter statistics
  const filterStats = useMemo(() => {
    return {
      totalPosts: posts.length,
      featuredPosts: posts.filter((post) => post.meta.featured).length,
      avgReadingTime: Math.round(
        posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length,
      ),
    }
  }, [posts])

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleTagToggle = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag]
    onFiltersChange({ ...filters, selectedTags })
  }

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handleFeaturedToggle = () => {
    onFiltersChange({ ...filters, showFeatured: !filters.showFeatured })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      selectedTags: [],
      sortBy: 'date-desc',
      showFeatured: false,
    })
  }

  const hasActiveFilters = filters.search || filters.selectedTags.length > 0 || filters.showFeatured

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/80">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-highlight/5 to-accent/5 dark:from-primary/10 dark:via-highlight/10 dark:to-accent/10" />

      <div className="relative p-6">
        {/* Header with search and expand toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="max-w-md flex-1">
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary dark:text-gray-500 dark:group-focus-within:text-primary-light"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => {
                  handleSearchChange(e.target.value)
                }}
                className="block w-full rounded-xl border border-gray-200/50 bg-white/80 py-3 pr-12 pl-12 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary/40 dark:focus:ring-primary/30"
                placeholder={t('blog.filters.searchPlaceholder')}
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearchChange('')
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Filter stats */}
            <div className="mr-4 hidden items-center gap-3 text-sm text-gray-600 sm:flex dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{t('blog.filters.totalPosts', { count: filterStats.totalPosts })}</span>
              </div>
              {filterStats.featuredPosts > 0 && (
                <>
                  <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span>
                      {t('blog.filters.featuredCount', { count: filterStats.featuredPosts })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100/80 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-200"
              >
                {t('blog.filters.clearAll')}
              </button>
            )}

            {/* Expand/collapse button */}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(!isExpanded)
              }}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-200 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-light dark:hover:bg-primary/30"
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {t('blog.filters.advancedFilters')}
            </button>
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 border-t border-gray-200/50 pt-6 dark:border-gray-700/50">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Sort options */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('blog.filters.sortBy')}
                    </label>
                    <div className="relative">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => {
                          handleSortChange(e.target.value as FilterState['sortBy'])
                        }}
                        className="w-full appearance-none rounded-xl border border-gray-200/50 bg-white/90 py-3 pr-10 pl-4 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:outline-none dark:border-gray-700/50 dark:bg-gray-800/90 dark:text-white dark:focus:border-primary/40 dark:focus:ring-primary/30"
                      >
                        <option value="date-desc">{t('blog.filters.sortOptions.dateDesc')}</option>
                        <option value="date-asc">{t('blog.filters.sortOptions.dateAsc')}</option>
                        <option value="reading-time">
                          {t('blog.filters.sortOptions.readingTime')}
                        </option>
                        <option value="title">{t('blog.filters.sortOptions.title')}</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="h-4 w-4 text-gray-400 dark:text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Featured filter */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('blog.filters.showFeatured')}
                    </label>
                    <label className="flex cursor-pointer items-center rounded-xl border border-gray-200/30 bg-white/30 p-4 backdrop-blur-sm transition-all duration-300 hover:border-gray-200/50 hover:bg-white/50 hover:shadow-lg dark:border-gray-700/30 dark:bg-gray-800/30 dark:hover:border-gray-700/50 dark:hover:bg-gray-800/50">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.showFeatured}
                          onChange={handleFeaturedToggle}
                          className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white/20 text-primary shadow-sm backdrop-blur-sm transition-all duration-200 checked:border-primary checked:bg-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:outline-none dark:border-gray-600 dark:bg-gray-700/20 dark:checked:border-primary dark:checked:bg-primary dark:focus:ring-primary/30"
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('blog.filters.featuredOnly')}
                      </span>
                    </label>
                  </div>

                  {/* Tags filter */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('blog.filters.filterByTags')}
                    </label>
                    <div className="relative rounded-xl border border-gray-200/30 bg-white/30 p-4 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-800/30">
                      <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                        {allTags.map((tag) => {
                          const isSelected = filters.selectedTags.includes(tag)
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                handleTagToggle(tag)
                              }}
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200 ${
                                isSelected
                                  ? 'scale-105 bg-linear-to-r from-primary to-highlight text-white shadow-lg ring-2 ring-primary/20'
                                  : 'border border-gray-200/50 bg-white/70 text-gray-700 hover:scale-105 hover:border-gray-200/70 hover:bg-white/90 hover:text-gray-800 dark:border-gray-700/50 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:border-gray-600/70 dark:hover:bg-gray-700/90 dark:hover:text-white'
                              }`}
                            >
                              {tag}
                              {isSelected && (
                                <svg
                                  className="ml-1.5 h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected filters summary */}
                {hasActiveFilters && (
                  <div className="mt-6 rounded-lg bg-linear-to-r from-primary/5 to-highlight/5 p-4 dark:from-primary/10 dark:to-highlight/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('blog.filters.activeFilters')}:
                      </span>

                      {filters.search && (
                        <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm dark:bg-accent/30">
                          {t('blog.filters.search')}: "{filters.search}"
                          <button
                            type="button"
                            onClick={() => {
                              handleSearchChange('')
                            }}
                            className="ml-1.5 rounded-full text-accent hover:text-accent/80"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {filters.showFeatured && (
                        <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-600 backdrop-blur-sm dark:bg-yellow-500/30 dark:text-yellow-400">
                          {t('blog.filters.featuredOnly')}
                          <button
                            type="button"
                            onClick={handleFeaturedToggle}
                            className="ml-1.5 rounded-full text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {filters.selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-highlight/20 px-3 py-1 text-xs font-medium text-highlight backdrop-blur-sm dark:bg-highlight/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              handleTagToggle(tag)
                            }}
                            className="ml-1.5 rounded-full text-highlight hover:text-highlight/80"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
