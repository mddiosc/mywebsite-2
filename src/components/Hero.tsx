import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { fadeIn, slideIn, scaleIn, commonTransition } from '../lib/animations'

export default function Hero() {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ ...commonTransition, duration: 1 }}
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </motion.div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <motion.div
          className="hidden sm:mb-8 sm:flex sm:justify-center"
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.2 }}
        >
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            {t('components.hero.announcement', 'Announcing our next round of funding.')}{' '}
            <Link to="/announcement" className="font-semibold text-indigo-600">
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
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t('components.hero.ctaPrimary')}
            </Link>
            <Link
              to={`/${i18n.language}/${t('components.hero.ctaSecondaryLink')}`}
              className="text-sm/6 font-semibold text-gray-900"
            >
              {t('components.hero.ctaSecondary')} <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ ...commonTransition, duration: 1, delay: 0.2 }}
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </motion.div>
    </div>
  )
}
