import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'

import translationEN from '../locales/en/translation.json'
import translationES from '../locales/es/translation.json'

void i18n.use(initReactI18next).init({
  lng: 'es', // Set a fixed language for tests
  resources: {
    en: {
      translation: translationEN,
    },
    es: {
      translation: translationES,
    },
  },
  fallbackLng: 'es',
  supportedLngs: ['es', 'en'],
  interpolation: {
    escapeValue: false,
  },
  // Remove language detection for tests
})

export default i18n
