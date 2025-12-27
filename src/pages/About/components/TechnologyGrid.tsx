import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { OptimizedLogo } from '@/components'
import { ANIMATION_CONFIG } from '@/constants/animations'
import type { Technology } from '@/constants/technologies'
import { commonTransition, slideIn } from '@/lib/animations'

interface TechnologyGridProps {
  technologies: Technology[]
  skills: string[]
}

const TechnologyGrid = ({ technologies, skills }: TechnologyGridProps) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:mt-24 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.technologies }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
          {t('pages.about.skills.title')}
        </h2>
        <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
          {t('pages.about.skills.description')}
        </p>
      </div>

      {/* Logo cloud */}
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="group flex flex-col items-center rounded-xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-110 dark:ring-gray-700">
              <OptimizedLogo
                src={tech.logo}
                alt={tech.name}
                width={80}
                height={80}
                className="max-h-14 w-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">{tech.name}</p>
          </div>
        ))}
      </div>

      {/* All Skills */}
      <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index.toString()}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary ring-1 ring-primary/20 transition-all ring-inset hover:bg-primary/20 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TechnologyGrid
