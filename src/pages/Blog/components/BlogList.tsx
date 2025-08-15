import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import { motion } from 'framer-motion'

import type { BlogPost } from '../../../types/blog'

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">{t('blog.noPosts')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative flex h-full cursor-pointer flex-col rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
          onClick={() => {
            void navigate(`/${i18n.language}/blog/${post.slug}`)
          }}
        >
          {/* Header section with gradient background */}
          <div className="aspect-h-3 aspect-w-4 sm:aspect-none overflow-hidden bg-gray-200 group-hover:opacity-75 sm:h-40 dark:bg-gray-700">
            <div className="h-full w-full bg-gradient-to-br from-blue-50 to-purple-100 object-cover object-center sm:h-full sm:w-full dark:from-blue-900 dark:to-purple-900">
              <div className="flex h-full items-center justify-center">
                {/* Blog icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-blue-300 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              </div>
              {/* Featured badge overlay */}
              {post.meta.featured && (
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {t('blog.featured')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-1 flex-col p-5">
            {/* Header section with date and reading time */}
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={post.meta.date}>
                  {new Date(post.meta.date).toLocaleDateString(i18n.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>{t('blog.readingTime', { minutes: post.readingTime })}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                <Link
                  to={`/${i18n.language}/blog/${post.slug}`}
                  className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  {post.meta.title}
                </Link>
              </h3>
            </div>

            {/* Description section - Fixed height */}
            <div className="mb-4 h-20">
              <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {post.meta.description}
              </p>
            </div>

            {/* Tags section - Fixed height */}
            <div className="mb-4 h-16">
              {post.meta.tags.length > 0 && (
                <div className="flex flex-wrap content-start gap-1">
                  {post.meta.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.meta.tags.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-800 dark:text-blue-300">
                      +{post.meta.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom section - Always at the bottom */}
            <div className="mt-auto">
              {/* Author section */}
              <div className="mb-3 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{post.meta.author}</span>
              </div>

              {/* Action section */}
              <div className="flex h-8 items-center justify-end">
                <Link
                  to={`/${i18n.language}/blog/${post.slug}`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400"
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
      ))}
    </div>
  )
}
