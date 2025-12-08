/**
 * Navigation Progress Hook
 *
 * Hook to access the navigation progress context.
 * Must be used within a NavigationProgressProvider.
 */

import { use, createContext } from 'react'
import type { NavigateOptions, To } from 'react-router'

/**
 * Context value type for navigation progress
 */
export interface NavigationProgressContextValue {
  /** Whether a navigation transition is in progress */
  isNavigating: boolean
  /** Navigate with transition (keeps current page visible while loading) */
  navigateWithTransition: (to: To, options?: NavigateOptions) => void
}

/**
 * Context for navigation progress state
 * Exported for use by the provider component
 */
export const NavigationProgressContext = createContext<NavigationProgressContextValue | null>(null)

/**
 * Hook to access navigation progress state
 *
 * @returns Navigation progress context value
 * @throws Error if used outside of NavigationProgressProvider
 *
 * @example
 * ```tsx
 * const { isNavigating, navigateWithTransition } = useNavigationProgress()
 *
 * // Show loading indicator
 * if (isNavigating) {
 *   return <LoadingBar />
 * }
 *
 * // Navigate with transition
 * <button onClick={() => navigateWithTransition('/about')}>
 *   Go to About
 * </button>
 * ```
 */
export function useNavigationProgress(): NavigationProgressContextValue {
  // React 19: Use 'use' instead of 'useContext' for more flexibility
  const context = use(NavigationProgressContext)
  if (!context) {
    throw new Error('useNavigationProgress must be used within a NavigationProgressProvider')
  }
  return context
}
