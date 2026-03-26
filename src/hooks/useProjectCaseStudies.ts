import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { ProjectCaseStudy, CaseStudyLanguage } from '@/types'

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

async function loadCaseStudies(language: CaseStudyLanguage): Promise<ProjectCaseStudy[]> {
  try {
    // Simulate loading delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 100))

    const caseStudies: ProjectCaseStudy[] = []

    // Use import.meta.glob to load markdown files
    const modules = import.meta.glob('/src/content/projects/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: false,
    })

    for (const [filePath, moduleLoader] of Object.entries(modules)) {
      // Check if file belongs to current language
      if (!filePath.includes(`/projects/${language}/`)) continue

      try {
        const content = await moduleLoader()

        if (typeof content !== 'string') {
          console.warn(`Expected string content from ${filePath}, got ${typeof content}`)
          continue
        }

        const { meta, content: markdownContent } = parseFrontmatter(content)

        if (!meta['title'] || !meta['slug'] || !meta['repoName']) continue

        const caseStudy: ProjectCaseStudy = {
          meta: {
            slug: meta['slug'] as string,
            title: meta['title'] as string,
            summary: meta['summary'] as string,
            published: meta['published'] as string,
            featured: meta['featured'] as boolean,
            role: meta['role'] as string | undefined,
            status: meta['status'] as string | undefined,
            outcomes: meta['outcomes'] as string[] | undefined,
            repoName: meta['repoName'] as string,
            relatedPosts: meta['relatedPosts'] as string[] | undefined,
          },
          content: markdownContent,
          slug: meta['slug'] as string,
          readingTime: calculateReadingTime(markdownContent),
        }

        caseStudies.push(caseStudy)
      } catch (error) {
        console.warn(`Error loading case study from ${filePath}:`, error)
      }
    }

    // Sort by publication date (most recent first)
    caseStudies.sort(
      (a, b) => new Date(b.meta.published).getTime() - new Date(a.meta.published).getTime(),
    )

    return caseStudies
  } catch (err) {
    console.error('Error loading case studies:', err)
    throw new Error('Error al cargar los estudios de casos')
  }
}

export function useProjectCaseStudies() {
  const { i18n } = useTranslation()
  const language = i18n.language as CaseStudyLanguage

  return useQuery({
    queryKey: ['project-case-studies', language],
    queryFn: async () => loadCaseStudies(language),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // Keep previous data while fetching new language case studies for smoother transitions
    placeholderData: (previousData) => previousData,
  })
}

export function useProjectCaseStudy(slug: string) {
  const { data: caseStudies, isLoading, error, refetch } = useProjectCaseStudies()

  const caseStudy = caseStudies?.find((cs) => cs.slug === slug) ?? null

  return {
    data: caseStudy,
    isLoading,
    error: !caseStudy && !isLoading && !error ? new Error('Case study not found') : error,
    refetch,
  }
}
