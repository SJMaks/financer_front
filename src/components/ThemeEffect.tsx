import { useEffect } from 'react'
import { LOCALES } from '@/i18n'
import { setCurrentLanguage } from '@/i18n/current'
import { useAppSelector } from '@/store/hooks'
import { setFormattingLocale } from '@/utils/format'

/**
 * Mirrors the Redux preferences onto the document:
 * theme (class + color-scheme) and language (lang attribute + Intl locale).
 */
export function ThemeEffect() {
  const theme = useAppSelector((state) => state.ui.theme)
  const language = useAppSelector((state) => state.ui.language)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    setCurrentLanguage(language)
    setFormattingLocale(LOCALES[language])
  }, [language])

  return null
}