import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'

import StatisticItem from './StatisticItem'

import { PROJECTS_CONSTANTS, TRANSLATION_KEYS } from '../constants'
import { ProjectStatistics as ProjectStatisticsType } from '../hooks'

import { fadeIn, smoothTransition } from '@/lib/animations'

interface ProjectStatisticsProps {
  statistics: ProjectStatisticsType
}

/**
 * Component that displays project statistics grid
 */
const ProjectStatistics = ({ statistics }: ProjectStatisticsProps) => {
  const { t } = useTranslation()

  const statisticsData = [
    {
      value: statistics.totalProjects,
      label: t(TRANSLATION_KEYS.STATISTICS.FEATURED_PROJECTS),
    },
    {
      value: statistics.totalStars,
      label: t(TRANSLATION_KEYS.STATISTICS.GITHUB_STARS),
    },
    {
      value: statistics.uniqueTechnologies,
      label: t(TRANSLATION_KEYS.STATISTICS.TECHNOLOGIES),
    },
    {
      value: statistics.totalForks,
      label: t(TRANSLATION_KEYS.STATISTICS.TOTAL_FORKS),
    },
    {
      value: statistics.projectsWithDemos,
      label: t(TRANSLATION_KEYS.STATISTICS.LIVE_DEMOS),
    },
  ]

  return (
    <motion.div
      className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: PROJECTS_CONSTANTS.ANIMATION_DELAYS.STATISTICS }}
    >
      <div
        className={`grid gap-8 ${PROJECTS_CONSTANTS.STATISTICS_GRID.BASE} ${PROJECTS_CONSTANTS.STATISTICS_GRID.SM} ${PROJECTS_CONSTANTS.STATISTICS_GRID.LG}`}
      >
        {statisticsData.map((stat, index) => (
          <StatisticItem
            key={stat.label}
            value={stat.value}
            label={stat.label}
            delay={PROJECTS_CONSTANTS.ANIMATION_DELAYS.STATISTICS + index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default ProjectStatistics
