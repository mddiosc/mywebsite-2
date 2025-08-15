import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import type { BlogPost } from '../../../types/blog'

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const { t, i18n } = useTranslation()

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
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
        >
          <div className="p-6">
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

            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              <Link
                to={`/${i18n.language}/blog/${post.slug}`}
                className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.meta.title}
              </Link>
            </h2>

            <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
              {post.meta.description}
            </p>

            {post.meta.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{post.meta.author}</span>
              </div>

              {post.meta.featured && (
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {t('blog.featured')}
                </span>
              )}
            </div>

            <div className="mt-4">
              <Link
                to={`/${i18n.language}/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('blog.readMore')}
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </motion.article>
      ))}
    </div>
  )
}
