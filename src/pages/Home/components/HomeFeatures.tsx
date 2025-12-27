import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { motion } from 'framer-motion'

import { fadeIn, smoothTransition } from '@/lib/animations'

// Bento card component with glassmorphism and hover effects
interface BentoCardProps {
  title: string
  description: string
  icon: string
  index: number
  size?: 'normal' | 'large' | 'tall'
  gradient?: string
}

function BentoCard({
  title,
  description,
  icon,
  index,
  size = 'normal',
  gradient = 'from-primary/5 to-accent/5',
}: BentoCardProps) {
  const sizeClasses = {
    normal: '',
    large: 'md:col-span-2',
    tall: 'md:row-span-2',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 1.0 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-linear-to-br ${gradient} p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-8 dark:border-gray-700/50 dark:hover:border-primary/40 ${sizeClasses[size]}`}
    >
      {/* Glassmorphism overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />

      {/* Animated glow effect */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-r from-primary via-highlight to-accent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with animation */}
        <motion.div
          className="mb-4 inline-flex items-center justify-center rounded-xl bg-white/80 p-3 text-3xl shadow-sm ring-1 ring-gray-200/50 sm:text-4xl dark:bg-gray-800/80 dark:ring-gray-700/50"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl dark:text-white">{title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 sm:text-base/relaxed dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Corner decoration */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-linear-to-br from-primary/10 to-accent/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-50" />
    </motion.div>
  )
}

// Stats card component
function StatsCard({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 1.5 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-linear-to-br from-highlight/5 to-primary/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-highlight/30 hover:shadow-lg dark:border-gray-700/50"
    >
      <motion.div
        className="text-4xl font-black text-primary sm:text-5xl dark:text-primary-light"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 10,
          delay: 1.8 + index * 0.1,
        }}
      >
        {value}
      </motion.div>
      <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  )
}

const HomeFeatures = () => {
  const { t, i18n } = useTranslation()

  const features = t('components.homeFeatures.features', { returnObjects: true }) as {
    title: string
    description: string
    icon: string
  }[]

  // Stats data
  const stats = [
    { value: '5+', label: t('pages.about.stats.frontendYears') },
    { value: '14', label: t('pages.about.stats.tourismExperience') },
    { value: '20+', label: t('pages.about.stats.completedProjects') },
  ]

  // Gradient variations for cards
  const gradients = [
    'from-primary/5 via-primary/10 to-highlight/5 dark:from-primary/10 dark:to-highlight/10',
    'from-accent/5 via-accent/10 to-primary/5 dark:from-accent/10 dark:to-primary/10',
    'from-highlight/5 via-highlight/10 to-accent/5 dark:from-highlight/10 dark:to-accent/10',
  ]

  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: 0.8 }}
    >
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <span className="bg-linear-to-r from-primary via-highlight to-accent bg-clip-text text-transparent">
            {t('components.homeFeatures.subtitle')}
          </span>
        </motion.h2>
        <motion.p
          className="mt-4 text-base text-gray-600 sm:mt-6 sm:text-lg/relaxed dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {t('components.homeFeatures.description')}
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Feature Cards */}
        {features.map((feature, index) => (
          <BentoCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            index={index}
            gradient={gradients[index % gradients.length]}
          />
        ))}
      </div>

      {/* Stats Grid */}
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-4 sm:mt-12 sm:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.label} value={stat.value} label={stat.label} index={index} />
        ))}
      </div>

      {/* CTA Buttons */}
      <motion.div
        className="mt-12 flex flex-col items-center gap-4 sm:mt-16 sm:flex-row sm:justify-center sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.0 }}
      >
        <Link
          to={`/${i18n.language}/about`}
          className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-primary to-highlight px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 sm:w-auto sm:px-8 sm:py-4"
        >
          <span className="relative z-10">{t('components.homeFeatures.ctaSecondary')}</span>
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </Link>
        <Link
          to={`/${i18n.language}/projects`}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-primary sm:text-base dark:text-gray-100 dark:hover:text-primary-light"
        >
          {t('components.homeFeatures.ctaPrimary')}
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default HomeFeatures
