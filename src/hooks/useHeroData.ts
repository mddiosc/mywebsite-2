import { useTranslation } from 'react-i18next'

export const useHeroData = () => {
  const { t, i18n } = useTranslation()

  return {
    title: t('components.hero.title'),
    subtitle: t('components.hero.subtitle'),
    announcement: t('components.hero.announcement'),
    readMore: t('components.hero.readMore'),
    language: i18n.language,
  }
}
