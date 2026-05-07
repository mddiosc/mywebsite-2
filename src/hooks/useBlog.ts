import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { BlogPost, BlogLanguage } from '../types/blog'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function parseFrontmatterLine(line: string): [string, string] | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  const colonIndex = trimmed.indexOf(':')
  if (colonIndex === -1) return null

  const key = trimmed.substring(0, colonIndex).trim()
  const value = trimmed.substring(colonIndex + 1).trim()
  return [key, value]
}

export function parseFrontmatterValue(raw: string): unknown {
  let value = raw

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/['"]/g, ''))
      .filter((item) => item.length > 0)
  }

  if (value === 'true' || value === 'false') {
    return value === 'true'
  }

  return value
}

export function parseFrontmatter(content: string): {
  meta: Record<string, unknown>
  content: string
} {
  const lines = content.split('\n')

  if (lines[0] !== '---') {
    return { meta: {}, content }
  }

  const closingDelimiterLineIndex = lines.indexOf('---', 1)

  if (closingDelimiterLineIndex === -1) {
    return { meta: {}, content }
  }

  const frontmatterText = lines.slice(1, closingDelimiterLineIndex).join('\n')
  const markdownContent = lines.slice(closingDelimiterLineIndex + 1).join('\n')

  const meta: Record<string, unknown> = {}

  for (const line of frontmatterText.split('\n')) {
    const parsed = parseFrontmatterLine(line)
    if (!parsed) continue
    const [key, value] = parsed
    meta[key] = parseFrontmatterValue(value)
  }

  return { meta, content: markdownContent }
}

async function loadBlogPosts(language: BlogLanguage): Promise<BlogPost[]> {
  try {
    const posts: BlogPost[] = []

    // Usamos import.meta.glob para cargar los archivos markdown
    const modules = import.meta.glob('/src/content/blog/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: false,
    })

    for (const [filePath, moduleLoader] of Object.entries(modules)) {
      // Verificamos si el archivo corresponde al idioma actual
      if (!filePath.includes(`/blog/${language}/`)) continue

      try {
        const content = await moduleLoader()

        if (typeof content !== 'string') {
          console.warn(`Expected string content from ${filePath}, got ${typeof content}`)
          continue
        }

        const { meta, content: markdownContent } = parseFrontmatter(content)

        if (!meta['title'] || !meta['date']) continue

        // Extraemos el slug del nombre del archivo
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
      } catch (postError) {
        console.warn(`Error loading post from ${filePath}:`, postError)
      }
    }

    // Ordenamos por fecha (más recientes primero)
    posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

    return posts
  } catch (err) {
    console.error('Error loading blog posts:', err)
    throw new Error('Error al cargar los posts del blog')
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
    // Keep previous data while fetching new language posts for smoother transitions
    placeholderData: (previousData) => previousData,
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
