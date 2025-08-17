import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { axiosInstance } from '@/lib/axios'
import { GitHubProject } from '@/types'

/**
 * Type definition for repository languages
 * Maps language names to number of bytes of code
 */
type Languages = Record<string, number>

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
    ...projects.map((project) => project.language).filter(Boolean),
    ...projects.flatMap((project) => (project.languages ? Object.keys(project.languages) : [])),
  ])

  const technologiesList = Array.from(allTechnologies).sort()

  // Calculate topics
  const allTopics = projects.flatMap((project) => project.topics)
  const uniqueTopicsSet = new Set(allTopics)
  const uniqueTopicsList = Array.from(uniqueTopicsSet).sort()

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
 * Batch size for concurrent API requests
 */
const API_BATCH_SIZE = 5

/**
 * Delay between batches to avoid rate limiting
 */
const BATCH_DELAY = 100

/**
 * Creates a delay promise
 */
const delay = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Process projects in batches to avoid overwhelming the API
 */
const processBatch = async (
  batch: GitHubProject[],
  headers: Record<string, string>,
  githubUsername: string,
): Promise<GitHubProject[]> => {
  return Promise.all(
    batch.map(async (project) => {
      try {
        const languagesResponse = await axiosInstance.get<Languages>(
          project.languages_url ||
            `https://api.github.com/repos/${githubUsername}/${project.name}/languages`,
          { headers },
        )

        return {
          ...project,
          languages: languagesResponse.data,
        }
      } catch {
        // Silent error handling to avoid console spam
        return {
          ...project,
          languages: {} as Languages,
        }
      }
    }),
  )
}

/**
 * Fetches GitHub projects and their languages with optimized batching
 * @returns A promise that resolves to an array of GitHub projects with language data
 */
const fetchProjects = async (): Promise<GitHubProject[]> => {
  // Configure headers for GitHub API
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }

  // Add authorization header if token is available
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN ?? ''
  const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? ''

  if (githubToken && githubToken !== 'your_github_token_here') {
    headers['Authorization'] = `token ${githubToken}`
  }

  // Get repository list with optimized parameters
  const { data } = await axiosInstance.get<GitHubProject[]>(
    `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated&direction=desc`,
    { headers },
  )

  // Process projects in batches to avoid rate limiting and improve performance
  const batches: GitHubProject[][] = []
  for (let i = 0; i < data.length; i += API_BATCH_SIZE) {
    batches.push(data.slice(i, i + API_BATCH_SIZE))
  }

  const projectsWithLanguages: GitHubProject[] = []

  for (const batch of batches) {
    const batchResults = await processBatch(batch, headers, githubUsername)
    projectsWithLanguages.push(...batchResults)

    // Add delay between batches to be nice to the API
    if (batch !== batches[batches.length - 1]) {
      await delay(BATCH_DELAY)
    }
  }

  return projectsWithLanguages
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
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
