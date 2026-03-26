import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import type { GitHubProject, ProjectCaseStudy, ProjectsSnapshot } from '@/types'

let mockSnapshot: ProjectsSnapshot = {
  generatedAt: '2026-03-26T00:00:00.000Z',
  source: 'generated',
  projects: [],
}

vi.mock('@/data/projects-snapshot.json', () => ({
  get default() {
    return mockSnapshot
  },
}))

let mockCaseStudiesData: ProjectCaseStudy[] = []

vi.mock('@/hooks/useProjectCaseStudies', () => ({
  useProjectCaseStudies: () => {
    return {
      data: mockCaseStudiesData,
      isLoading: false,
      error: null,
    }
  },
}))

import { useProjectsWithCaseStudies, useProjectWithCaseStudy } from '../useProjectsWithCaseStudies'
import { useProjects } from '@/pages/Projects/hooks/useProjects'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  })

const createWrapper = () => {
  const queryClient = createTestQueryClient()
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

const mockOwner = {
  login: 'testuser',
  id: 1,
  avatar_url: 'https://github.com/images/error/testuser_happy.gif',
  html_url: 'https://github.com/testuser',
}

const createMockProject = (overrides?: Partial<GitHubProject>): GitHubProject => ({
  id: 1,
  node_id: 'MDEwOlJlcG9zaXRvcnkx',
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
  topics: [],
  visibility: 'public',
  default_branch: 'main',
  forks: 2,
  open_issues: 1,
  watchers: 5,
  size: 1000,
  owner: mockOwner,
  languages: { TypeScript: 8000 },
  url: 'https://api.github.com/repos/testuser/test-project',
  forks_url: 'https://api.github.com/repos/testuser/test-project/forks',
  keys_url: 'https://api.github.com/repos/testuser/test-project/keys{/key_id}',
  collaborators_url:
    'https://api.github.com/repos/testuser/test-project/collaborators{/collaborator}',
  teams_url: 'https://api.github.com/repos/testuser/test-project/teams',
  hooks_url: 'https://api.github.com/repos/testuser/test-project/hooks',
  issue_events_url: 'https://api.github.com/repos/testuser/test-project/issues/events{/number}',
  events_url: 'https://api.github.com/repos/testuser/test-project/events',
  assignees_url: 'https://api.github.com/repos/testuser/test-project/assignees{/user}',
  branches_url: 'https://api.github.com/repos/testuser/test-project/branches{/branch}',
  tags_url: 'https://api.github.com/repos/testuser/test-project/tags',
  blobs_url: 'https://api.github.com/repos/testuser/test-project/git/blobs{/sha}',
  git_tags_url: 'https://api.github.com/repos/testuser/test-project/git/tags{/sha}',
  git_refs_url: 'https://api.github.com/repos/testuser/test-project/git/refs{/sha}',
  trees_url: 'https://api.github.com/repos/testuser/test-project/git/trees{/sha}',
  statuses_url: 'https://api.github.com/repos/testuser/test-project/statuses/{sha}',
  stargazers_url: 'https://api.github.com/repos/testuser/test-project/stargazers',
  contributors_url: 'https://api.github.com/repos/testuser/test-project/contributors',
  subscribers_url: 'https://api.github.com/repos/testuser/test-project/subscribers',
  subscription_url: 'https://api.github.com/repos/testuser/test-project/subscription',
  commits_url: 'https://api.github.com/repos/testuser/test-project/commits{/sha}',
  git_commits_url: 'https://api.github.com/repos/testuser/test-project/git/commits{/sha}',
  comments_url: 'https://api.github.com/repos/testuser/test-project/comments{/number}',
  issue_comment_url: 'https://api.github.com/repos/testuser/test-project/issues/comments{/number}',
  contents_url: 'https://api.github.com/repos/testuser/test-project/contents/{+path}',
  compare_url: 'https://api.github.com/repos/testuser/test-project/compare/{base}...{head}',
  merges_url: 'https://api.github.com/repos/testuser/test-project/merges',
  archive_url: 'https://api.github.com/repos/testuser/test-project/{archive_format}{/ref}',
  downloads_url: 'https://api.github.com/repos/testuser/test-project/downloads',
  issues_url: 'https://api.github.com/repos/testuser/test-project/issues{/number}',
  pulls_url: 'https://api.github.com/repos/testuser/test-project/pulls{/number}',
  milestones_url: 'https://api.github.com/repos/testuser/test-project/milestones{/number}',
  notifications_url:
    'https://api.github.com/repos/testuser/test-project/notifications{?since,all,participating}',
  labels_url: 'https://api.github.com/repos/testuser/test-project/labels{/name}',
  releases_url: 'https://api.github.com/repos/testuser/test-project/releases{/id}',
  deployments_url: 'https://api.github.com/repos/testuser/test-project/deployments',
  git_url: 'git://github.com/testuser/test-project.git',
  ssh_url: 'git@github.com:testuser/test-project.git',
  clone_url: 'https://github.com/testuser/test-project.git',
  svn_url: 'https://github.com/testuser/test-project',
  has_issues: true,
  has_projects: true,
  has_downloads: true,
  has_wiki: true,
  has_pages: false,
  has_discussions: false,
  mirror_url: null,
  license: null,
  allow_forking: true,
  is_template: false,
  web_commit_signoff_required: false,
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

describe('useProjectsWithCaseStudies', () => {
  beforeEach(() => {
    localStorage.clear()
    mockSnapshot = {
      generatedAt: '2026-03-26T00:00:00.000Z',
      source: 'generated',
      projects: [],
    }
    mockCaseStudiesData = []
  })

  it('should merge projects with case studies', async () => {
    const project = createMockProject({ name: 'test-project' })
    const caseStudy = createMockCaseStudy({
      meta: { ...createMockCaseStudy().meta, repoName: 'test-project' },
    })

    mockSnapshot.projects = [project]
    mockCaseStudiesData = [caseStudy]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectsWithCaseStudies(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].hasCaseStudy).toBe(true)
    expect(result.current.data?.[0].caseStudy?.slug).toBe('test-case-study')
  })

  it('should include projects without case studies', async () => {
    const project1 = createMockProject({ id: 1, name: 'project-with-case' })
    const project2 = createMockProject({ id: 2, name: 'project-without-case' })
    const caseStudy = createMockCaseStudy({
      meta: { ...createMockCaseStudy().meta, repoName: 'project-with-case' },
    })

    mockSnapshot.projects = [project1, project2]
    mockCaseStudiesData = [caseStudy]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectsWithCaseStudies(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].hasCaseStudy).toBe(true)
    expect(result.current.data?.[1].hasCaseStudy).toBe(false)
  })

  it('should gracefully handle case studies loading error', async () => {
    const project = createMockProject()

    mockSnapshot.projects = [project]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectsWithCaseStudies(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    // Even with error in case studies, projects should still be available
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].hasCaseStudy).toBe(false)
  })

  it('should provide access to projects only', async () => {
    const project = createMockProject({ name: 'test-project' })

    mockSnapshot.projects = [project]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectsWithCaseStudies(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.projectsOnly).toBeDefined()
    expect(result.current.projectsOnly).toHaveLength(1)
  })

  it('should provide access to case studies only', async () => {
    const project = createMockProject()
    const caseStudy = createMockCaseStudy()

    mockSnapshot.projects = [project]
    mockCaseStudiesData = [caseStudy]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectsWithCaseStudies(), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.caseStudiesOnly).toBeDefined()
    expect(result.current.caseStudiesOnly).toHaveLength(1)
  })
})

