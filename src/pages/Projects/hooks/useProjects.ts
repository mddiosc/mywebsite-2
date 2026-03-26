import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import projectsSnapshot from '@/data/projects-snapshot.json'
import { GitHubProject, ProjectsSnapshot } from '@/types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseProjectsSnapshot = (value: unknown): ProjectsSnapshot => {
  if (!isRecord(value) || !Array.isArray(value['projects'])) {
    throw new Error('Projects snapshot is invalid or missing the projects array')
  }

  return {
    generatedAt:
      typeof value['generatedAt'] === 'string' ? value['generatedAt'] : new Date(0).toISOString(),
    source: value['source'] === 'generated' ? 'generated' : 'fallback',
    projects: value['projects'] as GitHubProject[],
  }
}

/**
 * Interface for project statistics
 */
export interface ProjectStatistics {
  totalProjects: number
  totalStars: number
  uniqueTechnologies: number
  technologiesList: string[]
  totalForks: number
  projectsWithDemos: number
  allTopics: string[]
  uniqueTopics: number
}

/**
 * Interface for the complete useProjects hook return
 */
export interface UseProjectsReturn {
  data: GitHubProject[] | undefined
  isLoading: boolean
  error: Error | null
  statistics: ProjectStatistics
}

/**
 * Calculate project statistics from GitHub projects data
 * @param projects - Array of GitHub projects
 * @returns Project statistics object
 */
const calculateProjectStatistics = (projects: GitHubProject[] | undefined): ProjectStatistics => {
  if (!projects || projects.length === 0) {
    return {
      totalProjects: 0,
      totalStars: 0,
      uniqueTechnologies: 0,
      technologiesList: [],
      totalForks: 0,
      projectsWithDemos: 0,
      allTopics: [],
      uniqueTopics: 0,
    }
  }

  // Calculate total stars
  const totalStars = projects.reduce((acc, project) => acc + (project.stargazers_count || 0), 0)

  // Calculate total forks
  const totalForks = projects.reduce((acc, project) => acc + (project.forks_count || 0), 0)

  // Calculate projects with demos (homepage links)
  const projectsWithDemos = projects.filter(
    (project) => project.homepage && project.homepage.trim() !== '',
  ).length

  // Calculate unique technologies
  const allTechnologies = new Set([
    ...projects
      .map((project) => project.language)
      .filter(
        (language): language is string => typeof language === 'string' && language.length > 0,
      ),
    ...projects.flatMap((project) => (project.languages ? Object.keys(project.languages) : [])),
  ])

  const technologiesList = Array.from(allTechnologies).sort((a, b) => a.localeCompare(b))

  // Calculate topics
  const allTopics = projects.flatMap((project) => project.topics)
  const uniqueTopicsSet = new Set(allTopics)
  const uniqueTopicsList = Array.from(uniqueTopicsSet).sort((a, b) => a.localeCompare(b))

  return {
    totalProjects: projects.length,
    totalStars,
    uniqueTechnologies: allTechnologies.size,
    technologiesList,
    totalForks,
    projectsWithDemos,
    allTopics: uniqueTopicsList,
    uniqueTopics: uniqueTopicsSet.size,
  }
}

/**
 * Fetches GitHub projects and their languages
 * @returns A promise that resolves to an array of GitHub projects with language data
 */
const fetchProjects = async (): Promise<GitHubProject[]> => {
  const snapshot = parseProjectsSnapshot(projectsSnapshot)
  return await Promise.resolve(snapshot.projects)
}

/**
 * Custom hook for fetching GitHub projects with language data and statistics
 * @param options - React Query options for the query
 * @returns React Query result object with GitHub projects data and calculated statistics
 */
export const useProjects = (options?: UseQueryOptions<GitHubProject[]>): UseProjectsReturn => {
  const query = useQuery<GitHubProject[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    select: (data) => {
      return data
        .filter((project) => project.id !== 334629076)
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })
    },
    // Keep previous data while refetching for smoother UX
    placeholderData: (previousData) => previousData,
    ...options,
  })

  // Calculate statistics from the filtered data
  const statistics = calculateProjectStatistics(query.data)

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    statistics,
  }
}
