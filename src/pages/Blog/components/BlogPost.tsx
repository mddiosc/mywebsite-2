import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams, Navigate } from 'react-router'

import { motion } from 'framer-motion'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { BlogError } from './BlogError'
import { BlogLoading } from './BlogLoading'

import { useBlogPost } from '../../../hooks/useBlog'
import { fadeIn, smoothTransition } from '../../../lib/animations'

import 'highlight.js/styles/github-dark.css'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { data: post, isLoading: loading, error } = useBlogPost(slug ?? '')

  if (!slug) {
    return <Navigate to={`/${i18n.language}/blog`} replace />
  }

  if (loading) {
    return <BlogLoading />
  }

  if (error || !post) {
    return <BlogError message={error?.message ?? t('blog.postNotFound')} />
  }

  return (
    <>
      <Helmet>
        <title>{post.meta.title} - Portfolio</title>
        <meta name="description" content={post.meta.description} />
        <meta property="og:title" content={post.meta.title} />
        <meta property="og:description" content={post.meta.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.meta.date} />
        <meta property="article:author" content={post.meta.author} />
        {post.meta.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <motion.article
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
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
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-3 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{post.meta.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('blog.author')}</p>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Personalizar componentes si es necesario
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
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </motion.article>
    </>
  )
}
