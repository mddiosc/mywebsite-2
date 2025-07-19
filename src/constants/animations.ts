export const ANIMATION_DELAYS = {
  hero: 0.1,
  content: 0.5,
  technologies: 0.7,
  contact: 0.9,
} as const

export const ANIMATION_CONFIG = {
  hero: { delay: ANIMATION_DELAYS.hero },
  content: { delay: ANIMATION_DELAYS.content },
  technologies: { delay: ANIMATION_DELAYS.technologies },
  contact: { delay: ANIMATION_DELAYS.contact },
} as const
