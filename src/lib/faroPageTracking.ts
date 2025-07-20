import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { useFaroLogger } from './faro'

export const useFaroPageTracking = () => {
  const location = useLocation()
  const { logEvent } = useFaroLogger()

  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const language = pathSegments[1]
    const page = pathSegments[2] ?? 'home'

    logEvent('custom_page_view', {
      page,
      language: language ?? 'unknown',
      fullPath: location.pathname,
      hasSearch: !!location.search,
      hasHash: !!location.hash,
      isMultilingual: language ? ['es', 'en'].includes(language) : false,
    })
  }, [location, logEvent])
}
