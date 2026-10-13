import { Menu } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/i18n/useTranslation'
import { BrandMark, ThemeToggleButton } from './Navigation'

/** Compact top bar shown on small screens. */
export function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t } = useTranslation()

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between rounded-none border-x-0 border-t-0 px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60"
          aria-label={t('nav.openMenu')}
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {t('common.appName')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <LanguageSwitcher variant="compact" />
        <ThemeToggleButton className="px-2" />
      </div>
    </header>
  )
}