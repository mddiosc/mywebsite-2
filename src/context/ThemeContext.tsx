import { createContext, use, type ReactNode } from 'react'

import { useTheme, type Theme } from '../hooks/useTheme'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useTheme()

  return <ThemeContext value={themeValue}>{children}</ThemeContext>
}

export function useThemeContext() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
