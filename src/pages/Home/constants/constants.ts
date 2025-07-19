/**
 * Constants for Home page components and animations
 */

/**
 * Animation delays and durations for Home page components
 */
export const HOME_CONSTANTS = {
  // Hero section animation delays
  HERO_TITLE_DELAY: 0.1,
  HERO_SUBTITLE_DELAY: 0.2,
  HERO_ANNOUNCEMENT_DELAY: 0.3,

  // Features section animation
  FEATURES_SECTION_DELAY: 0.4,
  FEATURES_GRID_STAGGER: 0.1,

  // Animation durations
  FADE_DURATION: 0.6,
  SCALE_DURATION: 0.4,

  // Layout constants
  HERO_MIN_HEIGHT: 'calc(100vh-8rem)',
  FEATURES_MARGIN_TOP: {
    base: 12, // mt-12
    sm: 16, // sm:mt-16
    lg: 20, // lg:mt-20
  },
} as const
