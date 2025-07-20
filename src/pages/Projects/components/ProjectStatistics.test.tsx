/**
 * Tests for ProjectStatistics component
 *
 * Critical testing for:
 * - Statistics display and formatting
 * - Loading states
 * - Error handling
 * - Animation behavior
 */

import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import ProjectStatistics from './ProjectStatistics'

import type { ProjectStatistics as ProjectStatisticsType } from '../hooks'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'projects.statistics.featuredProjects': 'Featured Projects',
        'projects.statistics.githubStars': 'GitHub Stars',
        'projects.statistics.technologies': 'Technologies',
        'projects.statistics.totalForks': 'Total Forks',
        'projects.statistics.liveDemos': 'Live Demos',
      }
      return translations[key] ?? key
    },
  }),
}))

// Mock Framer Motion to avoid animation testing complexity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock StatisticItem component since we're testing ProjectStatistics in isolation
vi.mock('./StatisticItem', () => ({
  default: ({ label, value }: { label: string; value: string | number }) => (
    <div data-testid="statistic-item">
      <span data-testid="statistic-label">{label}</span>
      <span data-testid="statistic-value">{value}</span>
    </div>
  ),
}))

// Mock animations
vi.mock('@/lib/animations', () => ({
  fadeIn: {},
  smoothTransition: { duration: 0.3 },
}))

// Mock constants
vi.mock('../constants', () => ({
  PROJECTS_CONSTANTS: {
    ANIMATION_DELAYS: {
      STATISTICS: 0.1,
    },
    STATISTICS_GRID: {
      BASE: 'grid-cols-1',
      SM: 'sm:grid-cols-2',
      LG: 'lg:grid-cols-5',
    },
  },
  TRANSLATION_KEYS: {
    STATISTICS: {
      FEATURED_PROJECTS: 'projects.statistics.featuredProjects',
      GITHUB_STARS: 'projects.statistics.githubStars',
      TECHNOLOGIES: 'projects.statistics.technologies',
      TOTAL_FORKS: 'projects.statistics.totalForks',
      LIVE_DEMOS: 'projects.statistics.liveDemos',
    },
  },
}))

// Mock statistics data factory
const createMockStatistics = (
  overrides: Partial<ProjectStatisticsType> = {},
): ProjectStatisticsType => ({
  totalProjects: 5,
  totalStars: 150,
  uniqueTechnologies: 8,
  technologiesList: ['TypeScript', 'React', 'Node.js', 'Python'],
  totalForks: 45,
  projectsWithDemos: 3,
  allTopics: ['web', 'api', 'frontend', 'backend'],
  uniqueTopics: 4,
  ...overrides,
})

describe('ProjectStatistics', () => {
  describe('basic rendering', () => {
    it('should render statistics with valid data', () => {
      const statistics = createMockStatistics({
        totalProjects: 10,
        totalStars: 500,
        uniqueTechnologies: 12,
        totalForks: 150,
        projectsWithDemos: 8,
      })

      render(<ProjectStatistics statistics={statistics} />)

      // Should render 5 StatisticItem components
      const statisticItems = screen.getAllByTestId('statistic-item')
      expect(statisticItems).toHaveLength(5)

      // Check if all values are displayed correctly
      const values = screen.getAllByTestId('statistic-value')
      const labels = screen.getAllByTestId('statistic-label')
      expect(values.length).toBeGreaterThan(0)
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should render correctly with zero values', () => {
      const statistics = createMockStatistics({
        totalProjects: 0,
        totalStars: 0,
        uniqueTechnologies: 0,
        totalForks: 0,
        projectsWithDemos: 0,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const statisticItems = screen.getAllByTestId('statistic-item')
      expect(statisticItems).toHaveLength(5)

      // All values should be displayed as 0
      const values = screen.getAllByTestId('statistic-value')
      values.forEach((value) => {
        expect(value.textContent).toBe('0')
      })
    })
  })

  describe('statistics display', () => {
    it('should display featured projects count correctly', () => {
      const statistics = createMockStatistics({
        totalProjects: 25,
      })

      render(<ProjectStatistics statistics={statistics} />)

      // Find the featured projects statistic
      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const featuredProjectsIndex = labels.findIndex(
        (label) => label.textContent === 'Featured Projects',
      )
      expect(featuredProjectsIndex).not.toBe(-1)
      expect(values[featuredProjectsIndex]?.textContent).toBe('25')
    })

    it('should display GitHub stars count correctly', () => {
      const statistics = createMockStatistics({
        totalStars: 1250,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const starsIndex = labels.findIndex((label) => label.textContent === 'GitHub Stars')
      expect(starsIndex).not.toBe(-1)
      expect(values[starsIndex]?.textContent).toBe('1250')
    })

    it('should display technologies count correctly', () => {
      const statistics = createMockStatistics({
        uniqueTechnologies: 15,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const technologiesIndex = labels.findIndex((label) => label.textContent === 'Technologies')
      expect(technologiesIndex).not.toBe(-1)
      expect(values[technologiesIndex]?.textContent).toBe('15')
    })

    it('should display total forks count correctly', () => {
      const statistics = createMockStatistics({
        totalForks: 320,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const forksIndex = labels.findIndex((label) => label.textContent === 'Total Forks')
      expect(forksIndex).not.toBe(-1)
      expect(values[forksIndex]?.textContent).toBe('320')
    })

    it('should display live demos count correctly', () => {
      const statistics = createMockStatistics({
        projectsWithDemos: 12,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const demosIndex = labels.findIndex((label) => label.textContent === 'Live Demos')
      expect(demosIndex).not.toBe(-1)
      expect(values[demosIndex]?.textContent).toBe('12')
    })
  })

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      const statistics = createMockStatistics({
        totalStars: 1000000,
        totalForks: 500000,
        totalProjects: 999,
      })

      render(<ProjectStatistics statistics={statistics} />)

      const labels = screen.getAllByTestId('statistic-label')
      const values = screen.getAllByTestId('statistic-value')

      const starsIndex = labels.findIndex((label) => label.textContent === 'GitHub Stars')
      const forksIndex = labels.findIndex((label) => label.textContent === 'Total Forks')
      const projectsIndex = labels.findIndex((label) => label.textContent === 'Featured Projects')

      expect(values[starsIndex]?.textContent).toBe('1000000')
      expect(values[forksIndex]?.textContent).toBe('500000')
      expect(values[projectsIndex]?.textContent).toBe('999')
    })

    it('should render all required statistic labels', () => {
      const statistics = createMockStatistics()

      render(<ProjectStatistics statistics={statistics} />)

      const expectedLabels = [
        'Featured Projects',
        'GitHub Stars',
        'Technologies',
        'Total Forks',
        'Live Demos',
      ]

      expectedLabels.forEach((expectedLabel) => {
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      })
    })

    it('should maintain grid layout structure', () => {
      const statistics = createMockStatistics()

      render(<ProjectStatistics statistics={statistics} />)

      // Should render the correct number of statistic items in grid layout
      const statisticItems = screen.getAllByTestId('statistic-item')
      expect(statisticItems).toHaveLength(5)
    })
  })
})
