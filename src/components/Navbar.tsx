import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'

import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

import { useThemeContext } from '../context'
import { fadeIn, slideIn, commonTransition } from '../lib/animations'

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
    { name: t('navigation.home'), to: `/${i18n.language}/`, exact: true },
    { name: t('navigation.about'), to: `/${i18n.language}/about`, exact: false },
    { name: t('navigation.projects'), to: `/${i18n.language}/projects`, exact: false },
    { name: t('navigation.blog'), to: `/${i18n.language}/blog`, exact: false },
    { name: t('navigation.contact'), to: `/${i18n.language}/contact`, exact: false },
  ]

  const slideInPanel = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
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
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
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
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ ...commonTransition, duration: 0.2 }}
              onClick={() => {
                setMobileMenuOpen(false)
              }}
            />
            <motion.div
              id="mobile-menu"
              className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-[#141419] dark:sm:ring-gray-700/20"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideInPanel}
              transition={{ ...commonTransition, type: 'spring', stiffness: 400, damping: 40 }}
            >
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
                    className="h-8 w-auto"
                    priority
                  />
                </NavLink>
                <motion.button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                  }}
                  className="-m-2.5 rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  aria-label={t('accessibility.closeMenu', { defaultValue: 'Close menu' })}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </motion.button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/30">
                  <div className="flex flex-col gap-2 py-6">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial="hidden"
                        animate="visible"
                        variants={slideIn}
                        transition={{ ...commonTransition, delay: 0.1 * index }}
                      >
                        <NavLink
                          to={item.to}
                          end={item.exact}
                          viewTransition
                          className={({ isActive }) =>
                            `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold transition-colors ${
                              isActive
                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800'
                            }`
                          }
                          onClick={() => {
                            setMobileMenuOpen(false)
                          }}
                        >
                          {({ isActive }) => (
                            <span aria-current={isActive ? 'page' : undefined}>{item.name}</span>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                  <div className="py-6">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  )
}
