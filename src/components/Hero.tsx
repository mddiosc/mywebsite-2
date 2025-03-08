import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { fadeIn, slideIn, scaleIn, commonTransition } from '../lib/animations'

export default function Hero() {
  const { t, i18n } = useTranslation()

  return (
    <div className="mx-auto">
      <motion.div
        className="hidden sm:mb-8 sm:flex sm:justify-center"
        initial="hidden"
        animate="visible"
        variants={slideIn}
        transition={{ ...commonTransition, delay: 0.2 }}
      >
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          {t('components.hero.announcement', 'Announcing our next round of funding.')}{' '}
          <Link to="/announcement" className="relative z-10 font-semibold text-indigo-600">
            <span aria-hidden="true" className="absolute inset-0" />
            {t('components.hero.readMore', 'Read more')} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </motion.div>
      <div className="text-center">
        <motion.h1
          className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ ...commonTransition, delay: 0.4 }}
        >
          {t('components.hero.title')}
        </motion.h1>
        <motion.p
          className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ ...commonTransition, delay: 0.6 }}
        >
          {t('components.hero.subtitle')}
        </motion.p>
        <motion.div
          className="mt-10 flex items-center justify-center gap-x-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ ...commonTransition, delay: 0.8 }}
        >
          <Link
            to={`/${i18n.language}/${t('components.hero.ctaPrimaryLink')}`}
            className="relative z-10 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('components.hero.ctaPrimary')}
          </Link>
          <Link
            to={`/${i18n.language}/${t('components.hero.ctaSecondaryLink')}`}
            className="relative z-10 text-sm/6 font-semibold text-gray-900"
          >
            {t('components.hero.ctaSecondary')} <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
