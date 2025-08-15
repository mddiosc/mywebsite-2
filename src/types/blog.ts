export interface BlogPostMeta {
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  slug: string
  featured?: boolean
}

export interface BlogPost {
  meta: BlogPostMeta
  content: string
  slug: string
  readingTime: number
}

export type BlogLanguage = 'es' | 'en'
