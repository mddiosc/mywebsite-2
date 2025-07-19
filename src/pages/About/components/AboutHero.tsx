import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIG } from '@/constants/animations'
import { commonTransition, slideIn } from '@/lib/animations'

interface AboutHeroProps {
  biographyParagraphs: string[]
}

const AboutHero = ({ biographyParagraphs }: AboutHeroProps) => {
  const { t, i18n } = useTranslation()

  return (
    <div className="relative isolate -z-10">
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
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
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#about-hero-pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div className="overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 sm:pt-40 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <motion.div
              className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={slideIn}
              transition={{ ...commonTransition, ...ANIMATION_CONFIG.hero }}
            >
              <h2 className="text-base/7 font-semibold text-indigo-600">
                {t('pages.about.title')}
              </h2>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl">
                {t('pages.about.name')}
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                {biographyParagraphs[0]}
              </p>
              <div className="mt-8">
                <Link
                  to={`/${i18n.language}/projects`}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t('pages.about.biography.buttonText')}
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
