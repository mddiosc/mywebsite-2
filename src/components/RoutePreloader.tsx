import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Map of route paths to their lazy import functions
const ROUTE_IMPORTS = {
  '/about': async () => import('../pages/About'),
  '/projects': async () => import('../pages/Projects'),
  '/contact': async () => import('../pages/Contact'),
  '/blog': async () => import('../pages/Blog'),
} as const

interface SmartRoutePreloaderProps {
  delay?: number
  excludeCurrentRoute?: boolean
}

/**
 * Smart route preloader that preloads routes based on current location
 * and predicts likely next routes
 */
export function SmartRoutePreloader({
  delay = 2000,
  excludeCurrentRoute = true,
}: SmartRoutePreloaderProps) {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentPath = location.pathname.split('/').slice(2).join('/') // Remove language prefix
      const currentRoute = currentPath ? `/${currentPath}` : '/'

      // Preload based on current route - predict likely next routes
      const routesToPreload = new Set<string>()

      // Strategy: Preload all routes except current one
      Object.keys(ROUTE_IMPORTS).forEach((route) => {
        if (!excludeCurrentRoute || route !== currentRoute) {
          routesToPreload.add(route)
        }
      })

      // If on home, prioritize about and projects
      if (currentRoute === '/') {
        routesToPreload.add('/about')
        routesToPreload.add('/projects')
      }

      // Preload the selected routes
      routesToPreload.forEach((route) => {
        const importFn = ROUTE_IMPORTS[route as keyof typeof ROUTE_IMPORTS]
        void importFn()
      })
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [location.pathname, delay, excludeCurrentRoute])

  return null
}
