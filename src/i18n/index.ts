import { en, type TranslationKey } from './en'
import { ru } from './ru'

export type Language = 'en' | 'ru'

export const LANGUAGES: Language[] = ['en', 'ru']

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = {
  en,
  ru,
}

/** BCP-47 locale used for all Intl formatting. */
export const LOCALES: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
}

export type TranslationParams = Record<string, string | number>

/** Signature accepted by reusable logic (validators etc.) that needs texts. */
export type TFunction = (
  key: TranslationKey,
  params?: TranslationParams,
) => string

/**
 * Localizes a free-form operation-type title returned by the API
 * ('income' / 'expense'). Unknown titles are returned capitalized so new
 * backend types still render sensibly.
 */
export function operationTypeLabel(t: TFunction, title: string): string {
  const normalized = title.trim().toLowerCase()
  if (normalized === 'income') return t('operationType.income')
  if (normalized === 'expense') return t('operationType.expense')
  const trimmed = title.trim()
  if (trimmed.length === 0) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

/** Looks up a key and interpolates `{{param}}` placeholders. */
export function translate(
  language: Language,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  let text: string = DICTIONARIES[language][key] ?? key

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{{${name}}}`, String(value))
    }
  }

  return text
}

export type { TranslationKey }
export { en, ru }