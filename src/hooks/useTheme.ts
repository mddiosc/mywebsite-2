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

  // Track the live system preference so `resolvedTheme` can be derived during
  // render (no setState-in-effect). Listener stays always-on so this stays fresh
  // even while `theme` is an explicit 'light'/'dark', matching the previous
  // live matchMedia read on theme switch.
  const [systemPref, setSystemPref] = useState<'light' | 'dark'>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR safety guard
    if (globalThis.window !== undefined) {
      return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Resolved theme is derived from `theme` + system preference — computed during
  // render, not stored via setState-in-effect.
  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? systemPref : theme

  // Sync document class + color-scheme. Pure side-effect, no setState.
  useEffect(() => {
    const root = document.documentElement
    const hasCorrectClass = root.classList.contains(resolvedTheme)

    // Skip DOM class update if already correct (anti-flash: index.html IIFE set it)
    // But always sync color-scheme for native controls (buttons, inputs, scrollbars)
    root.style.colorScheme = resolvedTheme

    if (hasCorrectClass) return

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  // Listen for system preference changes — setState only in async callback.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR safety guard
    if (globalThis.window === undefined) return

    const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPref(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

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
