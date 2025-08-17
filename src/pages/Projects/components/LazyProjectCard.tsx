import { lazy, Suspense } from 'react'

import ProjectSkeleton from './ProjectSkeleton'

import { GitHubProject } from '@/types'

// Lazy load the ProjectCard component
const ProjectCard = lazy(async () => import('./ProjectCard'))

interface LazyProjectCardProps {
  project: GitHubProject
  delay: number
}

/**
 * Lazy loaded wrapper for ProjectCard to improve performance
 */
const LazyProjectCard = ({ project, delay }: LazyProjectCardProps) => (
  <Suspense fallback={<ProjectSkeleton />}>
    <ProjectCard project={project} delay={delay} />
  </Suspense>
)

export default LazyProjectCard
