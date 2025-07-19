import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIG } from '../constants/animations'
import type { Technology } from '../constants/technologies'
import { commonTransition, slideIn } from '../lib/animations'

interface TechnologyGridProps {
  technologies: Technology[]
  skills: string[]
}

const TechnologyGrid = ({ technologies, skills }: TechnologyGridProps) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={slideIn}
      transition={{ ...commonTransition, ...ANIMATION_CONFIG.technologies }}
    >
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          {t('pages.about.skills.title')}
        </h2>
        <p className="mt-6 text-lg/8 text-gray-600">{t('pages.about.skills.description')}</p>
      </div>

      {/* Logo cloud */}
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        {technologies.map((tech) => (
          <div key={tech.name} className="flex flex-col items-center">
            <img
              alt={tech.name}
              src={tech.logo}
              width={80}
              height={80}
              className="max-h-16 w-full object-contain"
            />
            <p className="mt-3 text-sm font-medium text-gray-900">{tech.name}</p>
          </div>
        ))}
      </div>

      {/* All Skills */}
      <div className="mx-auto mt-16 max-w-2xl lg:mx-0">
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index.toString()}`}
              className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset"
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
