import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import { OptimizedImage } from './OptimizedImage'

describe('OptimizedImage', () => {
  it('renders picture sources for raster images when provided', () => {
    render(
      <OptimizedImage
        src="/images/photo.jpg"
        alt="Example photo"
        priority
        sources={[
          { type: 'image/avif', srcSet: '/images/photo.avif 1x, /images/photo@2x.avif 2x' },
          { type: 'image/webp', srcSet: '/images/photo.webp 1x, /images/photo@2x.webp 2x' },
        ]}
        srcSet="/images/photo.jpg 1x, /images/photo@2x.jpg 2x"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />,
    )

    expect(screen.getByRole('img', { name: 'Example photo' })).toHaveAttribute(
      'src',
      '/images/photo.jpg',
    )
    expect(document.querySelectorAll('picture source')).toHaveLength(2)
    expect(document.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      '/images/photo.avif 1x, /images/photo@2x.avif 2x',
    )
    expect(document.querySelector('source[type="image/webp"]')).toHaveAttribute(
      'srcset',
      '/images/photo.webp 1x, /images/photo@2x.webp 2x',
    )
  })

  it('keeps svg sources on the direct image path', () => {
    render(<OptimizedImage src="/logo.svg" alt="Site logo" priority />)

    expect(document.querySelector('picture')).toBeNull()
    expect(screen.getByRole('img', { name: 'Site logo' })).toHaveAttribute('src', '/logo.svg')
  })
})
