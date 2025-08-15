import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

export default function NotFoundPage() {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
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
          className="text-base font-semibold text-indigo-600"
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
        >
          {t('pages.notFound.pageNotFound')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
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
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('pages.notFound.goBackHome')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
