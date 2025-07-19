import { motion } from 'framer-motion'

import { AboutContact, AboutContent, AboutHero, TechnologyGrid } from './components'
import { useAboutData } from './hooks'

import { fadeIn, smoothTransition } from '@/lib/animations'

/**
 * About page component
 * Displays information about the developer including biography, stats, technologies, and contact information
 */
const AboutPage = () => {
  const { skills, stats, technologies, biographyParagraphs } = useAboutData()

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={smoothTransition}>
      <AboutHero biographyParagraphs={biographyParagraphs} />
      <AboutContent biographyParagraphs={biographyParagraphs} stats={stats} />
      <TechnologyGrid technologies={technologies} skills={skills} />
      <AboutContact />
    </motion.div>
  )
}

export default AboutPage
