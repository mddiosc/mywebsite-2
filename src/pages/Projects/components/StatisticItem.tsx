import { motion } from 'framer-motion'

import { StatisticItemProps } from '../types'

import { fadeIn, smoothTransition } from '@/lib/animations'

/**
 * Component that displays a single statistic item
 */
const StatisticItem = ({ value, label, delay = 0 }: StatisticItemProps) => {
  return (
    <motion.div
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: delay }}
    >
      <div className="text-3xl font-bold text-indigo-600 sm:text-4xl">{value}</div>
      <div className="mt-2 text-sm font-medium text-gray-600 sm:text-base">{label}</div>
    </motion.div>
  )
}

export default StatisticItem
