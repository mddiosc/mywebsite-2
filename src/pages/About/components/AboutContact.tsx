import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIG } from '@/constants/animations'
import { commonTransition, slideIn } from '@/lib/animations'

const AboutContact = () => {
  const { t, i18n } = useTranslation()
  const linkedinUsername = import.meta.env.VITE_LINKEDIN_USERNAME ?? ''

  return (
    <motion.div
      className="mx-auto mt-16 max-w-7xl px-6 pb-16 sm:mt-20 sm:pb-20 lg:mt-24 lg:px-8 lg:pb-24"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.contact }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
          {t('pages.about.contact.title')}
        </h2>
        <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
          {t('pages.about.contact.content')}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`https://www.linkedin.com/in/${linkedinUsername}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-linear-to-r from-primary to-highlight px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">{t('pages.about.contact.emailButton')}</span>
          </a>
          <Link
            to={`/${i18n.language}/contact`}
            className="group text-sm leading-10 font-semibold text-gray-900 transition-colors hover:text-primary dark:text-gray-100 dark:hover:text-primary-light"
          >
            {t('pages.about.contact.contactFormLink')}{' '}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutContact
