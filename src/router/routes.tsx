import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useLocation } from 'react-router'

import { Layout } from '../components'

// Lazy load all pages for better performance
const Home = lazy(async () => import('../pages/Home'))
const About = lazy(async () => import('../pages/About'))
const Contact = lazy(async () => import('../pages/Contact'))
const Projects = lazy(async () => import('../pages/Projects'))
const Blog = lazy(async () => import('../pages/Blog'))
const NotFoundPage = lazy(async () => import('../pages/NotFound'))
const BlogPost = lazy(async () => {
  const module = await import('../pages/Blog/components/BlogPost')
  return { default: module.BlogPost }
})

// Loading fallback component
const PageLoader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        <span className="text-sm text-gray-600">{t('common.loading')}</span>
      </div>
    </div>
  )
}

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/${useTranslation().i18n.language}`} replace />}
          />
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
      </Suspense>
    </>
  )
}
