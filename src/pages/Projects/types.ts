/**
 * Types specific to the Projects page
 */

import { GitHubProject } from '@/types'

export interface StatisticItemProps {
  value: number
  label: string
  delay?: number
}

export interface TopicsDisplayProps {
  topics: string[]
  maxTopics?: number
  delay?: number
}

export interface ProjectsGridProps {
  projects: GitHubProject[]
  isLoading: boolean
  error: Error | null
}

export interface ProjectsErrorProps {
  error: Error | null
}
