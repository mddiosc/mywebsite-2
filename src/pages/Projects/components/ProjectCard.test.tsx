/**
 * Tests for ProjectCard component
 *
 * Critical testing for:
 * - Project data rendering
 * - Language color mapping
 * - Date formatting
 * - Links and navigation
 * - Animation properties
 */

import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import ProjectCard from './ProjectCard'

import type { GitHubProject } from '@/types'

// Mock Framer Motion to avoid animation testing complexity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    h3: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <h3 {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...props}>{children}</p>
    ),
    a: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <a {...props}>{children}</a>
    ),
  },
}))

// Mock project data for testing
const createMockProject = (overrides: Partial<GitHubProject> = {}): GitHubProject => ({
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
  ...overrides,
})

describe('ProjectCard', () => {
  describe('basic rendering', () => {
    it('should render project name and basic information', () => {
      const project = createMockProject({
        name: 'awesome-project',
        stargazers_count: 25,
        forks_count: 10,
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('awesome-project')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should render without description when description is null', () => {
      const project = createMockProject({
        name: 'no-description-project',
        description: null,
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('no-description-project')).toBeInTheDocument()
      // Should not crash when description is null
    })

    it('should format date correctly in Spanish locale', () => {
      const project = createMockProject({
        updated_at: new Date('2023-12-25T10:30:00Z'),
      })

      render(<ProjectCard project={project} delay={0} />)

      // Should format date in Spanish locale as per the component
      expect(screen.getByText(/diciembre/)).toBeInTheDocument()
      expect(screen.getByText(/2023/)).toBeInTheDocument()
    })
  })

  describe('language display', () => {
    it('should display primary language when no multiple languages available', () => {
      const project = createMockProject({
        language: 'JavaScript',
        languages: {}, // Empty languages object means only primary language
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })

    it('should display multiple languages when available', () => {
      const project = createMockProject({
        language: 'TypeScript',
        languages: {
          TypeScript: 8000,
          JavaScript: 3000,
          CSS: 1000,
        },
      })

      render(<ProjectCard project={project} delay={0} />)

      // Languages should be displayed with percentages
      expect(screen.getByText(/TypeScript.*66\.7%/)).toBeInTheDocument()
      expect(screen.getByText(/JavaScript.*25\.0%/)).toBeInTheDocument()
      expect(screen.getByText(/CSS.*8\.3%/)).toBeInTheDocument()
    })
  })

  describe('links and navigation', () => {
    it('should render GitHub link correctly', () => {
      const project = createMockProject({
        html_url: 'https://github.com/testuser/awesome-project',
        name: 'awesome-project',
      })

      render(<ProjectCard project={project} delay={0} />)

      const githubLink = screen.getByRole('link', { name: 'awesome-project' })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser/awesome-project')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should render homepage link when available', () => {
      const project = createMockProject({
        homepage: 'https://awesome-project.demo.com',
      })

      render(<ProjectCard project={project} delay={0} />)

      const demoLink = screen.getByRole('link', { name: /demo/i })
      expect(demoLink).toHaveAttribute('href', 'https://awesome-project.demo.com')
      expect(demoLink).toHaveAttribute('target', '_blank')
      expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should not render demo link when homepage is null', () => {
      const project = createMockProject({
        homepage: null,
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.queryByRole('link', { name: /demo/i })).not.toBeInTheDocument()
    })
  })

  describe('statistics display', () => {
    it('should display stars and forks counts', () => {
      const project = createMockProject({
        stargazers_count: 150,
        forks_count: 32,
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('32')).toBeInTheDocument()
    })

    it('should handle zero values correctly', () => {
      const project = createMockProject({
        stargazers_count: 0,
        forks_count: 0,
      })

      render(<ProjectCard project={project} delay={0} />)

      const zeroValues = screen.getAllByText('0')
      expect(zeroValues).toHaveLength(2) // One for stars, one for forks
    })
  })

  describe('topics display', () => {
    it('should render project topics', () => {
      const project = createMockProject({
        topics: ['react', 'typescript', 'ui-library'],
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
      expect(screen.getByText('ui-library')).toBeInTheDocument()
    })

    it('should handle projects without topics', () => {
      const project = createMockProject({
        topics: [],
      })

      render(<ProjectCard project={project} delay={0} />)

      // Should not crash with empty topics array
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle very long project names', () => {
      const project = createMockProject({
        name: 'this-is-a-very-long-project-name-that-might-cause-layout-issues',
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(
        screen.getByText('this-is-a-very-long-project-name-that-might-cause-layout-issues'),
      ).toBeInTheDocument()
    })

    it('should handle high star and fork counts', () => {
      const project = createMockProject({
        stargazers_count: 10000,
        forks_count: 2500,
      })

      render(<ProjectCard project={project} delay={0} />)

      expect(screen.getByText('10000')).toBeInTheDocument()
      expect(screen.getByText('2500')).toBeInTheDocument()
    })
  })
})
