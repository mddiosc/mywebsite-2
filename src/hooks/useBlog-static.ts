import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import { blogPosts, blogPostsIndex } from '../data/blogPosts'
import type { BlogPost, BlogLanguage } from '../types/blog'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function parseFrontmatter(content: string): { meta: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const exec = frontmatterRegex.exec(content)

  if (!exec) {
    return { meta: {}, content }
  }

  const frontmatterText = exec[1]
  const markdownContent = exec[2]

  if (!frontmatterText || !markdownContent) {
    return { meta: {}, content }
  }

  const meta: Record<string, unknown> = {}
  const lines = frontmatterText.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) continue

    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmedLine.substring(0, colonIndex).trim()
    let value = trimmedLine.substring(colonIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1)
      meta[key] = arrayContent
        .split(',')
        .map((item) => item.trim().replace(/['"]/g, ''))
        .filter((item) => item.length > 0)
    } else if (value === 'true' || value === 'false') {
      meta[key] = value === 'true'
    } else {
      meta[key] = value
    }
  }

  return { meta, content: markdownContent }
}

function loadBlogPostsFromStaticImports(language: BlogLanguage): BlogPost[] {
  try {
    console.log('🔍 Debug - Loading posts using static imports for language:', language)

    const postsForLanguage = blogPostsIndex[language]
    const postsData = blogPosts[language]

    console.log('🔍 Debug - Posts found in static index:', postsForLanguage)
    console.log('🔍 Debug - Available post data keys:', Object.keys(postsData))

    const posts: BlogPost[] = []

    for (const postInfo of postsForLanguage) {
      try {
        const content = postsData[postInfo.slug as keyof typeof postsData]

        if (!content) {
          console.warn(`No content found for slug: ${postInfo.slug}`)
          continue
        }

        console.log('🔍 Debug - Processing post:', postInfo.slug)
        console.log('🔍 Debug - Content preview (first 200 chars):', content.substring(0, 200))

        const { meta, content: markdownContent } = parseFrontmatter(content)
        console.log('🔍 Debug - Parsed meta:', meta)

        if (!meta['title'] || !meta['date']) {
          console.warn(`Missing required metadata in ${postInfo.slug}`)
          console.warn('Meta object:', meta)
          continue
        }

        const post: BlogPost = {
          meta: {
            title: meta['title'] as string,
            description: meta['description'] as string,
            date: meta['date'] as string,
            author: meta['author'] as string,
            tags: meta['tags'] as string[],
            featured: meta['featured'] as boolean,
            slug: postInfo.slug,
          },
          content: markdownContent,
          slug: postInfo.slug,
          readingTime: calculateReadingTime(markdownContent),
        }

        posts.push(post)
        console.log('🔍 Debug - Added post:', post.meta.title)
      } catch (postError) {
        console.warn(`Error processing post ${postInfo.slug}:`, postError)
      }
    }

    console.log('🔍 Debug - Total posts loaded from static imports:', posts.length)
    posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

    return posts
  } catch (err) {
    console.error('Error loading blog posts from static imports:', err)
    throw new Error('Error al cargar los posts del blog')
  }
}

function loadBlogPosts(language: BlogLanguage): BlogPost[] {
  // Usamos directamente los imports estáticos
  console.log('🔍 Debug - Using static imports approach')
  return loadBlogPostsFromStaticImports(language)
}

export function useBlogPosts() {
  const { i18n } = useTranslation()
  const language = i18n.language as BlogLanguage

  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: () => loadBlogPosts(language),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useBlogPost(slug: string) {
  const { data: posts, isLoading: postsLoading, error, refetch } = useBlogPosts()

  const post = posts?.find((p) => p.slug === slug) ?? null

  return {
    data: post,
    isLoading: postsLoading,
    error: !post && !postsLoading && !error ? new Error('Post no encontrado') : error,
    refetch,
  }
}
