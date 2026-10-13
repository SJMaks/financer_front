import { Languages } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import type { Language } from '@/i18n'
import { cn } from '@/utils/cn'

interface LanguageSwitcherProps {
  /** `full` shows "EN / RU" labels; `compact` shows a single cycling button. */
  variant?: 'full' | 'compact'
  className?: string
}

const NEXT: Record<Language, Language> = { en: 'ru', ru: 'en' }

/** Toggles between English and Russian. */
export function LanguageSwitcher({
  variant = 'full',
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useTranslation()

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={() => setLanguage(NEXT[language])}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
          'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
          className,
        )}
        aria-label={t('common.language')}
        title={t('common.language')}
      >
        <Languages className="size-5" aria-hidden />
        <span className="uppercase lg:hidden">{language}</span>
      </button>
    )
  }

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="group"
      aria-label={t('common.language')}
    >
      <Languages className="mr-1 size-4 text-slate-400" aria-hidden />
      {(['en', 'ru'] as Language[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
            language === code
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}