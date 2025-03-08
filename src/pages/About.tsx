import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { commonTransition, fadeIn, slideIn, scaleIn } from '../lib/animations'

const About = () => {
  const { t } = useTranslation()

  const skills = t('pages.about.skills.items', { returnObjects: true }) as string[]

  return (
    <div className="relative isolate flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ ...commonTransition, duration: 1 }}
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </motion.div>
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
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ ...commonTransition, duration: 1, delay: 0.2 }}
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </motion.div>
    </div>
  )
}

export default About
