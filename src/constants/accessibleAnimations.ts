/**
 * Accessible motion variants optimized for reduced motion users
 */
export const accessibleVariants = {
  // Subtle movements instead of large displacements
  subtle: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },

  // No movement, just opacity changes
  static: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Minimal slide effects
  slideSubtle: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
}

/**
 * Accessible transition configs with comfortable durations
 */
export const accessibleTransitions = {
  comfortable: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1], // Smooth easing
  },

  instant: {
    duration: 0.1,
  },

  gentle: {
    duration: 0.15,
    ease: 'easeOut',
  },
}
