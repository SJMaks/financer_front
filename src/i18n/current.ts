import type { Language } from './index'

function initialLanguage(): Language {
  const stored = localStorage.getItem('financer.language')
  if (stored === 'en' || stored === 'ru') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

/**
 * Module-level reference to the active language, so non-React code
 * (Axios error handling, number formatting) can produce localized text.
 */
let currentLanguage: Language = initialLanguage()

export function setCurrentLanguage(language: Language): void {
  currentLanguage = language
}

export function getCurrentLanguage(): Language {
  return currentLanguage
}