import { useMemo } from 'react'

import { useProjectCaseStudies } from './useProjectCaseStudies'

import { useProjects } from '@/pages/Projects/hooks/useProjects'
import { mergeProjectsWithCaseStudies } from '@/utils/mergeProjectData'

/**
 * Extended hook that combines projects with case study enrichment.
 * Merges synchronously with useMemo so locale switches are reflected immediately
 * without a stale intermediate React Query cache entry.
 * Falls back gracefully if case studies are not available.
 */
export function useProjectsWithCaseStudies() {
  // Load projects
  const projectsQuery = useProjects()

  // Load case studies in the current language.
  // useProjectCaseStudies already keys its query by language, so data here
  // always corresponds to the active locale.
  const caseStudiesQuery = useProjectCaseStudies()

  const isLoading = projectsQuery.isLoading || caseStudiesQuery.isLoading
  const error = projectsQuery.error ?? caseStudiesQuery.error ?? null

  // Merge whenever either data source changes. No third query needed.
  const data = useMemo(() => {
    if (!projectsQuery.data) return undefined

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

    const caseStudies = caseStudiesQuery.data ?? []
    return mergeProjectsWithCaseStudies(projectsQuery.data, caseStudies)
  }, [projectsQuery.data, caseStudiesQuery.data, caseStudiesQuery.error])

  return {
    data,
    isLoading,
    error,
    projectsOnly: projectsQuery.data,
    caseStudiesOnly: caseStudiesQuery.data,
    statistics: projectsQuery.statistics,
    refetch: async () => {
      await caseStudiesQuery.refetch()
    },
  }
}

/**
 * Hook for getting a single project with its case study
 */
export function useProjectWithCaseStudy(projectSlug: string) {
  const { data: mergedProjects, isLoading, error, refetch } = useProjectsWithCaseStudies()

  const projectWithCaseStudy =
    mergedProjects?.find((item) => {
      return item.caseStudy?.slug === projectSlug || item.project.name === projectSlug
    }) ?? null

  return {
    data: projectWithCaseStudy,
    isLoading,
    error: !projectWithCaseStudy && !isLoading && !error ? new Error('Project not found') : error,
    refetch,
  }
}
