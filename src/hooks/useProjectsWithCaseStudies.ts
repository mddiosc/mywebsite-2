import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { useProjectCaseStudies } from './useProjectCaseStudies'

import { useProjects } from '@/pages/Projects/hooks/useProjects'
import type { ProjectWithCaseStudy } from '@/types'
import { mergeProjectsWithCaseStudies } from '@/utils/mergeProjectData'

/**
 * Extended hook that combines projects with case study enrichment
 * Falls back gracefully if case studies are not available
 */
export function useProjectsWithCaseStudies() {
  const { i18n } = useTranslation()

  // Load projects
  const projectsQuery = useProjects()

  // Load case studies in the current language
  const caseStudiesQuery = useProjectCaseStudies()

  // Combine and merge data — wait for both queries to settle before merging
  const mergedQuery = useQuery({
    queryKey: [
      'projects-with-case-studies',
      i18n.language,
      // Re-run merge when case studies finish loading (count change signals new data)
      caseStudiesQuery.data?.length ?? 0,
    ],
    queryFn: () => {
      if (!projectsQuery.data) {
        throw new Error('Projects data not available')
      }

      // If case studies failed to load, return projects without enrichment
      if (caseStudiesQuery.error) {
        console.warn('Case studies failed to load, returning projects without enrichment', {
          error: caseStudiesQuery.error,
        })
        return projectsQuery.data.map((project) => ({
          project,
          caseStudy: null,
          hasCaseStudy: false,
        }))
      }

      // Merge projects with case studies
      const caseStudies = caseStudiesQuery.data ?? []
      return mergeProjectsWithCaseStudies(projectsQuery.data, caseStudies)
    },
    // Wait for projects to load AND for case studies to finish loading (success or error)
    enabled: !!projectsQuery.data && !caseStudiesQuery.isLoading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData: ProjectWithCaseStudy[] | undefined) => previousData,
  })

  return {
    data: mergedQuery.data,
    isLoading: projectsQuery.isLoading || caseStudiesQuery.isLoading || mergedQuery.isLoading,
    error: projectsQuery.error ?? caseStudiesQuery.error ?? mergedQuery.error,
    projectsOnly: projectsQuery.data,
    caseStudiesOnly: caseStudiesQuery.data,
    statistics: projectsQuery.statistics,
    refetch: async () => mergedQuery.refetch(),
  }
}

/**
 * Hook for getting a single project with its case study
 */
export function useProjectWithCaseStudy(projectSlug: string) {
  const { data: mergedProjects, isLoading, error, refetch } = useProjectsWithCaseStudies()

  const projectWithCaseStudy =
    mergedProjects?.find((item: ProjectWithCaseStudy) => {
      return item.caseStudy?.slug === projectSlug || item.project.name === projectSlug
    }) ?? null

  return {
    data: projectWithCaseStudy,
    isLoading,
    error: !projectWithCaseStudy && !isLoading && !error ? new Error('Project not found') : error,
    refetch,
  }
}
