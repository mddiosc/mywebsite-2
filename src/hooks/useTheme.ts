import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme-preference'

/**
 * Hook to manage theme (dark/light mode) with system preference detection
 * and localStorage persistence
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored
      }
    }
    return 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Get the actual theme based on system preference
  const getResolvedTheme = useCallback((): 'light' | 'dark' => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light'
    }
    return theme
  }, [theme])

  // Update document class and resolved theme
  useEffect(() => {
    const resolved = getResolvedTheme()
    setResolvedTheme(resolved)

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    // Update color-scheme for native elements
    root.style.colorScheme = resolved
  }, [getResolvedTheme])

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = getResolvedTheme()
      setResolvedTheme(resolved)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)
      document.documentElement.style.colorScheme = resolved
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, getResolvedTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  }
}
