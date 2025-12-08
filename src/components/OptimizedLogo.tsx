import { useState, useCallback } from 'react'

interface OptimizedLogoProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

/**
 * Optimized component specifically for logos and SVG icons
 *
 * Simpler than OptimizedImage, focused on logos that don't need placeholders.
 * Uses React 19 ref callback with cleanup for IntersectionObserver.
 */
export function OptimizedLogo({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
}: OptimizedLogoProps) {
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)

  /**
   * React 19 ref callback with cleanup function
   *
   * Replaces useRef + useEffect pattern for IntersectionObserver.
   * The cleanup function is called automatically when the element
   * is removed or the ref changes.
   */
  const observerRef = useCallback(
    (element: HTMLImageElement | null) => {
      if (!element || priority || isInView) return

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        },
      )

      observer.observe(element)

      // React 19: Return cleanup function from ref callback
      return () => {
        observer.disconnect()
      }
    },
    [priority, isInView],
  )

  const handleError = () => {
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <svg
          className="h-6 w-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      ref={observerRef}
      src={isInView ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
    />
  )
}
