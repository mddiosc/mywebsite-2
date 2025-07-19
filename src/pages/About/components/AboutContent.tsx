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
      className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.content }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          {t('pages.about.biography.title')}
        </h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
          <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <div className="space-y-6">
              {biographyParagraphs.map((paragraph, idx) => (
                <p
                  key={`para-${idx.toString()}`}
                  className={idx === 0 ? 'text-xl/8 text-gray-600' : 'text-base/7 text-gray-700'}
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
                  <dt className="text-base/7 text-gray-600">{stat.label}</dt>
                  <dd className="text-5xl font-semibold tracking-tight text-gray-900">
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
