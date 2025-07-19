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
