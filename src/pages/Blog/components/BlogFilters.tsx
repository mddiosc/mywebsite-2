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
    <div className="mb-8 overflow-hidden rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50" />

      <div className="relative p-6">
        {/* Header with search and expand toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="max-w-md flex-1">
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-indigo-500"
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
                className="block w-full rounded-xl border border-gray-200 bg-white/80 py-3 pr-12 pl-12 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                placeholder={t('blog.filters.searchPlaceholder')}
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearchChange('')
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
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
            <div className="mr-4 hidden items-center gap-3 text-sm text-gray-600 sm:flex">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-400" />
                <span>{t('blog.filters.totalPosts', { count: filterStats.totalPosts })}</span>
              </div>
              {filterStats.featuredPosts > 0 && (
                <>
                  <div className="h-1 w-1 rounded-full bg-gray-400" />
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
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100/80 hover:text-gray-800"
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
              className="flex items-center gap-2 rounded-lg bg-indigo-50/80 px-4 py-2 text-sm font-medium text-indigo-600 backdrop-blur-sm transition-all duration-200 hover:bg-indigo-100/80 hover:text-indigo-700"
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
              <div className="mt-6 border-t border-gray-200/50 pt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Sort options */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      {t('blog.filters.sortBy')}
                    </label>
                    <div className="relative">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => {
                          handleSortChange(e.target.value as FilterState['sortBy'])
                        }}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white/90 py-3 pr-10 pl-4 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
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
                          className="h-4 w-4 text-gray-400"
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
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      {t('blog.filters.showFeatured')}
                    </label>
                    <label className="flex cursor-pointer items-center rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/50 hover:shadow-lg">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={filters.showFeatured}
                          onChange={handleFeaturedToggle}
                          className="h-5 w-5 rounded-md border-2 border-white/50 bg-white/20 text-indigo-500 shadow-sm backdrop-blur-sm transition-all duration-200 checked:border-indigo-500 checked:bg-linear-to-r checked:from-indigo-500 checked:to-purple-500 focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0 focus:outline-none"
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {t('blog.filters.featuredOnly')}
                      </span>
                    </label>
                  </div>

                  {/* Tags filter */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      {t('blog.filters.filterByTags')}
                    </label>
                    <div className="relative rounded-xl border border-white/30 bg-white/30 p-4 backdrop-blur-sm">
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
                                  ? 'scale-105 bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg ring-2 ring-indigo-200'
                                  : 'border border-white/50 bg-white/70 text-gray-700 hover:scale-105 hover:border-white/70 hover:bg-white/90 hover:text-gray-800'
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
                  <div className="mt-6 rounded-lg bg-linear-to-r from-indigo-50/50 to-purple-50/50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {t('blog.filters.activeFilters')}:
                      </span>

                      {filters.search && (
                        <span className="inline-flex items-center rounded-full bg-green-100/80 px-3 py-1 text-xs font-medium text-green-700 backdrop-blur-sm">
                          {t('blog.filters.search')}: "{filters.search}"
                          <button
                            type="button"
                            onClick={() => {
                              handleSearchChange('')
                            }}
                            className="ml-1.5 rounded-full text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {filters.showFeatured && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100/80 px-3 py-1 text-xs font-medium text-yellow-700 backdrop-blur-sm">
                          {t('blog.filters.featuredOnly')}
                          <button
                            type="button"
                            onClick={handleFeaturedToggle}
                            className="ml-1.5 rounded-full text-yellow-600 hover:text-yellow-800"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {filters.selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              handleTagToggle(tag)
                            }}
                            className="ml-1.5 rounded-full text-indigo-600 hover:text-indigo-800"
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