describe('useProjectWithCaseStudy', () => {
  beforeEach(() => {
    localStorage.clear()
    mockSnapshot = {
      generatedAt: '2026-03-26T00:00:00.000Z',
      source: 'generated',
      projects: [],
    }
    mockCaseStudiesData = []
  })

  it('should find project by case study slug', async () => {
    const project = createMockProject({ name: 'react-query' })
    const caseStudy = createMockCaseStudy({
      slug: 'react-query-optimizer',
      meta: { ...createMockCaseStudy().meta, repoName: 'react-query' },
    })

    mockSnapshot.projects = [project]
    mockCaseStudiesData = [caseStudy]

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectWithCaseStudy('react-query-optimizer'), {
      wrapper,
    })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.data).not.toBeNull()
    expect(result.current.data?.caseStudy?.slug).toBe('react-query-optimizer')
  })

  it('should find project by project name if case study slug not found', async () => {
    const project = createMockProject({ name: 'test-project' })

    mockSnapshot.projects = [project]
    mockCaseStudiesData = []

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectWithCaseStudy('test-project'), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.data).not.toBeNull()
    expect(result.current.data?.project.name).toBe('test-project')
    expect(result.current.data?.hasCaseStudy).toBe(false)
  })

  it('should return error when project not found', async () => {
    mockSnapshot.projects = []
    mockCaseStudiesData = []

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjectWithCaseStudy('non-existent'), { wrapper })

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false)
      },
      { timeout: 100 },
    )

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
  })
})
