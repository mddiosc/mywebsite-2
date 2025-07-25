import { motion } from 'framer-motion'

import ProjectCard from './ProjectCard'
import ProjectSkeleton from './ProjectSkeleton'

import { PROJECTS_CONSTANTS } from '../constants'
import { ProjectsGridProps } from '../types'

import { fadeIn, smoothTransition } from '@/lib/animations'

/**
 * Component that displays the projects grid with loading and error states
 */
const ProjectsGrid = ({ projects, isLoading, error }: ProjectsGridProps) => {
  const skeletons = Array.from({ length: PROJECTS_CONSTANTS.SKELETON_COUNT }, (_, i) => i)

  return (
    <motion.div
      className={`mt-10 grid gap-x-6 gap-y-10 xl:gap-x-8 ${PROJECTS_CONSTANTS.GRID_RESPONSIVE.BASE} ${PROJECTS_CONSTANTS.GRID_RESPONSIVE.SM} ${PROJECTS_CONSTANTS.GRID_RESPONSIVE.LG}`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ ...smoothTransition, delay: PROJECTS_CONSTANTS.ANIMATION_DELAYS.GRID }}
    >
      {/* Loading state */}
      {isLoading &&
        skeletons.map((index) => <ProjectSkeleton key={`skeleton-${index.toString()}`} />)}

      {/* Projects loaded */}
      {!isLoading &&
        !error &&
        projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            delay={
              PROJECTS_CONSTANTS.ANIMATION_DELAYS.CARD_BASE +
              index * PROJECTS_CONSTANTS.ANIMATION_DELAYS.CARD_INCREMENT
            }
          />
        ))}
    </motion.div>
  )
}

export default ProjectsGrid
