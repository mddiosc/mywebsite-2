import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ABOUT_CONSTANTS, TRANSLATION_KEYS } from '../constants'
import type { AboutData, Stat } from '../types'

import { MAIN_TECHNOLOGIES } from '@/constants/technologies'

export const useAboutData = (): AboutData => {
  const { t } = useTranslation()

  const skills = useMemo(() => t(TRANSLATION_KEYS.SKILLS, { returnObjects: true }) as string[], [t])

  const stats = useMemo(
    (): Stat[] => [
      {
        label: t(TRANSLATION_KEYS.STATS.FRONTEND_YEARS),
        value: ABOUT_CONSTANTS.STATS.FRONTEND_YEARS,
      },
      {
        label: t(TRANSLATION_KEYS.STATS.TOURISM_EXPERIENCE),
        value: ABOUT_CONSTANTS.STATS.TOURISM_EXPERIENCE,
      },
      {
        label: t(TRANSLATION_KEYS.STATS.COMPLETED_PROJECTS),
        value: ABOUT_CONSTANTS.STATS.COMPLETED_PROJECTS,
      },
    ],
    [t],
  )

  const biographyParagraphs = useMemo(() => t(TRANSLATION_KEYS.BIOGRAPHY).split('\n\n'), [t])

  return {
    skills,
    stats,
    technologies: MAIN_TECHNOLOGIES,
    biographyParagraphs,
  }
}
