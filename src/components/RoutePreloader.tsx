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

      // Preload every route except the current one
      Object.entries(ROUTE_IMPORTS).forEach(([route, importFn]) => {
        if (!excludeCurrentRoute || route !== currentRoute) {
          void importFn()
        }
      })
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [location.pathname, delay, excludeCurrentRoute])

  return null
}
