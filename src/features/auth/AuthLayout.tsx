import type { ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/i18n/useTranslation'
import { BrandMark } from '@/layouts/Navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/uiSlice'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  /** Link/footer rendered below the card. */
  footer?: ReactNode
}

/** Centered frosted shell shared by the login and registration pages. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-10">
      {/* Frost glow orbs behind the card */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-40 size-[26rem] rounded-full bg-gradient-to-br from-sky-300/50 to-blue-400/30 blur-3xl" />
        <div className="absolute -bottom-48 -right-28 size-[32rem] rounded-full bg-gradient-to-br from-cyan-300/40 to-sky-500/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/70 to-sky-200/40 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-1">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
          aria-label={
            theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')
          }
        >
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <BrandMark />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">{children}</div>

        {footer !== undefined && (
          <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}