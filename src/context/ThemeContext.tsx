import type { ReactNode } from 'react'

import { ThemeContext } from './themeContextValue'

import { useTheme } from '../hooks/useTheme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useTheme()

  return <ThemeContext value={themeValue}>{children}</ThemeContext>
}
