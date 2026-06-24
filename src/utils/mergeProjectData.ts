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
function createCaseStudyMap(caseStudies: ProjectCaseStudy[]): Map<string, ProjectCaseStudy> {
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
