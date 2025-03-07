import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { axiosInstance } from '../lib/axios'

import { GitHubProject } from '@/types'

const fetchProjects = async (): Promise<GitHubProject[]> => {
  const { data } = await axiosInstance.get<GitHubProject[]>(
    'https://api.github.com/users/mddiosc/repos',
  )
  return data
}

const useProjects = (options?: UseQueryOptions<GitHubProject[]>) => {
  return useQuery<GitHubProject[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    ...options,
  })
}

export default useProjects
