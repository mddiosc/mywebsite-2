// Import all markdown files statically
import welcomePostEn from '../content/blog/en/2025-01-01-welcome-post.md?raw'
import gdsToReactEn from '../content/blog/en/2025-01-15-gds-to-react.md?raw'
import welcomePostEs from '../content/blog/es/2025-01-01-welcome-post.md?raw'
import gdsToReactEs from '../content/blog/es/2025-01-15-gds-to-react.md?raw'

export const blogPosts = {
  es: {
    '2025-01-01-welcome-post': welcomePostEs,
    '2025-01-15-gds-to-react': gdsToReactEs,
  },
  en: {
    '2025-01-01-welcome-post': welcomePostEn,
    '2025-01-15-gds-to-react': gdsToReactEn,
  },
}

export const blogPostsIndex = {
  es: [
    {
      slug: '2025-01-01-welcome-post',
      filename: '2025-01-01-welcome-post.md',
    },
    {
      slug: '2025-01-15-gds-to-react',
      filename: '2025-01-15-gds-to-react.md',
    },
  ],
  en: [
    {
      slug: '2025-01-01-welcome-post',
      filename: '2025-01-01-welcome-post.md',
    },
    {
      slug: '2025-01-15-gds-to-react',
      filename: '2025-01-15-gds-to-react.md',
    },
  ],
}
