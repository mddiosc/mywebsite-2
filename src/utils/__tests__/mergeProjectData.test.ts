import { describe, it, expect, beforeEach } from 'vitest'

import type { GitHubProject, ProjectCaseStudy } from '@/types'
import {
  createCaseStudyMap,
  mergeProjectsWithCaseStudies,
  filterProjectsWithCaseStudies,
  getProjectBySlug,
} from '../mergeProjectData'

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
  describe('createCaseStudyMap', () => {
    it('should create a map indexed by repoName', () => {
      const caseStudy1 = createMockCaseStudy({
        meta: { ...createMockCaseStudy().meta, repoName: 'project-one' },
      })
      const caseStudy2 = createMockCaseStudy({
        slug: 'case-study-two',
        meta: { ...createMockCaseStudy().meta, repoName: 'project-two' },
      })

      const map = createCaseStudyMap([caseStudy1, caseStudy2])

      expect(map.size).toBe(2)
      expect(map.get('project-one')).toBe(caseStudy1)
      expect(map.get('project-two')).toBe(caseStudy2)
    })

    it('should handle empty array', () => {
      const map = createCaseStudyMap([])
      expect(map.size).toBe(0)
    })

    it('should handle duplicate repoNames (last one wins)', () => {
      const caseStudy1 = createMockCaseStudy({
        slug: 'first',
        meta: { ...createMockCaseStudy().meta, repoName: 'same-project' },
      })
      const caseStudy2 = createMockCaseStudy({
        slug: 'second',
        meta: { ...createMockCaseStudy().meta, repoName: 'same-project' },
      })

      const map = createCaseStudyMap([caseStudy1, caseStudy2])

      expect(map.size).toBe(1)
      expect(map.get('same-project')).toBe(caseStudy2)
    })
  })

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

  describe('filterProjectsWithCaseStudies', () => {
    it('should filter to only projects with case studies', () => {
      const project1 = createMockProject({ id: 1, name: 'project-one' })
      const project2 = createMockProject({ id: 2, name: 'project-two' })
      const project3 = createMockProject({ id: 3, name: 'project-three' })

      const caseStudy1 = createMockCaseStudy({
        meta: { ...createMockCaseStudy().meta, repoName: 'project-one' },
      })

      const merged = mergeProjectsWithCaseStudies([project1, project2, project3], [caseStudy1])

      const filtered = filterProjectsWithCaseStudies(merged)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].project.id).toBe(1)
      expect(filtered[0].hasCaseStudy).toBe(true)
    })

    it('should return empty array if no projects have case studies', () => {
      const project1 = createMockProject({ id: 1 })
      const project2 = createMockProject({ id: 2 })

      const merged = mergeProjectsWithCaseStudies([project1, project2], [])

      const filtered = filterProjectsWithCaseStudies(merged)

      expect(filtered).toHaveLength(0)
    })

    it('should handle all projects having case studies', () => {
      const project1 = createMockProject({ id: 1, name: 'project-one' })
      const project2 = createMockProject({ id: 2, name: 'project-two' })

      const caseStudy1 = createMockCaseStudy({
        meta: { ...createMockCaseStudy().meta, repoName: 'project-one' },
      })
      const caseStudy2 = createMockCaseStudy({
        slug: 'cs-two',
        meta: { ...createMockCaseStudy().meta, repoName: 'project-two' },
      })

      const merged = mergeProjectsWithCaseStudies([project1, project2], [caseStudy1, caseStudy2])

      const filtered = filterProjectsWithCaseStudies(merged)

      expect(filtered).toHaveLength(2)
    })
  })

  describe('getProjectBySlug', () => {
    let project1: GitHubProject
    let project2: GitHubProject
    let project3: GitHubProject
    let caseStudy1: ProjectCaseStudy
    let caseStudy2: ProjectCaseStudy
    let merged: ReturnType<typeof mergeProjectsWithCaseStudies>

    beforeEach(() => {
      project1 = createMockProject({ id: 1, name: 'react-query' })
      project2 = createMockProject({ id: 2, name: 'openspec-demo' })
      project3 = createMockProject({ id: 3, name: 'no-case-study' })

      caseStudy1 = createMockCaseStudy({
        slug: 'react-query-optimizer',
        meta: { ...createMockCaseStudy().meta, repoName: 'react-query' },
      })
      caseStudy2 = createMockCaseStudy({
        slug: 'openspec-sdd-demo',
        meta: { ...createMockCaseStudy().meta, repoName: 'openspec-demo' },
      })

      merged = mergeProjectsWithCaseStudies(
        [project1, project2, project3],
        [caseStudy1, caseStudy2],
      )
    })

    it('should find project by case study slug', () => {
      const result = getProjectBySlug('react-query-optimizer', merged)

      expect(result).not.toBeNull()
      expect(result?.caseStudy?.slug).toBe('react-query-optimizer')
      expect(result?.project.id).toBe(1)
    })

    it('should find project by project name if case study slug not found', () => {
      const result = getProjectBySlug('no-case-study', merged)

      expect(result).not.toBeNull()
      expect(result?.project.name).toBe('no-case-study')
      expect(result?.hasCaseStudy).toBe(false)
    })

    it('should return null for non-existent slug', () => {
      const result = getProjectBySlug('non-existent', merged)

      expect(result).toBeNull()
    })

    it('should prioritize case study slug over project name', () => {
      // If a project name happens to match a case study slug, the case study should win
      const projectWithNameMatchingSlug = createMockProject({
        id: 4,
        name: 'react-query-optimizer',
      })

      const mergedWithNameCollision = mergeProjectsWithCaseStudies(
        [...merged.map((m) => m.project), projectWithNameMatchingSlug],
        [caseStudy1, caseStudy2],
      )

      const result = getProjectBySlug('react-query-optimizer', mergedWithNameCollision)

      // Should find the one with the actual case study
      expect(result?.caseStudy?.slug).toBe('react-query-optimizer')
      expect(result?.project.id).toBe(1)
    })

    it('should handle empty merged projects array', () => {
      const result = getProjectBySlug('anything', [])

      expect(result).toBeNull()
    })
  })
})
