/**
 * Simplified Tests for TopicsDisplay component
 */

import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import TopicsDisplay from './TopicsDisplay'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'projects.topics.title': 'Popular Topics',
        'projects.topics.description': 'Explore the technologies and topics used in our projects',
      }
      return translations[key] ?? key
    },
  }),
}))

// Mock constants
vi.mock('../constants', () => ({
  PROJECTS_CONSTANTS: {
    MAX_TOPICS_DISPLAY: 6,
    ANIMATION_DELAYS: {
      TOPICS: 0.2,
    },
  },
  TRANSLATION_KEYS: {
    TOPICS: {
      TITLE: 'projects.topics.title',
      DESCRIPTION: 'projects.topics.description',
    },
  },
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock animations
vi.mock('@/lib/animations', () => ({
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  smoothTransition: { duration: 0.3 },
}))

describe('TopicsDisplay - Simplified Tests', () => {
  it('should render null when no topics provided', () => {
    const { container } = render(<TopicsDisplay topics={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render title and description', () => {
    const topics = ['react']

    render(<TopicsDisplay topics={topics} />)

    expect(screen.getByText('Popular Topics')).toBeInTheDocument()
    expect(
      screen.getByText('Explore the technologies and topics used in our projects'),
    ).toBeInTheDocument()
  })

  it('should render topics with hash prefix', () => {
    const topics = ['react', 'typescript']

    render(<TopicsDisplay topics={topics} />)

    // Check that each topic appears in the document using textContent
    topics.forEach((topic) => {
      const elements = screen.getAllByText((_content, element) => {
        return element?.textContent === `#${topic}`
      })
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('should respect maxTopics limit', () => {
    const topics = ['react', 'typescript', 'javascript', 'vue']

    render(<TopicsDisplay topics={topics} maxTopics={2} />)

    // Should render first 2 topics
    expect(
      screen.getByText((_content, element) => element?.textContent === '#react'),
    ).toBeInTheDocument()

    expect(
      screen.getByText((_content, element) => element?.textContent === '#typescript'),
    ).toBeInTheDocument()

    // Should not render the remaining topics
    expect(
      screen.queryByText((_content, element) => element?.textContent === '#javascript'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText((_content, element) => element?.textContent === '#vue'),
    ).not.toBeInTheDocument()
  })

  it('should handle zero maxTopics', () => {
    const topics = ['react', 'typescript']

    render(<TopicsDisplay topics={topics} maxTopics={0} />)

    // Should still render title
    expect(screen.getByText('Popular Topics')).toBeInTheDocument()

    // Should not render any topics
    topics.forEach((topic) => {
      expect(
        screen.queryByText((_content, element) => element?.textContent === `#${topic}`),
      ).not.toBeInTheDocument()
    })
  })

  it('should handle topics with special characters', () => {
    const topics = ['react.js', 'node@14']

    render(<TopicsDisplay topics={topics} />)

    topics.forEach((topic) => {
      expect(
        screen.getByText((_content, element) => element?.textContent === `#${topic}`),
      ).toBeInTheDocument()
    })
  })

  it('should handle duplicate topics', () => {
    const topics = ['react', 'react', 'typescript']

    render(<TopicsDisplay topics={topics} />)

    // Should render all, including duplicates
    const reactElements = screen.getAllByText((_content, element) => {
      return element?.textContent === '#react'
    })
    expect(reactElements).toHaveLength(2)

    const typescriptElements = screen.getAllByText((_content, element) => {
      return element?.textContent === '#typescript'
    })
    expect(typescriptElements).toHaveLength(1)
  })

  it('should not throw with custom delay prop', () => {
    const topics = ['react']

    expect(() => {
      render(<TopicsDisplay topics={topics} delay={0.5} />)
    }).not.toThrow()

    // Just verify the topic is rendered, don't worry about exact count
    const elements = screen.getAllByText((_content, element) => element?.textContent === '#react')
    expect(elements.length).toBeGreaterThan(0)
  })
})
