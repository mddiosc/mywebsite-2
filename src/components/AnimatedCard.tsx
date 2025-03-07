import { motion } from 'framer-motion'

import { fadeIn, commonTransition } from '../lib/animations'

interface AnimatedCardProps {
  title: string
  children: React.ReactNode
}

export const AnimatedCard = ({ title, children }: AnimatedCardProps) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={commonTransition}
      className="rounded-lg bg-white p-6 shadow-lg"
    >
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </motion.div>
  )
}
