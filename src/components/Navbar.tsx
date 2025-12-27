import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'

import { Dialog } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  FolderIcon,
  NewspaperIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

import { useThemeContext } from '../context'

import { LanguageSwitcher, OptimizedImage, ThemeToggle } from '.'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, i18n } = useTranslation()
  const { isDark } = useThemeContext()
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Track scroll position for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navigation = [
    { name: t('navigation.home'), to: `/${i18n.language}/`, exact: true, icon: HomeIcon },
    { name: t('navigation.about'), to: `/${i18n.language}/about`, exact: false, icon: UserIcon },
    {
      name: t('navigation.projects'),
      to: `/${i18n.language}/projects`,
      exact: false,
      icon: FolderIcon,
    },
    { name: t('navigation.blog'), to: `/${i18n.language}/blog`, exact: false, icon: NewspaperIcon },
    {
      name: t('navigation.contact'),
      to: `/${i18n.language}/contact`,
      exact: false,
      icon: EnvelopeIcon,
    },
  ]

  // Staggered animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.08,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -10,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
      },
    }),
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-0'}`}
    >
      <nav
        id="navigation"
        className={`mx-auto transition-all duration-500 ${
          isScrolled
            ? 'max-w-4xl rounded-full border border-gray-200/50 bg-white/80 px-6 shadow-lg shadow-gray-900/5 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-gray-900/20'
            : 'max-w-7xl bg-transparent px-4 sm:px-6 lg:px-8'
        }`}
        aria-label={t('accessibility.mainNavigation', { defaultValue: 'Main navigation' })}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-12' : 'h-16'
          }`}
        >
          <div className="flex lg:flex-1">
            <NavLink
              to={`/${i18n.language}/`}
              className="-m-1.5 p-1.5"
              aria-label={t('accessibility.homeLink', { defaultValue: 'Go to homepage' })}
            >
              <OptimizedImage
                src={isDark ? '/logo_negative.svg' : '/logo_positive.svg'}
                alt={t('accessibility.logoAlt', { defaultValue: 'Site logo' })}
                className={`w-auto transition-all duration-500 ${isScrolled ? 'h-8' : 'h-12'}`}
                priority
              />
            </NavLink>
          </div>
          <div className="flex items-center lg:hidden">
            <motion.button
              type="button"
              onClick={() => {
                setMobileMenuOpen(true)
              }}
              className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={t('accessibility.openMenu', { defaultValue: 'Open main menu' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bars3Icon aria-hidden="true" className="size-6" />
            </motion.button>
          </div>
          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                viewTransition
                className={({ isActive }) =>
                  `group relative py-1 text-sm/6 font-semibold transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-900 hover:text-primary dark:text-gray-100 dark:hover:text-primary-light'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span aria-current={isActive ? 'page' : undefined}>{item.name}</span>
                    {/* Animated underline */}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-linear-to-r from-primary to-accent transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="relative z-50 lg:hidden"
          >
            {/* Full-screen glassmorphism overlay */}
            <motion.div
              className="fixed inset-0 bg-white/80 backdrop-blur-xl dark:bg-gray-900/90"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
            />

            {/* Decorative gradient orbs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight/10 blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            {/* Menu content */}
            <motion.div
              id="mobile-menu"
              className="fixed inset-0 z-10 flex flex-col px-6 py-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              {/* Header with logo and close button */}
              <div className="flex items-center justify-between">
                <NavLink
                  to={`/${i18n.language}/`}
                  className="-m-1.5 p-1.5"
                  onClick={() => {
                    setMobileMenuOpen(false)
                  }}
                  aria-label={t('accessibility.homeLink', { defaultValue: 'Go to homepage' })}
                >
                  <OptimizedImage
                    src={isDark ? '/logo_negative.svg' : '/logo_positive.svg'}
                    alt={t('accessibility.logoAlt', { defaultValue: 'Site logo' })}
                    className="h-10 w-auto"
                    priority
                  />
                </NavLink>
                <motion.button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                  }}
                  className="relative rounded-full bg-gray-100/80 p-3 text-gray-700 backdrop-blur-sm transition-colors hover:bg-gray-200/80 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/80"
                  aria-label={t('accessibility.closeMenu', { defaultValue: 'Close menu' })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: 90 }}
                >
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </motion.button>
              </div>

              {/* Navigation links - centered */}
              <nav className="flex flex-1 flex-col items-center justify-center gap-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.to}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuItemVariants}
                      className="w-full max-w-xs"
                    >
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        viewTransition
                        className={({ isActive }) =>
                          `group flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-xl font-semibold transition-all duration-300 ${
                            isActive
                              ? 'bg-linear-to-r from-primary to-highlight text-white shadow-lg shadow-primary/25'
                              : 'bg-gray-100/60 text-gray-700 hover:bg-gray-200/80 hover:text-primary dark:bg-gray-800/60 dark:text-gray-200 dark:hover:bg-gray-700/80 dark:hover:text-primary-light'
                          }`
                        }
                        onClick={() => {
                          setMobileMenuOpen(false)
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`size-6 transition-transform duration-300 group-hover:scale-110 ${
                                isActive ? 'text-white' : ''
                              }`}
                            />
                            <span aria-current={isActive ? 'page' : undefined}>{item.name}</span>
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom section with language switcher and theme toggle */}
              <motion.div
                className="flex items-center justify-center gap-3 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <ThemeToggle />
                <LanguageSwitcher />
              </motion.div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  )
}
