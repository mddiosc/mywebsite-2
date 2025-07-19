export const HERO_ANIMATION_DELAYS = {
  title: 0.2,
  subtitle: 0.5,
  buttons: 0.8,
} as const

export const HERO_ANIMATION_CONFIG = {
  title: { delay: HERO_ANIMATION_DELAYS.title },
  subtitle: { delay: HERO_ANIMATION_DELAYS.subtitle },
  buttons: { delay: HERO_ANIMATION_DELAYS.buttons },
} as const
