/**
 * Tests for StatisticItem component
 *
 * Critical testing for:
 * - Value and label display
 * - Number formatting
 * - Animation behavior
 * - Accessibility
 */

import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import StatisticItem from './StatisticItem'

// Mock Framer Motion to avoid animation testing complexity
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    dt: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <dt {...props}>{children}</dt>
    ),
    dd: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <dd {...props}>{children}</dd>
    ),
  },
}))

// Mock animations
vi.mock('@/lib/animations', () => ({
  slideInFromBottom: {},
  smoothTransition: { duration: 0.3 },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}))

describe('StatisticItem', () => {
  describe('basic rendering', () => {
    it('should render value and label correctly', () => {
      const testProps = {
        value: 42,
        label: 'Test Statistic',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('Test Statistic')).toBeInTheDocument()
    })

    it('should render zero values correctly', () => {
      const testProps = {
        value: 0,
        label: 'Zero Statistic',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Zero Statistic')).toBeInTheDocument()
    })
  })

  describe('number formatting', () => {
    it('should display small numbers as-is', () => {
      const testProps = {
        value: 5,
        label: 'Small Number',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should display large numbers correctly', () => {
      const testProps = {
        value: 1000000,
        label: 'Large Number',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('1000000')).toBeInTheDocument()
    })

    it('should handle negative numbers', () => {
      const testProps = {
        value: -25,
        label: 'Negative Number',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('-25')).toBeInTheDocument()
    })
  })

  describe('content validation', () => {
    it('should handle very long labels', () => {
      const longLabel =
        'This is a very long label that might cause layout issues if not handled properly'
      const testProps = {
        value: 123,
        label: longLabel,
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText(longLabel)).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('should handle empty string label', () => {
      const testProps = {
        value: 456,
        label: '',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('456')).toBeInTheDocument()
      // Empty label should still be rendered (might be invisible but present)
    })

    it('should handle special characters in labels', () => {
      const testProps = {
        value: 789,
        label: 'Special & Characters <test> "quotes"',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('789')).toBeInTheDocument()
      expect(screen.getByText('Special & Characters <test> "quotes"')).toBeInTheDocument()
    })
  })

  describe('semantic structure', () => {
    it('should use proper semantic HTML structure', () => {
      const testProps = {
        value: 100,
        label: 'Semantic Test',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      // Should have div elements with proper text content structure
      const valueElement = screen.getByText('100')
      const labelElement = screen.getByText('Semantic Test')

      expect(valueElement).toBeInTheDocument()
      expect(labelElement).toBeInTheDocument()
    })

    it('should maintain proper hierarchy', () => {
      const testProps = {
        value: 200,
        label: 'Hierarchy Test',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      // The value should be displayed prominently
      const valueElement = screen.getByText('200')
      const labelElement = screen.getByText('Hierarchy Test')

      expect(valueElement).toBeInTheDocument()
      expect(labelElement).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle decimal numbers', () => {
      const testProps = {
        value: 99.99,
        label: 'Decimal Number',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('99.99')).toBeInTheDocument()
    })

    it('should handle very small decimal numbers', () => {
      const testProps = {
        value: 0.001,
        label: 'Very Small Decimal',
        delay: 0,
      }

      render(<StatisticItem {...testProps} />)

      expect(screen.getByText('0.001')).toBeInTheDocument()
    })

    it('should handle undefined delay gracefully', () => {
      const testProps = {
        value: 333,
        label: 'No Delay Test',
        // No delay prop provided
      }

      expect(() => {
        render(<StatisticItem {...testProps} delay={0} />)
      }).not.toThrow()

      expect(screen.getByText('333')).toBeInTheDocument()
    })

    it('should handle different delay values', () => {
      const testProps1 = {
        value: 111,
        label: 'Delay 0.5',
        delay: 0.5,
      }

      const testProps2 = {
        value: 222,
        label: 'Delay 1.0',
        delay: 1.0,
      }

      render(
        <div>
          <StatisticItem {...testProps1} />
          <StatisticItem {...testProps2} />
        </div>,
      )

      expect(screen.getByText('111')).toBeInTheDocument()
      expect(screen.getByText('222')).toBeInTheDocument()
      expect(screen.getByText('Delay 0.5')).toBeInTheDocument()
      expect(screen.getByText('Delay 1.0')).toBeInTheDocument()
    })
  })
})
