import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { axiosInstance } from '../lib/axios'

import { GitHubProject } from '@/types'

/**
 * Type definition for repository languages
 * Maps language names to number of bytes of code
 */
type Languages = Record<string, number>

/**
 * Fetches GitHub projects and their languages
 * @returns A promise that resolves to an array of GitHub projects with language data
 */
const fetchProjects = async (): Promise<GitHubProject[]> => {
  // Get repository list
  const { data } = await axiosInstance.get<GitHubProject[]>(
    'https://api.github.com/users/mddiosc/repos',
  )

  const projectsWithLanguages = await Promise.all(
    data.map(async (project) => {
      try {
        const languagesResponse = await axiosInstance.get<Languages>(
          project.languages_url || `https://api.github.com/repos/mddiosc/${project.name}/languages`,
        )

        // Add languages to the project object
        return {
          ...project,
          languages: languagesResponse.data,
        }
      } catch (error) {
        console.error(`Error fetching languages for ${project.name}:`, error)
        // If request fails, return project without languages
        return {
          ...project,
          languages: {} as Languages,
        }
      }
    }),
  )

  return projectsWithLanguages
}

/**
 * Custom hook for fetching GitHub projects with language data
 * @param options - React Query options for the query
 * @returns React Query result object with GitHub projects data
 */
const useProjects = (options?: UseQueryOptions<GitHubProject[]>) => {
  return useQuery<GitHubProject[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    select: (data) => {
      return data.filter((project) => project.id !== 334629076)
    },
    ...options,
  })
}

export default useProjects
