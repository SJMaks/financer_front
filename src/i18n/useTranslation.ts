import { useCallback, useMemo } from 'react'
import {
  LOCALES,
  translate,
  type Language,
  type TranslationKey,
  type TranslationParams,
} from './index'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLanguage } from '@/store/uiSlice'

/**
 * Translation hook backed by the Redux `ui.language` state. The selected
 * language is persisted across reloads via the ui slice.
 */
export function useTranslation() {
  const language = useAppSelector((state) => state.ui.language)
  const dispatch = useAppDispatch()

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      translate(language, key, params),
    [language],
  )

  const locale = useMemo(() => LOCALES[language], [language])

  const changeLanguage = useCallback(
    (next: Language) => dispatch(setLanguage(next)),
    [dispatch],
  )

  return { t, language, locale, setLanguage: changeLanguage }
}