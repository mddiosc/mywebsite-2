import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { AboutContact, AboutContent, AboutHero, TechnologyGrid } from './components'
import { useAboutData } from './hooks'

import { DocumentHead } from '@/components'
import { fadeIn, smoothTransition } from '@/lib/animations'
import { buildLocalizedSeoUrls } from '@/lib/seo'

/**
 * About page component
 * Displays information about the developer including biography, stats, technologies, and contact information
 */
const AboutPage = () => {
  const { t, i18n } = useTranslation()
  const { skills, stats, technologies, biographyParagraphs } = useAboutData()
  const locale = i18n.language === 'en' ? 'en' : 'es'
  const seoUrls = buildLocalizedSeoUrls(import.meta.env.VITE_SITE_URL, '/about', locale)

  return (
    <>
      <DocumentHead
        title={`${t('navigation.about')} - Portfolio`}
        description={t('about.hero.subtitle')}
        keywords="about, developer, skills, technologies, experience, biography"
        canonicalUrl={seoUrls.canonicalUrl}
        alternateUrls={seoUrls.alternateUrls}
      />

      <motion.div
        className="space-y-16 pt-8 pb-16 sm:space-y-20 sm:pt-12 sm:pb-20 lg:space-y-24 lg:pt-16 lg:pb-24"
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
