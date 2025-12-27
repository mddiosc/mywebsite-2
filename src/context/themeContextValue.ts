import { createContext } from 'react'

import type { Theme } from '../hooks/useTheme'

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
