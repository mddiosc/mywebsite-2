import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useLocation } from 'react-router'

import Layout from '../components/Layout'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Home from '../pages/Home'
import Projects from '../pages/Projects'

function LanguageRedirect() {
  const { i18n } = useTranslation()
  const location = useLocation()

  if (!location.pathname.includes('/es/') && !location.pathname.includes('/en/')) {
    return <Navigate to={`/${i18n.language}/`} replace />
  }

  return null
}

export function AppRoutes() {
  return (
    <>
      <LanguageRedirect />
      <Routes>
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}
