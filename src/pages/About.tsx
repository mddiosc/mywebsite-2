import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { commonTransition, slideIn, scaleIn } from '../lib/animations'

const About = () => {
  const { t } = useTranslation()

  const skills = t('pages.about.skills.items', { returnObjects: true }) as string[]

  return (
    <div className="relative isolate flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
      <motion.h1
        className="mb-8 text-4xl font-bold"
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        transition={{ ...commonTransition, delay: 0.2 }}
      >
        {t('pages.about.title')}
      </motion.h1>
      <div className="about-content max-w-4xl">
        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.3 }}
        >
          <h2 className="text-3xl font-semibold">{t('pages.about.biography.title')}</h2>
          <p className="mt-4 text-lg text-gray-500">{t('pages.about.biography.content')}</p>
        </motion.section>

        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold">{t('pages.about.skills.title')}</h2>
          <ul className="mt-4 list-inside list-disc text-lg text-gray-500">
            {skills.map((skill, index) => (
              <li key={`${skill}-${index.toString()}`}>{skill}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold">{t('pages.about.projects.title')}</h2>
          <p className="mt-4 text-lg text-gray-500">{t('pages.about.projects.content')}</p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={slideIn}
          transition={{ ...commonTransition, delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold">{t('pages.about.contact.title')}</h2>
          <p className="mt-4 text-lg text-gray-500">{t('pages.about.contact.content')}</p>
        </motion.section>
      </div>
    </div>
  )
}

export default About
