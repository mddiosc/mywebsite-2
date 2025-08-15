import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useLocation } from 'react-router'

import { Layout } from '../components'
import { About, Contact, Home, NotFoundPage, Projects } from '../pages'
import Blog from '../pages/Blog'

const supportedLanguages = ['es', 'en'] as const
type SupportedLanguage = (typeof supportedLanguages)[number]

function LanguageRedirect() {
  const { i18n } = useTranslation()
  const location = useLocation()

  const pathSegments = location.pathname.split('/')
  const langSegment = pathSegments[1] as SupportedLanguage

  const isLanguageSupported = supportedLanguages.includes(langSegment)

  if (!isLanguageSupported) {
    return <Navigate to={`/${i18n.language}/`} replace />
  }

  return null
}

export function AppRoutes() {
  return (
    <>
      <LanguageRedirect />
      <Routes>
        <Route path="/" element={<Navigate to={`/${useTranslation().i18n.language}`} replace />} />
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Blog />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
