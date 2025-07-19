import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIG } from '../constants/animations'
import { commonTransition, slideIn } from '../lib/animations'

const AboutContact = () => {
  const { t, i18n } = useTranslation()

  return (
    <motion.div
      className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.contact }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          {t('pages.about.contact.title')}
        </h2>
        <p className="mt-6 text-lg/8 text-gray-600">{t('pages.about.contact.content')}</p>
        <div className="mt-10 flex gap-x-6">
          <a
            href="https://www.linkedin.com/in/mddiosc/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('pages.about.contact.emailButton')}
          </a>
          <Link
            to={`/${i18n.language}/contact`}
            className="text-sm leading-10 font-semibold text-gray-900"
          >
            {t('pages.about.contact.contactFormLink')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutContact
