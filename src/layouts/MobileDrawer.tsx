import { X } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/i18n/useTranslation'
import { BrandMark, LogoutButton, NavLinks, ThemeToggleButton } from './Navigation'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  meName?: string
  meLogin?: string
  onLogout: () => void
}

/** Slide-over navigation drawer for small screens. */
export function MobileDrawer({
  open,
  onClose,
  meName,
  meLogin,
  onLogout,
}: MobileDrawerProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
    >
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="glass-strong absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col rounded-none border-y-0 border-l-0">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {t('common.appName')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800/60"
            aria-label={t('nav.closeMenu')}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <NavLinks onNavigate={onClose} />
        </div>

        <div className="space-y-1 border-t border-slate-200/60 p-3 dark:border-slate-700/50">
          <div className="border-b border-slate-200/60 px-3 pb-3 dark:border-slate-700/50">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {meName ?? t('profile.account')}
            </p>
            {meLogin !== undefined && (
              <p className="truncate text-xs text-slate-400">{meLogin}</p>
            )}
          </div>
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs text-slate-400">
              {t('common.language')}
            </span>
            <LanguageSwitcher />
          </div>
          <ThemeToggleButton className="w-full justify-start" />
          <div onClick={onClose}>
            <LogoutButton onClick={onLogout} />
          </div>
        </div>
      </div>
    </div>
  )
}