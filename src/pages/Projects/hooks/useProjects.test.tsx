import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}))

import { useProjects } from './useProjects'

import { axiosInstance } from '@/lib/axios'
import type { GitHubProject } from '@/types'

const mockGet = vi.mocked(axiosInstance).get as ReturnType<typeof vi.fn>

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
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
  node_id: 'MDQ6VXNlcjE=',
  avatar_url: 'https://github.com/images/error/testuser_happy.gif',
  gravatar_id: '',
  url: 'https://api.github.com/users/testuser',
  html_url: 'https://github.com/testuser',
  followers_url: 'https://api.github.com/users/testuser/followers',
  following_url: 'https://api.github.com/users/testuser/following{/other_user}',
  gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
  organizations_url: 'https://api.github.com/users/testuser/orgs',
  repos_url: 'https://api.github.com/users/testuser/repos',
  events_url: 'https://api.github.com/users/testuser/events{/privacy}',
  received_events_url: 'https://api.github.com/users/testuser/received_events',
  type: 'User',
  user_view_type: 'public',
  site_admin: false,
}

const mockProject1: GitHubProject = {
  id: 1,
  node_id: 'MDEwOlJlcG9zaXRvcnkx',
  name: 'test-project',
  full_name: 'testuser/test-project',
  description: 'A test project',
  html_url: 'https://github.com/testuser/test-project',
  homepage: 'https://test-project.com',
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
  languages: {
    TypeScript: 8000,
    JavaScript: 2000,
  },
}

