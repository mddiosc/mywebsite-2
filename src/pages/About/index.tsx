import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { AboutContact, AboutContent, AboutHero, TechnologyGrid } from './components'
import { useAboutData } from './hooks'

import { DocumentHead } from '@/components'
import { fadeIn, smoothTransition } from '@/lib/animations'

/**
 * About page component
 * Displays information about the developer including biography, stats, technologies, and contact information
 */
const AboutPage = () => {
  const { t } = useTranslation()
  const { skills, stats, technologies, biographyParagraphs } = useAboutData()

  return (
    <>
      <DocumentHead
        title={`${t('navigation.about')} - Portfolio`}
        description={t('about.hero.subtitle')}
        keywords="about, developer, skills, technologies, experience, biography"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
      >
        <AboutHero />
        <AboutContent biographyParagraphs={biographyParagraphs} stats={stats} />
        <TechnologyGrid technologies={technologies} skills={skills} />
        <AboutContact />
      </motion.div>
    </>
  )
}

export default AboutPage
