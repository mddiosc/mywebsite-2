import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { fadeIn, fadeInUp, smoothTransition } from '../lib/animations'

const HomeFeatures = () => {
  const { t, i18n } = useTranslation()

  const features = t('components.homeFeatures.features', { returnObjects: true }) as {
    title: string
    description: string
    icon: string
  }[]

  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: 1.0 }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
          {t('components.homeFeatures.subtitle')}
        </p>
        <p className="mt-4 text-base text-gray-600 sm:mt-6 sm:text-lg/8">
          {t('components.homeFeatures.description')}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ ...smoothTransition, delay: 1.3 + index * 0.2 }}
            >
              <dt className="flex flex-col items-center gap-y-2 text-sm font-semibold text-gray-900 sm:gap-y-3 sm:text-base/7">
                <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                {feature.title}
              </dt>
              <dd className="mt-3 flex flex-auto flex-col text-sm text-gray-600 sm:mt-4 sm:text-base/7">
                <p className="flex-auto">{feature.description}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      <motion.div
        className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:justify-center sm:gap-6 lg:mt-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ ...smoothTransition, delay: 2.0 }}
      >
        <Link
          to={`/${i18n.language}/about`}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto sm:px-6 sm:py-3"
        >
          {t('components.homeFeatures.ctaSecondary')}
        </Link>
        <Link
          to={`/${i18n.language}/projects`}
          className="text-sm leading-6 font-semibold text-gray-900 sm:text-sm"
        >
          {t('components.homeFeatures.ctaPrimary')} <span aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default HomeFeatures