const mockProject2: GitHubProject = {
  id: 2,
  node_id: 'MDEwOlJlcG9zaXRvcnky',
  name: 'another-project',
  full_name: 'testuser/another-project',
  description: 'Another test project',
  html_url: 'https://github.com/testuser/another-project',
  homepage: null,
  language: 'JavaScript',
  languages_url: 'https://api.github.com/repos/testuser/another-project/languages',
  created_at: new Date('2023-02-01T00:00:00Z'),
  updated_at: new Date('2023-02-01T00:00:00Z'),
  pushed_at: new Date('2023-02-01T00:00:00Z'),
  stargazers_count: 5,
  watchers_count: 3,
  forks_count: 1,
  open_issues_count: 0,
  archived: false,
  disabled: false,
  private: false,
  fork: false,
  topics: ['javascript', 'node'],
  visibility: 'public',
  default_branch: 'main',
  forks: 1,
  open_issues: 0,
  watchers: 3,
  size: 600,
  owner: mockOwner,
  url: 'https://api.github.com/repos/testuser/another-project',
  forks_url: 'https://api.github.com/repos/testuser/another-project/forks',
  keys_url: 'https://api.github.com/repos/testuser/another-project/keys{/key_id}',
  collaborators_url:
    'https://api.github.com/repos/testuser/another-project/collaborators{/collaborator}',
  teams_url: 'https://api.github.com/repos/testuser/another-project/teams',
  hooks_url: 'https://api.github.com/repos/testuser/another-project/hooks',
  issue_events_url: 'https://api.github.com/repos/testuser/another-project/issues/events{/number}',
  events_url: 'https://api.github.com/repos/testuser/another-project/events',
  assignees_url: 'https://api.github.com/repos/testuser/another-project/assignees{/user}',
  branches_url: 'https://api.github.com/repos/testuser/another-project/branches{/branch}',
  tags_url: 'https://api.github.com/repos/testuser/another-project/tags',
  blobs_url: 'https://api.github.com/repos/testuser/another-project/git/blobs{/sha}',
  git_tags_url: 'https://api.github.com/repos/testuser/another-project/git/tags{/sha}',
  git_refs_url: 'https://api.github.com/repos/testuser/another-project/git/refs{/sha}',
  trees_url: 'https://api.github.com/repos/testuser/another-project/git/trees{/sha}',
  statuses_url: 'https://api.github.com/repos/testuser/another-project/statuses/{sha}',
  stargazers_url: 'https://api.github.com/repos/testuser/another-project/stargazers',
  contributors_url: 'https://api.github.com/repos/testuser/another-project/contributors',
  subscribers_url: 'https://api.github.com/repos/testuser/another-project/subscribers',
  subscription_url: 'https://api.github.com/repos/testuser/another-project/subscription',
  commits_url: 'https://api.github.com/repos/testuser/another-project/commits{/sha}',
  git_commits_url: 'https://api.github.com/repos/testuser/another-project/git/commits{/sha}',
  comments_url: 'https://api.github.com/repos/testuser/another-project/comments{/number}',
  issue_comment_url:
    'https://api.github.com/repos/testuser/another-project/issues/comments{/number}',
  contents_url: 'https://api.github.com/repos/testuser/another-project/contents/{+path}',
  compare_url: 'https://api.github.com/repos/testuser/another-project/compare/{base}...{head}',
  merges_url: 'https://api.github.com/repos/testuser/another-project/merges',
  archive_url: 'https://api.github.com/repos/testuser/another-project/{archive_format}{/ref}',
  downloads_url: 'https://api.github.com/repos/testuser/another-project/downloads',
  issues_url: 'https://api.github.com/repos/testuser/another-project/issues{/number}',
  pulls_url: 'https://api.github.com/repos/testuser/another-project/pulls{/number}',
  milestones_url: 'https://api.github.com/repos/testuser/another-project/milestones{/number}',
  notifications_url:
    'https://api.github.com/repos/testuser/another-project/notifications{?since,all,participating}',
  labels_url: 'https://api.github.com/repos/testuser/another-project/labels{/name}',
  releases_url: 'https://api.github.com/repos/testuser/another-project/releases{/id}',
  deployments_url: 'https://api.github.com/repos/testuser/another-project/deployments',
  git_url: 'git://github.com/testuser/another-project.git',
  ssh_url: 'git@github.com:testuser/another-project.git',
  clone_url: 'https://github.com/testuser/another-project.git',
  svn_url: 'https://github.com/testuser/another-project',
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
  languages: {
    JavaScript: 5000,
    CSS: 1000,
  },
}

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should fetch projects successfully', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token')
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockResolvedValueOnce({
      data: [mockProject1],
    } as AxiosResponse)

    mockGet.mockResolvedValueOnce({
      data: mockProject1.languages,
    } as AxiosResponse)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(1)
    const project = result.current.data?.[0]
    expect(project).toBeDefined()
    expect(project?.id).toBe(mockProject1.id)
    expect(project?.name).toBe(mockProject1.name)
    expect(project?.description).toBe(mockProject1.description)
    expect(project?.language).toBe(mockProject1.language)
    expect(project?.stargazers_count).toBe(mockProject1.stargazers_count)
    expect(project?.forks_count).toBe(mockProject1.forks_count)

    expect(result.current.error).toBeNull()

    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  it('should fetch multiple projects and calculate statistics correctly', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token')
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockResolvedValueOnce({
      data: [mockProject1, mockProject2],
    } as AxiosResponse)

    mockGet.mockResolvedValueOnce({
      data: mockProject1.languages,
    } as AxiosResponse)

    mockGet.mockResolvedValueOnce({
      data: mockProject2.languages,
    } as AxiosResponse)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0]?.languages).toBeDefined()
    expect(result.current.data?.[1]?.languages).toBeDefined()

    expect(mockGet).toHaveBeenCalledTimes(3)
  })

  it('should handle API errors', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token')
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeTruthy()
  })

  it('should use GitHub token from environment when available', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', 'valid-token')
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockResolvedValueOnce({ data: [] } as AxiosResponse)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(mockGet).toHaveBeenCalledWith('https://api.github.com/users/testuser/repos?per_page=100&sort=updated&direction=desc', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token valid-token',
      },
    })
  })

  it('should work without authentication when no token is available', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', undefined)
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockResolvedValueOnce({ data: [] } as AxiosResponse)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const callArgs = mockGet.mock.calls[0]
    expect(callArgs?.[1]).toBeDefined()
    const config = callArgs?.[1] as { headers: { Accept: string; Authorization?: string } }
    expect(config).toEqual({
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
  })

  it('should handle empty repository list', async () => {
    vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token')
    vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')

    mockGet.mockResolvedValueOnce({ data: [] } as AxiosResponse)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useProjects(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
