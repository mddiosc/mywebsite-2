import type { Variants, Transition } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export const slideIn: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 10 },
  visible: { scale: 1, opacity: 1, y: 0 },
}

export const commonTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

export const smoothTransition: Transition = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

export const heroTransition: Transition = {
  duration: 0.7,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}
