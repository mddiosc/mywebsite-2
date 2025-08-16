import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useLocation } from 'react-router'

import { Layout } from '../components'
import { About, Contact, Home, NotFoundPage, Projects } from '../pages'
import Blog from '../pages/Blog'
import { BlogPost } from '../pages/Blog/components'

const supportedLanguages = ['es', 'en'] as const
type SupportedLanguage = (typeof supportedLanguages)[number]

function LanguageRedirect() {
  const { i18n } = useTranslation()
  const location = useLocation()

  const pathSegments = location.pathname.split('/')
  const langSegmentRaw = pathSegments[1] ?? ''
  const langSegment = langSegmentRaw.slice(0, 2) as SupportedLanguage

  const isLanguageSupported = supportedLanguages.includes(langSegment)

  if (!isLanguageSupported) {
    const normalized = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2)
    return <Navigate to={`/${normalized}/`} replace />
  }

  return null
}

export function AppRoutes() {
  const { i18n } = useTranslation()
  const defaultLang = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2)
  return (
    <>
      <LanguageRedirect />
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultLang}`} replace />} />
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
