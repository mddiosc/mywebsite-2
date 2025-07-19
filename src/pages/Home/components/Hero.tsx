import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { HERO_ANIMATION_CONFIG } from '../constants/heroAnimations'
import { useHeroData } from '../hooks'

import { fadeIn, scaleIn, smoothTransition } from '@/lib/animations'

export default function Hero() {
  const { title, subtitle, announcement, readMore, language } = useHeroData()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center lg:mb-10">
        <div className="relative rounded-full bg-indigo-50 px-4 py-2 text-xs text-gray-700 ring-1 ring-indigo-100 hover:ring-indigo-200 sm:text-sm/6">
          {announcement}{' '}
          <Link
            to={`/${language}/contact`}
            className="relative z-10 font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {readMore} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
      <div className="text-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl lg:text-7xl xl:text-8xl"
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ ...smoothTransition, ...HERO_ANIMATION_CONFIG.title }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-4xl text-lg font-medium text-pretty text-gray-600 sm:mt-8 sm:text-xl lg:text-2xl/8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ ...smoothTransition, ...HERO_ANIMATION_CONFIG.subtitle }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  )
}
