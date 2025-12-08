/**
 * Navigation transition hook using React 19's useTransition
 *
 * Provides smooth navigation transitions that keep the current content visible
 * while loading new pages, preventing the jarring "flash" of loading states.
 *
 * This is a React 19 enhancement that leverages concurrent features for better UX.
 */

import { useTransition, useCallback } from 'react'
import { useNavigate, type NavigateOptions, type To } from 'react-router'

/**
 * Return type for the useNavigationTransition hook
 */
export interface UseNavigationTransitionResult {
  /**
   * Navigate to a new location with a transition
   * The current view stays visible until the new page is ready
   */
  navigateWithTransition: (to: To, options?: NavigateOptions) => void
  /**
   * Whether a navigation transition is currently in progress
   * Can be used to show a subtle loading indicator without hiding content
   */
  isNavigating: boolean
}

/**
 * Hook that wraps React Router's navigate with React 19's useTransition
 *
 * Benefits:
 * - Current page content stays visible during navigation
 * - Prevents "flash of loading state" when navigating between pages
 * - Provides isPending state for showing subtle loading indicators
 * - Maintains responsive UI during heavy page transitions
 *
 * @example
 * ```tsx
 * const { navigateWithTransition, isNavigating } = useNavigationTransition()
 *
 * return (
 *   <button
 *     onClick={() => navigateWithTransition('/about')}
 *     className={isNavigating ? 'opacity-70' : ''}
 *   >
 *     Go to About
 *   </button>
 * )
 * ```
 */
export function useNavigationTransition(): UseNavigationTransitionResult {
  const navigate = useNavigate()
  const [isNavigating, startTransition] = useTransition()

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      startTransition(() => {
        void navigate(to, options)
      })
    },
    [navigate],
  )

  return {
    navigateWithTransition,
    isNavigating,
  }
}
