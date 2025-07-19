import { Variants } from 'framer-motion'

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

export const commonTransition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export const smoothTransition = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94],
}

export const heroTransition = {
  duration: 0.7,
  ease: [0.25, 0.46, 0.45, 0.94],
}
