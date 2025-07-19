/**
 * Types for Home page components and data structures
 */

/**
 * Interface for hero data structure
 */
export interface HeroData {
  title: string
  subtitle: string
  announcement: string
  readMore: string
  language: string
}

/**
 * Interface for feature items in HomeFeatures component
 */
export interface FeatureItem {
  icon: string
  title: string
  description: string
}

/**
 * Interface for Home page props (if needed for future extensions)
 */
// export interface HomePageProps {
//   // Future props can be added here
// }
