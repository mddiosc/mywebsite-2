import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import { Hero, HomeFeatures } from './components'

import { DocumentHead } from '../../components'
import { fadeIn, smoothTransition } from '../../lib/animations'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <DocumentHead
        title={`${t('navigation.home')} - Portfolio`}
        description={t('components.hero.subtitle')}
        keywords="portfolio, developer, frontend, react, typescript"
      />

      <motion.div
        className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center pb-16 sm:min-h-[calc(100vh-8rem)] sm:pb-20 lg:pb-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={smoothTransition}
      >
        {/* Hero Section - Part of unified layout */}
        <div className="flex w-full items-center justify-center">
          <Hero />
        </div>

        {/* Features Section - Continuous flow */}
        <div className="mt-8 w-full sm:mt-12 lg:mt-16 xl:mt-20">
          <HomeFeatures />
        </div>
      </motion.div>
    </>
  )
}

export default Home
