/**
 * Navigation Progress Components
 *
 * Provider and visual indicator components for navigation progress
 * using React 19's useTransition.
 *
 * Shows a subtle loading bar at the top of the page during page transitions,
 * while keeping the current content visible.
 *
 * This improves UX by:
 * - Keeping current page visible during navigation
 * - Showing progress feedback at the top of the viewport
 * - Not blocking user interactions during transitions
 */

import { useTransition, useCallback, useMemo, type ReactNode } from 'react'
import { useNavigate, type NavigateOptions, type To } from 'react-router'

import { NavigationProgressContext, useNavigationProgress } from '../hooks/useNavigationProgress'

/**
 * Props for the NavigationProgressProvider
 */
interface NavigationProgressProviderProps {
  children: ReactNode
}

/**
 * Provider component for navigation progress state
 *
 * Wrap your app with this provider to enable transition-based navigation
 * that keeps the current page visible during route changes.
 *
 * @example
 * ```tsx
 * <NavigationProgressProvider>
 *   <App />
 * </NavigationProgressProvider>
 * ```
 */
export function NavigationProgressProvider({ children }: NavigationProgressProviderProps) {
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isNavigating, navigateWithTransition }),
    [isNavigating, navigateWithTransition],
  )

  // React 19: Use Context directly as provider instead of Context.Provider
  return <NavigationProgressContext value={contextValue}>{children}</NavigationProgressContext>
}

/**
 * Visual progress indicator component
 *
 * Displays a subtle animated bar at the top of the viewport
 * when a navigation transition is in progress.
 */
export function NavigationProgressBar() {
  const { isNavigating } = useNavigationProgress()

  if (!isNavigating) {
    return null
  }

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-busy="true"
      className="fixed top-0 right-0 left-0 z-50 h-1"
    >
      <div
        className="h-full animate-pulse bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500"
        style={{
          animation: 'progress 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
