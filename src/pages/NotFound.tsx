import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { DocumentHead } from '../components'

export default function NotFoundPage() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <DocumentHead
        title={`${t('pages.notFound.title')} - Portfolio`}
        description={t('pages.notFound.description')}
        robots="noindex, nofollow"
      />

      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-base font-semibold text-primary dark:text-primary-light"
          >
            404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white"
          >
            {t('pages.notFound.pageNotFound')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400"
          >
            {t('pages.notFound.sorryMessage')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              to={`/${i18n.language}/`}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-primary-light dark:text-gray-900 dark:shadow-primary-light/25 dark:hover:bg-primary-light/90 dark:hover:shadow-primary-light/30"
            >
              {t('pages.notFound.goBackHome')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
