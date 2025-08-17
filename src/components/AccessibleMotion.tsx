import type { ReactNode } from 'react'

import { motion, type MotionProps } from 'framer-motion'

import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Props for AccessibleMotion component
 */
interface AccessibleMotionProps extends MotionProps {
  children: ReactNode
  /** Fallback props to use when reduced motion is preferred */
  reducedMotionFallback?: Partial<MotionProps>
}

/**
 * Accessible motion wrapper that respects user's reduced motion preference
 *
 * This component automatically disables or reduces animations for users
 * who have set `prefers-reduced-motion: reduce` in their system settings.
 *
 * @example
 * ```tsx
 * <AccessibleMotion
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: 0.3 }}
 *   reducedMotionFallback={{
 *     initial: { opacity: 0 },
 *     animate: { opacity: 1 },
 *     transition: { duration: 0.1 }
 *   }}
 * >
 *   <div>Content with accessible animations</div>
 * </AccessibleMotion>
 * ```
 */
export const AccessibleMotion = ({
  children,
  reducedMotionFallback,
  ...motionProps
}: AccessibleMotionProps) => {
  const prefersReducedMotion = useReducedMotion()

  // If user prefers reduced motion, use fallback props or disable animations
  const accessibleProps = prefersReducedMotion
    ? {
        initial: reducedMotionFallback?.initial ?? undefined,
        animate: reducedMotionFallback?.animate ?? undefined,
        exit: reducedMotionFallback?.exit ?? undefined,
        transition: reducedMotionFallback?.transition ?? { duration: 0.1 },
        ...reducedMotionFallback,
      }
    : motionProps

  return <motion.div {...accessibleProps}>{children}</motion.div>
}
