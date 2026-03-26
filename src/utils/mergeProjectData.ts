/**
 * Utilities for merging snapshot projects with localized case-study content
 */

import type { GitHubProject, ProjectCaseStudy, ProjectWithCaseStudy } from '@/types'

/**
 * Match a project with its case study based on repository name
 */
function matchProjectToCaseStudy(
  project: GitHubProject,
  caseStudyMap: Map<string, ProjectCaseStudy>,
): ProjectCaseStudy | null {
  // Try to find a case study that matches this project's repo name
  // Case studies use repoName in their metadata for matching
  const caseStudy = caseStudyMap.get(project.name)
  return caseStudy ?? null
}

/**
 * Create a map of case studies indexed by repository name for fast lookup
 */
export function createCaseStudyMap(caseStudies: ProjectCaseStudy[]): Map<string, ProjectCaseStudy> {
  const map = new Map<string, ProjectCaseStudy>()

  for (const caseStudy of caseStudies) {
    // Index by repoName (the repository identifier for matching)
    map.set(caseStudy.meta.repoName, caseStudy)
  }

  return map
}

/**
 * Merge snapshot projects with localized case-study content
 * Projects without matching case studies are preserved with hasCaseStudy=false
 * @param projects - Array of GitHub projects from snapshot
 * @param caseStudies - Array of localized case studies
 * @returns Array of merged project views
 */
export function mergeProjectsWithCaseStudies(
  projects: GitHubProject[],
  caseStudies: ProjectCaseStudy[],
): ProjectWithCaseStudy[] {
  const caseStudyMap = createCaseStudyMap(caseStudies)

  return projects.map((project) => {
    const matchedCaseStudy = matchProjectToCaseStudy(project, caseStudyMap)

    return {
      project,
      caseStudy: matchedCaseStudy,
      hasCaseStudy: matchedCaseStudy !== null,
    }
  })
}

/**
 * Filter merged projects to only those with case studies
 * @param mergedProjects - Array of merged project views
 * @returns Array of projects that have case studies
 */
export function filterProjectsWithCaseStudies(
  mergedProjects: ProjectWithCaseStudy[],
): ProjectWithCaseStudy[] {
  return mergedProjects.filter((item) => item.hasCaseStudy)
}

/**
 * Get a case study by project slug
 * @param slug - The project slug
 * @param mergedProjects - Array of merged project views
 * @returns The matching merged project or null
 */
export function getProjectBySlug(
  slug: string,
  mergedProjects: ProjectWithCaseStudy[],
): ProjectWithCaseStudy | null {
  return (
    mergedProjects.find((item) => item.caseStudy?.slug === slug || item.project.name === slug) ??
    null
  )
}
