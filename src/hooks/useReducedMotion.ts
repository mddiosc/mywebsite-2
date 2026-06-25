import { useEffect, useState } from 'react'

/**
 * Hook to detect user's preference for reduced motion
 *
 * Respects the `prefers-reduced-motion` media query to provide
 * accessible animations for users with vestibular disorders
 * or motion sensitivity.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const prefersReducedMotion = useReducedMotion()
 *
 *   return (
 *     <motion.div
 *       animate={prefersReducedMotion ? {} : { x: 100 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
