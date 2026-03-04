/**
 * DocumentHead component using React 19's native metadata support
 *
 * React 19 supports rendering <title>, <meta>, and <link> tags directly
 * in components, with automatic hoisting to the document <head>.
 * This eliminates the need for react-helmet or similar libraries.
 *
 * Benefits:
 * - Native React support without external dependencies
 * - Automatic deduplication of meta tags
 * - Better SSR support out of the box
 * - Cleaner component code
 */

const SITE_URL = import.meta.env.VITE_SITE_URL
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.png`

interface DocumentHeadProps {
  title: string
  description: string
  keywords?: string
  ogType?: string
  robots?: string
  // Open Graph image (defaults to og-image.png)
  ogImage?: string
  // Article-specific meta tags
  articlePublishedTime?: string
  articleAuthor?: string
  articleTags?: string[]
  // Canonical URL
  canonicalUrl?: string
}

/**
 * Component that manages document head using React 19's native metadata support
 *
 * React 19 automatically hoists these elements to <head> and handles
 * deduplication based on tag type and key attributes.
 */
export function DocumentHead({
  title,
  description,
  keywords,
  ogType = 'website',
  robots,
  ogImage = DEFAULT_OG_IMAGE,
  articlePublishedTime,
  articleAuthor,
  articleTags,
  canonicalUrl,
}: DocumentHeadProps) {
  return (
    <>
      {/* React 19: title is automatically hoisted to <head> */}
      <title>{title}</title>

      {/* Standard meta tags */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter / X Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific meta tags */}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleAuthor && <meta property="article:author" content={articleAuthor} />}
      {articleTags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </>
  )
}
