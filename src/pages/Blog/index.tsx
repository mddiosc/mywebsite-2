import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { BlogList, BlogError, BlogLoading } from './components'

import { DocumentHead } from '../../components/DocumentHead'
import { useBlogPosts } from '../../hooks/useBlog'
import { fadeIn, smoothTransition } from '../../lib/animations'

export default function Blog() {
  const { t } = useTranslation()
  const { data: posts, isLoading: loading, error, refetch } = useBlogPosts()

  return (
    <>
      <DocumentHead
        title={`${t('blog.title')} - Portfolio`}
        description={t('blog.description')}
        ogType="website"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 text-center sm:mb-12"
          >
            <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
              <span className="bg-linear-to-r from-primary via-highlight to-accent bg-clip-text text-transparent">
                {t('blog.title')}
              </span>
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
            {error && <BlogError message={error.message} onRetry={() => void refetch()} />}
            {!loading && !error && posts && <BlogList posts={posts} />}
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
