/**
 * Project case study types - editorial content layer for selected projects
 */

import type { GitHubProject } from '@/types'

export interface ProjectCaseStudyMeta {
  /** Unique identifier for the case study, matching project slug */
  slug: string
  /** Display title of the case study */
  title: string
  /** Short summary or tagline */
  summary: string
  /** Publication date in YYYY-MM-DD format */
  published: string
  /** Whether to feature prominently in listings */
  featured?: boolean
  /** Role or involvement in the project */
  role?: string
  /** Current project status (completed, ongoing, archived, etc.) */
  status?: string
  /** Business or technical outcomes */
  outcomes?: string[]
  /** Repository name or identifier for matching with snapshot data */
  repoName: string
  /** Slugs of related blog posts */
  relatedPosts?: string[]
}

export interface ProjectCaseStudy {
  /** Case study metadata from frontmatter */
  meta: ProjectCaseStudyMeta
  /** Markdown body content */
  content: string
  /** Slug for URL routing */
  slug: string
  /** Estimated reading time in minutes */
  readingTime: number
}

/**
 * Merged view combining snapshot project data with case study content
 */
export interface ProjectWithCaseStudy {
  /** GitHub project snapshot data */
  project: GitHubProject
  /** Associated case study, if present */
  caseStudy: ProjectCaseStudy | null
  /** Whether this project has editorial content */
  hasCaseStudy: boolean
}

export type CaseStudyLanguage = 'es' | 'en'

export interface ProjectCaseStudiesSnapshot {
  /** When the snapshot was generated */
  generatedAt: string
  /** Language of the snapshot */
  language: CaseStudyLanguage
  /** Case studies indexed by slug */
  caseStudies: Record<string, ProjectCaseStudy>
}
