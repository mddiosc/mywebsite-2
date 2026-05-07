import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'theme-preference'

/**
 * Hook to manage theme (dark/light mode) with system preference detection
 * and localStorage persistence.
 *
 * NOTE: theme resolution logic here intentionally duplicates the IIFE
 * in index.html. The IIFE applies the class before React hydrates
 * (anti-FOUC), and this hook syncs React state with the pre-applied class.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR safety guard
    if (globalThis.window !== undefined) {
      // If the inline script already applied a theme class, use it to avoid flash
      const root = document.documentElement
      if (root.classList.contains('dark')) return 'dark'
      if (root.classList.contains('light')) return 'light'

      // Fallback to localStorage
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR safety guard
      if (globalThis.window !== undefined) {
        return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
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
    const hasCorrectClass = root.classList.contains(resolved)

    // Skip DOM class update if already correct (anti-flash: index.html IIFE set it)
    // But always sync color-scheme for native controls (buttons, inputs, scrollbars)
    root.style.colorScheme = resolved

    if (hasCorrectClass) return

    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
  }, [getResolvedTheme])

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = getResolvedTheme()
      setResolvedTheme(resolved)

      const root = document.documentElement
      const hasCorrectClass = root.classList.contains(resolved)

      // Always sync color-scheme for native controls
      root.style.colorScheme = resolved

      // Skip DOM class update if already correct (anti-flash)
      if (hasCorrectClass) return

      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, getResolvedTheme])

  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    updateTheme(newTheme)
  }, [resolvedTheme, updateTheme])

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  }
}
