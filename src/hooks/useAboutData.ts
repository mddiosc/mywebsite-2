import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { MAIN_TECHNOLOGIES } from '../constants/technologies'

export interface Stat {
  label: string
  value: string
}

export const useAboutData = () => {
  const { t } = useTranslation()

  const skills = useMemo(
    () => t('pages.about.skills.items', { returnObjects: true }) as string[],
    [t],
  )

  const stats = useMemo(
    (): Stat[] => [
      { label: t('pages.about.stats.frontendYears'), value: '5+' },
      { label: t('pages.about.stats.tourismExperience'), value: '14' },
      { label: t('pages.about.stats.completedProjects'), value: '20+' },
    ],
    [t],
  )

  const biographyParagraphs = useMemo(() => t('pages.about.biography.content').split('\n\n'), [t])

  return {
    skills,
    stats,
    technologies: MAIN_TECHNOLOGIES,
    biographyParagraphs,
  }
}
