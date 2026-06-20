import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIG } from '@/constants/animations'
import { commonTransition, fadeInUp } from '@/lib/animations'

const AboutHero = () => {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative isolate">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-256 w-full mask-[radial-gradient(32rem_32rem_at_center,white,transparent)] stroke-gray-200 dark:stroke-gray-800"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="about-hero-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-900">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#about-hero-pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div className="relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <motion.div
              className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ ...commonTransition, ...ANIMATION_CONFIG.hero }}
            >
              <h1 className="text-4xl font-black tracking-tight text-pretty sm:text-5xl">
                <span className="text-gradient">{t('pages.about.name')}</span>
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-600 sm:max-w-md sm:text-xl/8 lg:max-w-none dark:text-gray-300">
                {t('pages.about.hero.subtitle')}
              </p>
              <div className="mt-8">
                <Link
                  to={`/${i18n.language}/projects`}
                  className="group relative inline-flex items-center overflow-hidden rounded-full bg-linear-to-r from-primary to-highlight px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  <span className="shine-overlay" aria-hidden="true" />
                  <span className="relative">{t('pages.about.biography.buttonText')}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutHero
