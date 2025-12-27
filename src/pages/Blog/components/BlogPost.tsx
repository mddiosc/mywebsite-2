import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams, Navigate, Link } from 'react-router'

import { motion } from 'framer-motion'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { BlogError } from './BlogError'
import { BlogLoading } from './BlogLoading'

import { DocumentHead } from '../../../components/DocumentHead'
import { useThemeContext } from '../../../context'
import { useBlogPost } from '../../../hooks/useBlog'
import { fadeIn, smoothTransition } from '../../../lib/animations'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { isDark } = useThemeContext()
  const { data: post, isLoading: loading, error, refetch } = useBlogPost(slug ?? '')

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
    return <Navigate to={`/${i18n.language}/blog`} replace />
  }

  if (loading) {
    return <BlogLoading />
  }

  if (error || !post) {
    return (
      <BlogError
        message={error?.message ?? t('blog.postNotFound')}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <>
      <DocumentHead
        title={`${post.meta.title} - Portfolio`}
        description={post.meta.description}
        ogType="article"
        articlePublishedTime={post.meta.date}
        articleAuthor={post.meta.author}
        articleTags={post.meta.tags}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        {/* Back to blog button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to={`/${i18n.language}/blog`}
            className="group inline-flex items-center gap-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="relative">{t('blog.backToBlog')}</span>
          </Link>
        </motion.div>

        <article className="mx-auto max-w-4xl">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.meta.date}>
                {new Date(post.meta.date).toLocaleDateString(i18n.language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>{t('blog.readingTime', { minutes: post.readingTime })}</span>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              {post.meta.title}
            </h1>

            <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">{post.meta.description}</p>

            {post.meta.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-highlight/10 px-3 py-1 text-sm font-medium text-highlight ring-1 ring-highlight/20 dark:bg-highlight/20 dark:ring-highlight/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-highlight/20 text-lg font-bold text-primary dark:from-primary/30 dark:to-highlight/30 dark:text-primary-light">
                {post.meta.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{post.meta.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('blog.author')}</p>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="prose prose-lg prose-headings:font-bold prose-a:text-primary dark:prose-a:text-primary-light max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-8 mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-6 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-5 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 list-disc pl-6 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 list-decimal pl-6 text-gray-700 dark:text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-4 border-primary/50 bg-primary/5 py-2 pr-4 pl-4 text-gray-700 italic dark:border-primary-light/50 dark:bg-primary/10 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary underline decoration-primary/30 transition-colors hover:decoration-primary dark:text-primary-light dark:decoration-primary-light/30 dark:hover:decoration-primary-light"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    {children}
                  </strong>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                    {children}
                  </pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </article>
      </motion.div>
    </>
  )
}
