import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { BlogList, BlogError, BlogLoading } from './components'

import { DocumentHead } from '../../components/DocumentHead'
import { useBlogPosts } from '../../hooks/useBlog'
import { fadeIn, smoothTransition } from '../../lib/animations'

export default function Blog() {
  const { t } = useTranslation()
  const { data: posts, isLoading: loading, error } = useBlogPosts()

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
