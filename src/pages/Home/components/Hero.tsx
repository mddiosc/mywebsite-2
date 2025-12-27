import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { HERO_ANIMATION_CONFIG } from '../constants/heroAnimations'
import { useHeroData } from '../hooks'

import { fadeIn, smoothTransition } from '@/lib/animations'

// Staggered letter animation for the title
const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

// Container for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
}

// Animated gradient text component
function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(' ')

  return (
    <motion.h1
      className="text-5xl leading-tight font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${word}-${String(wordIndex)}`} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`char-${word}-${char}-${String(charIndex)}`}
              custom={wordIndex * 10 + charIndex}
              variants={letterVariants}
              className="inline-block bg-linear-to-r from-gray-900 via-primary to-highlight bg-clip-text text-transparent dark:from-white dark:via-primary-light dark:to-accent"
              style={{
                backgroundSize: '200% 100%',
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.h1>
  )
}

// Availability status badge
function StatusBadge({
  announcement,
  readMore,
  language,
}: {
  announcement: string
  readMore: string
  language: string
}) {
  return (
    <motion.div
      className="mb-8 flex justify-center sm:mb-10 lg:mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link
        to={`/${language}/contact`}
        className="group relative inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary/10 to-accent/10 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-primary/20 transition-all hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/40 dark:from-primary/20 dark:to-accent/20 dark:text-gray-200 dark:ring-primary/30"
      >
        {/* Animated pulse dot */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
        </span>

        <span>{announcement}</span>

        <span className="font-semibold text-primary transition-colors group-hover:text-primary-dark dark:text-primary-light">
          {readMore}
          <span
            aria-hidden="true"
            className="ml-1 inline-block transition-transform group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </Link>
    </motion.div>
  )
}

export default function Hero() {
  const { title, subtitle, announcement, readMore, language } = useHeroData()

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
      {/* Status Badge */}
      <StatusBadge announcement={announcement} readMore={readMore} language={language} />

      {/* Main Content */}
      <div className="text-center">
        {/* Animated Title */}
        <AnimatedTitle text={title} />

        {/* Subtitle with fade in */}
        <motion.p
          className="mx-auto mt-6 max-w-3xl text-lg font-medium text-pretty text-gray-600 sm:mt-8 sm:text-xl lg:mt-10 lg:text-2xl/relaxed dark:text-gray-300"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ ...smoothTransition, ...HERO_ANIMATION_CONFIG.subtitle }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative element */}
        <motion.div
          className="mt-10 flex justify-center sm:mt-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary via-highlight to-accent opacity-30 blur-lg"></div>
            {/* Scroll indicator */}
            <div className="relative flex h-12 w-8 items-start justify-center rounded-full border-2 border-gray-300 p-2 dark:border-gray-600">
              <motion.div
                className="h-2 w-1 rounded-full bg-primary"
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
