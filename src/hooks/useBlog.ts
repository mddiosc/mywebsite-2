import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { BlogPost, BlogLanguage } from '../types/blog'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function parseFrontmatter(content: string): { meta: Record<string, unknown>; content: string } {
  console.log('🔍 Parsing frontmatter, content starts with:', content.substring(0, 50))

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const exec = frontmatterRegex.exec(content)

  if (!exec) {
    console.log('🔍 No frontmatter match found')
    return { meta: {}, content }
  }

  const frontmatterText = exec[1]
  const markdownContent = exec[2]

  console.log('🔍 Frontmatter text:', frontmatterText?.substring(0, 200) ?? 'undefined')

  if (!frontmatterText || !markdownContent) {
    console.log('🔍 Empty frontmatter or content')
    return { meta: {}, content }
  }

  const meta: Record<string, unknown> = {}
  const lines = frontmatterText.split('\n')

  console.log('🔍 Processing', lines.length, 'frontmatter lines')

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

async function loadBlogPosts(language: BlogLanguage): Promise<BlogPost[]> {
  try {
    const posts: BlogPost[] = []

    // Cargamos el índice de archivos disponibles
    try {
      const indexResponse = await fetch('/content/blog/index.json')
      if (!indexResponse.ok) {
        console.log('No se pudo cargar el índice de posts')
        return []
      }

      const index = (await indexResponse.json()) as Record<string, string[]>
      const possibleFiles = index[language] ?? []

      for (const filename of possibleFiles) {
        try {
          const fileResponse = await fetch(`/content/blog/${language}/${filename}`)

          if (!fileResponse.ok) {
            continue // Archivo no existe, saltamos
          }

          const content = await fileResponse.text()
          console.log(`🔍 Content for ${filename} (first 300 chars):`, content.substring(0, 300))

          const { meta, content: markdownContent } = parseFrontmatter(content)
          console.log(`🔍 Parsed meta for ${filename}:`, meta)
          console.log(`🔍 Meta keys:`, Object.keys(meta))
          console.log(`🔍 Has title:`, !!meta['title'], 'Has date:', !!meta['date'])

          if (!meta['title'] || !meta['date']) {
            console.log(`Skipping ${filename}: missing required metadata`)
            console.log(`🔍 Title value:`, meta['title'], 'Date value:', meta['date'])
            continue
          }

          const slug = filename.replace('.md', '')

          const post: BlogPost = {
            meta: {
              title: meta['title'] as string,
              description: (meta['description'] as string) || '',
              date: meta['date'] as string,
              author: (meta['author'] as string) || 'Unknown',
              tags: meta['tags'] as string[],
              featured: (meta['featured'] as boolean) || false,
              slug: (meta['slug'] as string) || slug,
            },
            content: markdownContent,
            slug: (meta['slug'] as string) || slug,
            readingTime: calculateReadingTime(markdownContent),
          }

          posts.push(post)
        } catch (error) {
          console.log(`Error loading ${filename}:`, error)
          // Continuamos con el siguiente archivo
        }
      }
    } catch (error) {
      console.error('Error in blog loading process:', error)
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
