import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'

import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

import { fadeIn, slideIn, commonTransition } from '../lib/animations'

import { LanguageSwitcher } from '.'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: t('navigation.home'), to: `/${i18n.language}/`, exact: true },
    { name: t('navigation.about'), to: `/${i18n.language}/about`, exact: false },
    { name: t('navigation.projects'), to: `/${i18n.language}/projects`, exact: false },
    { name: t('navigation.contact'), to: `/${i18n.language}/contact`, exact: false },
  ]

  // Animación específica para el panel lateral
  const slideInPanel = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  }

  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex lg:flex-1">
            <NavLink to={`/${i18n.language}/`} className="-m-1.5 p-1.5">
              <img alt="" src="/logo_positive.svg" className="h-12 w-auto" />
            </NavLink>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(true)
              }}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `text-sm/6 font-semibold ${
                    isActive
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-900 hover:text-indigo-500'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
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
              className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
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
                >
                  <img alt="" src="/logo_positive.svg" className="h-8 w-auto" />
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                  }}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
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
                          className={({ isActive }) =>
                            `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                              isActive
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-900 hover:bg-gray-50'
                            }`
                          }
                          onClick={() => {
                            setMobileMenuOpen(false)
                          }}
                        >
                          {item.name}
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
