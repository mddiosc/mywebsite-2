import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

interface DocumentHeadProps {
  title: string
  description: string
  keywords?: string
  ogType?: string
  robots?: string
  // Article-specific meta tags
  articlePublishedTime?: string
  articleAuthor?: string
  articleTags?: string[]
}

/**
 * Component that manages document head with enhanced title updating
 * This ensures titles update correctly when navigating between routes
 */
export function DocumentHead({
  title,
  description,
  keywords,
  ogType = 'website',
  robots,
  articlePublishedTime,
  articleAuthor,
  articleTags,
}: DocumentHeadProps) {
  // Force document title update using both Helmet and direct DOM manipulation
  useEffect(() => {
    // Immediate update
    document.title = title

    // Delayed update to ensure Helmet has processed
    const timeoutId = setTimeout(() => {
      document.title = title
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [title])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleAuthor && <meta property="article:author" content={articleAuthor} />}
      {articleTags?.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}
    </Helmet>
  )
}
