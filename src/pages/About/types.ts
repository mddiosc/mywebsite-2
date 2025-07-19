import type { Technology } from '@/constants/technologies'

export interface Stat {
  label: string
  value: string
}

export interface AboutData {
  skills: string[]
  stats: Stat[]
  technologies: Technology[]
  biographyParagraphs: string[]
}
