export const ANIMATION_DELAYS = {
  hero: 0.1,
  content: 0.5,
  technologies: 0.7,
  contact: 0.9,
} as const

export const ANIMATION_CONFIG = Object.fromEntries(
  Object.entries(ANIMATION_DELAYS).map(([key, delay]) => [key, { delay }]),
) as { [K in keyof typeof ANIMATION_DELAYS]: { delay: number } }
