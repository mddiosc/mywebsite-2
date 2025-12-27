import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import type { Stat } from '../types'

import { ANIMATION_CONFIG } from '@/constants/animations'
import { commonTransition, slideIn } from '@/lib/animations'

interface AboutContentProps {
  biographyParagraphs: string[]
  stats: Stat[]
}

const AboutContent = ({ biographyParagraphs, stats }: AboutContentProps) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:mt-24 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.content }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
          {t('pages.about.biography.title')}
        </h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
          <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <div className="space-y-6">
              {biographyParagraphs.map((paragraph, idx) => (
                <p
                  key={`para-${idx.toString()}`}
                  className={
                    idx === 0
                      ? 'text-xl/8 text-gray-600 dark:text-gray-300'
                      : 'text-base/7 text-gray-700 dark:text-gray-400'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:flex lg:flex-auto lg:justify-center">
            <dl className="w-64 space-y-8 xl:w-80">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                  <dt className="text-base/7 text-gray-600 dark:text-gray-400">{stat.label}</dt>
                  <dd className="bg-linear-to-r from-primary to-highlight bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutContent
