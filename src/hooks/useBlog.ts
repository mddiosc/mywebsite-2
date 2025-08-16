import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { BlogPost, BlogLanguage } from '../types/blog'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function parseFrontmatter(content: string): { meta: Record<string, unknown>; content: string } {
  console.log('🔍 Debug - parseFrontmatter input preview:', content.substring(0, 200))
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const exec = frontmatterRegex.exec(content)

  console.log('🔍 Debug - Frontmatter regex match:', !!exec)

  if (!exec) {
    console.warn('🔍 Debug - No frontmatter found!')
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

type BlogIndex = Record<
  string,
  {
    slug: string
    filename: string
  }[]
>

async function loadBlogPostsFromPublic(language: BlogLanguage): Promise<BlogPost[]> {
  try {
    console.log('🔍 Debug - Loading posts using public/ approach for language:', language)

    // Primero cargamos el índice de posts
    const indexResponse = await fetch('/content/blog-index.json')
    if (!indexResponse.ok) {
      throw new Error(`Failed to load blog index: ${indexResponse.statusText}`)
    }

    const blogIndex = (await indexResponse.json()) as BlogIndex
    const postsForLanguage = blogIndex[language] ?? []

    console.log('🔍 Debug - Posts found in index:', postsForLanguage)

    const posts: BlogPost[] = []

    for (const postInfo of postsForLanguage) {
      try {
        const response = await fetch(`/content/blog/${language}/${postInfo.filename}`)
        if (!response.ok) {
          console.warn(`Failed to load post ${postInfo.filename}:`, response.statusText)
          continue
        }

        const content = await response.text()
        console.log('🔍 Debug - Loaded content for:', postInfo.filename)
        console.log('🔍 Debug - Content preview (first 200 chars):', content.substring(0, 200))

        const { meta, content: markdownContent } = parseFrontmatter(content)
        console.log('🔍 Debug - Parsed meta:', meta)
        console.log('🔍 Debug - Meta title:', meta['title'])
        console.log('🔍 Debug - Meta date:', meta['date'])

        if (!meta['title'] || !meta['date']) {
          console.warn(`Missing required metadata in ${postInfo.filename}`)
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
        console.warn(`Error loading post ${postInfo.filename}:`, postError)
      }
    }

    console.log('🔍 Debug - Total posts loaded from public:', posts.length)
    posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

    return posts
  } catch (err) {
    console.error('Error loading blog posts from public:', err)
    throw new Error('Error al cargar los posts del blog')
  }
}

async function loadBlogPosts(language: BlogLanguage): Promise<BlogPost[]> {
  // Intentamos primero con el método original (import.meta.glob)
  try {
    console.log('🔍 Debug - Trying import.meta.glob approach')
    await new Promise((resolve) => setTimeout(resolve, 100))

    const posts: BlogPost[] = []

    const modules = import.meta.glob('/src/content/blog/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: true,
    })

    console.log('🔍 Debug - All found modules:', Object.keys(modules))
    console.log('🔍 Debug - Looking for language:', language)

    for (const [filePath, module] of Object.entries(modules)) {
      console.log('🔍 Debug - Processing file:', filePath)
      if (!filePath.includes(`/blog/${language}/`)) {
        console.log('🔍 Debug - Skipping file (wrong language):', filePath)
        continue
      }

      try {
        const content = module
        console.log('🔍 Debug - Module content type:', typeof content)
        console.log(
          '🔍 Debug - Module content preview:',
          typeof content === 'string' ? content.substring(0, 100) + '...' : content,
        )

        if (typeof content !== 'string') {
          console.warn(`Expected string content from ${filePath}, got ${typeof content}`)
          continue
        }

        const { meta, content: markdownContent } = parseFrontmatter(content)

        if (!meta['title'] || !meta['date']) continue

        const fileName = filePath.split('/').pop() ?? ''
        const slug = fileName.replace('.md', '')

        const post: BlogPost = {
          meta: {
            title: meta['title'] as string,
            description: meta['description'] as string,
            date: meta['date'] as string,
            author: meta['author'] as string,
            tags: meta['tags'] as string[],
            featured: meta['featured'] as boolean,
            slug,
          },
          content: markdownContent,
          slug,
          readingTime: calculateReadingTime(markdownContent),
        }

        posts.push(post)
        console.log('🔍 Debug - Added post:', post.meta.title)
      } catch (postError) {
        console.warn(`Error loading post from ${filePath}:`, postError)
      }
    }

    console.log('🔍 Debug - Total posts found with import.meta.glob:', posts.length)

    if (posts.length > 0) {
      posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
      return posts
    } else {
      console.log('🔍 Debug - No posts found with import.meta.glob, trying public/ approach')
      // Si no encontramos posts, intentamos con el método de public/
      return await loadBlogPostsFromPublic(language)
    }
  } catch (err) {
    console.error('Error with import.meta.glob, trying public/ approach:', err)
    // Si falla el método original, usamos el método de public/
    return await loadBlogPostsFromPublic(language)
  }
}

export function useBlogPosts() {
  const { i18n } = useTranslation()
  const language = i18n.language as BlogLanguage

  return useQuery({
    queryKey: ['blog-posts', language],
    queryFn: async () => loadBlogPosts(language),
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
