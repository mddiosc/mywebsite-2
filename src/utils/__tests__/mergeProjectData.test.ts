import { describe, it, expect, beforeEach } from 'vitest'

import type { GitHubProject, ProjectCaseStudy } from '@/types'
import { mergeProjectsWithCaseStudies } from '../mergeProjectData'

const mockOwner = {
  login: 'testuser',
  id: 1,
  avatar_url: 'https://github.com/images/error/testuser_happy.gif',
  html_url: 'https://github.com/testuser',
}

const createMockProject = (overrides?: Partial<GitHubProject>): GitHubProject => ({
  id: 1,
  name: 'test-project',
  full_name: 'testuser/test-project',
  description: 'A test project',
  html_url: 'https://github.com/testuser/test-project',
  homepage: null,
  language: 'TypeScript',
  languages_url: 'https://api.github.com/repos/testuser/test-project/languages',
  created_at: new Date('2023-01-01T00:00:00Z'),
  updated_at: new Date('2023-01-01T00:00:00Z'),
  pushed_at: new Date('2023-01-01T00:00:00Z'),
  stargazers_count: 10,
  watchers_count: 5,
  forks_count: 2,
  open_issues_count: 1,
  archived: false,
  disabled: false,
  private: false,
  fork: false,
  topics: ['typescript', 'react'],
  visibility: 'public',
  default_branch: 'main',
  forks: 2,
  open_issues: 1,
  watchers: 5,
  size: 1000,
  owner: mockOwner,
  languages: { TypeScript: 8000, JavaScript: 2000 },
  ...overrides,
})

const createMockCaseStudy = (overrides?: Partial<ProjectCaseStudy>): ProjectCaseStudy => ({
  slug: 'test-case-study',
  title: 'Test Case Study',
  description: 'A test case study',
  body: '# Test\n\nThis is a test.',
  meta: {
    repoName: 'test-project',
    date: new Date('2023-01-01'),
    role: 'Developer',
    status: 'Completed',
    client: 'Test Client',
    tags: [],
  },
  readingTime: {
    text: '1 min read',
    minutes: 1,
  },
  ...overrides,
})

describe('mergeProjectData utilities', () => {
  describe('mergeProjectsWithCaseStudies', () => {
    it('should merge projects with matching case studies', () => {
      const project = createMockProject({ name: 'test-project' })
      const caseStudy = createMockCaseStudy({
        meta: { ...createMockCaseStudy().meta, repoName: 'test-project' },
      })

      const result = mergeProjectsWithCaseStudies([project], [caseStudy])

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        project,
        caseStudy,
        hasCaseStudy: true,
      })
    })

    it('should mark projects without case studies with hasCaseStudy=false', () => {
      const project = createMockProject({ name: 'unmatched-project' })
      const caseStudy = createMockCaseStudy({
        meta: { ...createMockCaseStudy().meta, repoName: 'different-project' },
      })

      const result = mergeProjectsWithCaseStudies([project], [caseStudy])

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        project,
        caseStudy: null,
        hasCaseStudy: false,
      })
    })

    it('should handle multiple projects and case studies', () => {
      const project1 = createMockProject({ id: 1, name: 'project-one' })
      const project2 = createMockProject({ id: 2, name: 'project-two' })
      const project3 = createMockProject({ id: 3, name: 'project-three' })

      const caseStudy1 = createMockCaseStudy({
        slug: 'cs-one',
        meta: { ...createMockCaseStudy().meta, repoName: 'project-one' },
      })
      const caseStudy2 = createMockCaseStudy({
        slug: 'cs-two',
        meta: { ...createMockCaseStudy().meta, repoName: 'project-two' },
      })

      const result = mergeProjectsWithCaseStudies(
        [project1, project2, project3],
        [caseStudy1, caseStudy2],
      )

      expect(result).toHaveLength(3)
      expect(result[0].hasCaseStudy).toBe(true)
      expect(result[1].hasCaseStudy).toBe(true)
      expect(result[2].hasCaseStudy).toBe(false)
    })

    it('should handle empty projects array', () => {
      const caseStudy = createMockCaseStudy()
      const result = mergeProjectsWithCaseStudies([], [caseStudy])

      expect(result).toHaveLength(0)
    })

    it('should handle empty case studies array', () => {
      const project = createMockProject()
      const result = mergeProjectsWithCaseStudies([project], [])

      expect(result).toHaveLength(1)
      expect(result[0].hasCaseStudy).toBe(false)
      expect(result[0].caseStudy).toBeNull()
    })

    it('should handle both arrays empty', () => {
      const result = mergeProjectsWithCaseStudies([], [])

      expect(result).toHaveLength(0)
    })
  })
})
