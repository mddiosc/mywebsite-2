import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { motion } from 'framer-motion'

import { BlogList, BlogError, BlogLoading, BlogPost } from './components'

import { useBlogPosts } from '../../hooks/useBlog'
import { fadeIn, smoothTransition } from '../../lib/animations'

export default function Blog() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug?: string }>()
  const { data: posts, isLoading: loading, error } = useBlogPosts()

  if (slug) {
    return <BlogPost />
  }

  return (
    <>
      <Helmet>
        <title>{t('blog.title')} - Portfolio</title>
        <meta name="description" content={t('blog.description')} />
        <meta property="og:title" content={`${t('blog.title')} - Portfolio`} />
        <meta property="og:description" content={t('blog.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              {t('blog.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {t('blog.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {loading && <BlogLoading />}
            {error && <BlogError message={error.message} />}
            {!loading && !error && posts && <BlogList posts={posts} />}
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
