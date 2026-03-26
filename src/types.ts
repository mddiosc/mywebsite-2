export interface ProjectOwner {
  login: string
  avatar_url?: string
  html_url?: string
  [key: string]: unknown
}

export interface GitHubProject {
  id: number
  name: string
  full_name: string
  owner?: ProjectOwner
  html_url: string
  description: null | string
  languages?: Record<string, number>
  created_at: Date | string
  updated_at: Date | string
  pushed_at?: Date | string
  homepage: null | string
  size?: number
  stargazers_count: number
  watchers_count?: number
  language?: string | null
  forks_count: number
  archived?: boolean
  disabled?: boolean
  topics: string[]
  visibility?: string
  default_branch?: string
  [key: string]: unknown
}

export interface ProjectsSnapshot {
  generatedAt: string
  source: 'generated' | 'fallback'
  projects: GitHubProject[]
}

// Re-export case study types for convenience
export type {
  ProjectCaseStudy,
  ProjectCaseStudyMeta,
  ProjectWithCaseStudy,
  CaseStudyLanguage,
  ProjectCaseStudiesSnapshot,
} from './types/projectCaseStudy'
