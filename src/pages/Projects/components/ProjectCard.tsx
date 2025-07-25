import { motion } from 'framer-motion'

import { GitHubProject } from '@/types'

/**
 * Mapping of programming languages to their representative Tailwind CSS background colors
 */
const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-300',
  TypeScript: 'bg-blue-400',
  HTML: 'bg-orange-500',
  CSS: 'bg-purple-500',
  Python: 'bg-green-500',
  Java: 'bg-red-500',
  Ruby: 'bg-red-600',
  PHP: 'bg-indigo-400',
  Go: 'bg-blue-500',
  Rust: 'bg-amber-600',
  Swift: 'bg-orange-600',
  Kotlin: 'bg-purple-600',
  default: 'bg-gray-400',
}

interface ProjectCardProps {
  project: GitHubProject
  delay: number
}

/**
 * Component that displays a GitHub project as a card
 * Shows project details including name, description, languages, stars and forks
 *
 * @param project - The GitHub project to display
 * @param delay - Animation delay for the card entrance
 */
const ProjectCard = ({ project, delay }: ProjectCardProps) => {
  const formattedDate = new Date(project.updated_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Determine the color for the primary language
  const languageColor =
    project.language && languageColors[project.language]
      ? languageColors[project.language]
      : languageColors['default']

  // Process languages if available
  const hasMultipleLanguages = project.languages && Object.keys(project.languages).length > 0

  // Calculate total bytes to determine percentages
  const totalBytes = project.languages
    ? Object.values(project.languages).reduce((sum, bytes) => sum + bytes, 0)
    : 0

  // Sort languages by byte count (descending) and limit to top 4
  const sortedLanguages = project.languages
    ? Object.entries(project.languages)
        .sort(([, bytesA], [, bytesB]) => bytesB - bytesA)
        .slice(0, 4)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={(e) => {
        // Only navigate to GitHub if not clicking on an interactive element
        const target = e.target as HTMLElement
        if (!target.closest('a')) {
          window.open(project.html_url, '_blank')
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-h-3 aspect-w-4 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-40">
        <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-indigo-100 object-cover object-center sm:h-full sm:w-full">
          <div className="flex h-full items-center justify-center">
            {/* Project icon/illustration */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-indigo-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            <a href={project.html_url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          </h3>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-gray-600">
              {project.description ?? 'No description available'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            {/* Display multiple languages if available */}
            {hasMultipleLanguages ? (
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {/* Languages progress bar */}
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    {sortedLanguages.map(([lang, bytes]) => {
                      const percentage = (bytes / totalBytes) * 100
                      const langColor = languageColors[lang] ?? languageColors['default']
                      return (
                        <div
                          key={lang}
                          className={`${langColor ?? ''} h-full`}
                          style={{ width: `${percentage.toString()}%` }}
                          title={`${lang}: ${percentage.toFixed(1)}%`}
                        />
                      )
                    })}
                  </div>
                  {/* Languages legend */}
                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                    {sortedLanguages.map(([lang, bytes]) => {
                      const percentage = ((bytes / totalBytes) * 100).toFixed(1)
                      const langColor = languageColors[lang] ?? languageColors['default']
                      return (
                        <div key={lang} className="flex items-center gap-x-1">
                          <div className={`h-2 w-2 rounded-full ${langColor ?? ''}`} />
                          <span className="text-xs text-gray-500">
                            {lang} {percentage}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Display only primary language if multiple languages not available
              <div className="flex items-center gap-x-2">
                <div className={`h-3 w-3 rounded-full ${languageColor ?? ''}`} />
                <p className="text-sm text-gray-500">
                  {project.language || 'No language specified'}
                </p>
              </div>
            )}

            {/* Topics/Tags - Flexible height container */}
            <div className="mt-auto">
              {project.topics.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {project.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                    >
                      {topic}
                    </span>
                  ))}
                  {project.topics.length > 4 && (
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500">
                      +{project.topics.length - 4}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom section - always at the bottom */}
          <div className="mt-6 space-y-4">
            <p className="text-xs text-gray-500">Updated on {formattedDate}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                {/* Stars count */}
                <div className="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  <span className="text-xs text-gray-500">{project.stargazers_count}</span>
                </div>
                {/* Forks count */}
                <div className="flex items-center gap-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                  <span className="text-xs text-gray-500">{project.forks_count}</span>
                </div>
              </div>

              {/* Demo Link */}
              {project.homepage && project.homepage.trim() !== '' && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-x-1 rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                    />
                  </svg>
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
