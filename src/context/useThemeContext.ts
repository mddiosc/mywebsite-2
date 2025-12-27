import { use } from 'react'

import { ThemeContext } from './themeContextValue'

export function useThemeContext() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
