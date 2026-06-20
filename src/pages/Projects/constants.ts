/**
 * Constants for the Projects page
 */

export const PROJECTS_CONSTANTS = {
  SKELETON_COUNT: 6,
  MAX_TOPICS_DISPLAY: 20,
  ANIMATION_DELAYS: {
    HEADER: 0.2,
    STATISTICS: 0.3,
    GRID: 0.4,
    TOPICS: 0.5,
    CARD_BASE: 0.1,
    CARD_INCREMENT: 0.05,
  },
  GRID_RESPONSIVE: {
    BASE: 'grid-cols-1',
    SM: 'sm:grid-cols-2',
    LG: 'lg:grid-cols-3',
  },
  STATISTICS_GRID: {
    BASE: 'grid-cols-2',
    SM: 'sm:grid-cols-4',
    LG: 'lg:grid-cols-5',
  },
} as const

export const TRANSLATION_KEYS = {
  PORTFOLIO: 'pages.projects.portfolio',
  TITLE: 'pages.projects.title',
  DESCRIPTION: 'pages.projects.description',
  STATISTICS: {
    FEATURED_PROJECTS: 'pages.projects.statistics.featuredProjects',
    GITHUB_STARS: 'pages.projects.statistics.githubStars',
    TECHNOLOGIES: 'pages.projects.statistics.technologies',
    TOTAL_FORKS: 'pages.projects.statistics.totalForks',
    LIVE_DEMOS: 'pages.projects.statistics.liveDemos',
  },
  TOPICS: {
    TITLE: 'pages.projects.topics.title',
    DESCRIPTION: 'pages.projects.topics.description',
  },
  ERROR: {
    TITLE: 'pages.projects.error.title',
    MESSAGE: 'pages.projects.error.message',
  },
  EMPTY: {
    TITLE: 'pages.projects.empty.title',
    MESSAGE: 'pages.projects.empty.message',
  },
} as const

/**
 * Mapping of programming languages to their representative colors (bg and text)
 */
export const languageColors: Record<string, { bg: string; text: string; glow: string }> = {
  JavaScript: {
    bg: 'bg-yellow-400/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    glow: 'shadow-yellow-500/20',
  },
  TypeScript: {
    bg: 'bg-blue-400/20',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/20',
  },
  HTML: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-500/20',
  },
  CSS: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  Python: {
    bg: 'bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    glow: 'shadow-green-500/20',
  },
  Java: { bg: 'bg-red-500/20', text: 'text-red-600 dark:text-red-400', glow: 'shadow-red-500/20' },
  Ruby: { bg: 'bg-red-600/20', text: 'text-red-600 dark:text-red-400', glow: 'shadow-red-600/20' },
  PHP: {
    bg: 'bg-indigo-400/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  Go: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
  Rust: {
    bg: 'bg-amber-600/20',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-600/20',
  },
  Swift: {
    bg: 'bg-orange-600/20',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-600/20',
  },
  Kotlin: {
    bg: 'bg-purple-600/20',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-600/20',
  },
  default: {
    bg: 'bg-gray-400/20',
    text: 'text-gray-600 dark:text-gray-400',
    glow: 'shadow-gray-500/20',
  },
}

/** Language bar colors for the progress indicator */
export const languageBarColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  Ruby: 'bg-red-600',
  PHP: 'bg-indigo-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-amber-600',
  Swift: 'bg-orange-600',
  Kotlin: 'bg-purple-600',
  default: 'bg-gray-400',
}
