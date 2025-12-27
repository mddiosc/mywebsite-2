import { useTranslation } from 'react-i18next'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

import { useThemeContext } from '../context'

interface ThemeToggleProps {
  className?: string
}

/**
 * Animated theme toggle button with sun/moon icons
 * Supports light, dark, and system preference modes
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useThemeContext()

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label={
        isDark
          ? t('accessibility.switchToLight', { defaultValue: 'Switch to light mode' })
          : t('accessibility.switchToDark', { defaultValue: 'Switch to dark mode' })
      }
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <MoonIcon className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <SunIcon className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow effect on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={false}
        animate={{
          boxShadow: isDark ? '0 0 0 0 rgba(139, 92, 246, 0)' : '0 0 0 0 rgba(0, 102, 255, 0)',
        }}
        whileHover={{
          boxShadow: isDark
            ? '0 0 20px 2px rgba(139, 92, 246, 0.3)'
            : '0 0 20px 2px rgba(0, 102, 255, 0.3)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default ThemeToggle
