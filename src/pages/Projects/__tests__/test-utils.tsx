import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, vi } from 'vitest'

import type { ProjectStatistics } from '../hooks'

import type { GitHubProject } from '@/types'

/**
 * Mock data base para GitHubProject
 * Contiene todos los campos requeridos con datos realistas
 */
export const mockGitHubProjectBase: GitHubProject = {
  id: 123456789,
  node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NTY3ODk=',
  name: 'test-project',
  full_name: 'testuser/test-project',
  private: false,
  owner: {
    login: 'testuser',
    id: 987654321,
    node_id: 'MDQ6VXNlcjk4NzY1NDMyMQ==',
    avatar_url: 'https://avatars.githubusercontent.com/u/987654321?v=4',
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
    site_admin: false,
    user_view_type: 'public',
  },
  html_url: 'https://github.com/testuser/test-project',
  description: null,
  fork: false,
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
  languages_url: 'https://api.github.com/repos/testuser/test-project/languages',
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
  created_at: new Date('2023-01-01T00:00:00Z'),
  updated_at: new Date('2023-06-15T12:30:00Z'),
  pushed_at: new Date('2023-06-15T10:00:00Z'),
  git_url: 'git://github.com/testuser/test-project.git',
  ssh_url: 'git@github.com:testuser/test-project.git',
  clone_url: 'https://github.com/testuser/test-project.git',
  svn_url: 'https://github.com/testuser/test-project',
  homepage: 'https://test-project.com',
  size: 1234,
  stargazers_count: 42,
  watchers_count: 42,
  language: 'TypeScript',
  has_issues: true,
  has_projects: true,
  has_wiki: true,
  has_pages: false,
  has_downloads: true,
  has_discussions: false,
  forks_count: 8,
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: 3,
  license: null,
  allow_forking: true,
  is_template: false,
  web_commit_signoff_required: false,
  topics: ['react', 'typescript', 'testing'],
  visibility: 'public',
  forks: 8,
  open_issues: 3,
  watchers: 42,
  default_branch: 'main',
  languages: {
    TypeScript: 15000,
    JavaScript: 5000,
    CSS: 2000,
  },
}

/**
 * Factory function para crear mock projects con overrides específicos
 */
export const createMockProject = (overrides: Partial<GitHubProject> = {}): GitHubProject => ({
  ...mockGitHubProjectBase,
  ...overrides,
})

/**
 * Proyectos mock predefinidos para casos comunes de testing
 */
export const mockProjects = {
  typescript: createMockProject({
    id: 111111111,
    name: 'typescript-project',
    full_name: 'testuser/typescript-project',
    language: 'TypeScript',
    stargazers_count: 25,
    forks_count: 5,
    homepage: 'https://typescript-project.demo.com',
    topics: ['typescript', 'react', 'vite'],
    languages: {
      TypeScript: 18000,
      JavaScript: 2000,
    },
  }),

  javascript: createMockProject({
    id: 222222222,
    name: 'javascript-project',
    full_name: 'testuser/javascript-project',
    language: 'JavaScript',
    stargazers_count: 15,
    forks_count: 3,
    homepage: null,
    topics: ['javascript', 'node', 'api'],
    languages: {
      JavaScript: 12000,
      CSS: 3000,
    },
  }),

  python: createMockProject({
    id: 333333333,
    name: 'python-ml-project',
    full_name: 'testuser/python-ml-project',
    language: 'Python',
    stargazers_count: 150,
    forks_count: 30,
    homepage: 'https://ml-project.example.com',
    topics: ['python', 'machine-learning', 'ai', 'data-science'],
    languages: {
      Python: 25000,
      'Jupyter Notebook': 5000,
    },
  }),

  noLanguage: createMockProject({
    id: 444444444,
    name: 'config-project',
    full_name: 'testuser/config-project',
    language: undefined,
    stargazers_count: 5,
    forks_count: 1,
    homepage: null,
    topics: ['config', 'dotfiles'],
    languages: {
      Shell: 1000,
      Vim: 500,
    },
  }),

  filtered: createMockProject({
    id: 334629076,
    name: 'filtered-project',
    full_name: 'testuser/filtered-project',
    language: 'JavaScript',
    stargazers_count: 10,
    forks_count: 2,
  }),
}

export const mockStatistics: ProjectStatistics = {
  totalProjects: 10,
  totalStars: 250,
  totalForks: 45,
  projectsWithDemos: 6,
  uniqueTechnologies: 8,
  technologiesList: ['CSS', 'JavaScript', 'Python', 'TypeScript'],
  uniqueTopics: 12,
  allTopics: ['api', 'css', 'javascript', 'python', 'react', 'typescript'],
}

export const createMockStatistics = (
  overrides: Partial<ProjectStatistics> = {},
): ProjectStatistics => ({
  ...mockStatistics,
  ...overrides,
})

export const createMockAxios = () => {
  const mockGet = vi.fn()

  vi.mock('@/lib/axios', () => ({
    axiosInstance: {
      get: mockGet,
    },
  }))

  return { mockGet }
}

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

/**
 * Wrapper provider para React Query en tests
 */
export const createQueryClientWrapper = () => {
  const queryClient = createTestQueryClient()

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export const createI18nMock = (customTranslations: Record<string, string> = {}) => {
  const defaultTranslations: Record<string, string> = {
    // ProjectStatistics translations
    'projects.statistics.featuredProjects': 'Featured Projects',
    'projects.statistics.githubStars': 'GitHub Stars',
    'projects.statistics.technologies': 'Technologies',
    'projects.statistics.totalForks': 'Total Forks',
    'projects.statistics.liveDemos': 'Live Demos',

    // ProjectCard translations
    'projects.card.viewProject': 'View Project',
    'projects.card.viewDemo': 'View Demo',
    'projects.card.stars': 'stars',
    'projects.card.forks': 'forks',
    'projects.card.updated': 'Updated',
    'projects.card.noDescription': 'No description available',

    // Common translations
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.noData': 'No data available',
  }

  const allTranslations = { ...defaultTranslations, ...customTranslations }

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => allTranslations[key] ?? key,
    }),
  }))
}

export const createFramerMotionMock = () => {
  vi.mock('framer-motion', () => ({
    motion: {
      div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        return <div {...props}>{children}</div>
      },
      h3: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        return <h3 {...props}>{children}</h3>
      },
      p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        return <p {...props}>{children}</p>
      },
      a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        return <a {...props}>{children}</a>
      },
      span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        return <span {...props}>{children}</span>
      },
    },
  }))
}

export const setupGitHubTestEnv = () => {
  vi.stubEnv('VITE_GITHUB_USERNAME', 'testuser')
  vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token')
}

export const cleanupGitHubTestEnv = () => {
  vi.unstubAllEnvs()
}

export const authScenarios = {
  validToken: {
    username: 'testuser',
    token: 'test-token',
  },
  placeholderToken: {
    username: 'testuser',
    token: 'your_github_token_here',
  },
  noToken: {
    username: 'testuser',
    token: '',
  },
}

export const expectAuthHeaders = (mockCall: unknown[], hasAuth = true) => {
  const [, config] = mockCall

  if (hasAuth) {
    expect(config).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.objectContaining({
          Authorization: 'token test-token',
          Accept: 'application/vnd.github.v3+json',
        }),
      }),
    )
  } else {
    expect(config).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.not.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          Authorization: expect.any(String),
        }),
      }),
    )
  }
}
