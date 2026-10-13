import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslation } from '@/i18n/useTranslation'
import { useLogout } from '@/features/auth/useLogout'
import { useMe } from '@/features/profile/profile.hooks'
import { BrandMark, LogoutButton, NavLinks, ThemeToggleButton } from './Navigation'
import { MobileDrawer } from './MobileDrawer'
import { MobileTopBar } from './MobileTopBar'

function DesktopSidebar({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation()

  return (
    <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-60 flex-col rounded-none border-y-0 border-l-0 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <BrandMark />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {t('common.appName')}
          </p>
          <p className="truncate text-xs text-slate-400">{t('common.tagline')}</p>
        </div>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto">
        <NavLinks />
      </div>

      <div className="space-y-1 border-t border-slate-200/60 p-3 dark:border-slate-700/50">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-xs text-slate-400">
            {t('common.language')}
          </span>
          <LanguageSwitcher />
        </div>
        <ThemeToggleButton className="w-full justify-start" />
        <LogoutButton onClick={onLogout} />
      </div>
    </aside>
  )
}

/**
 * Authenticated application shell: fixed sidebar on desktop, slide-over
 * drawer plus top bar on mobile, with profile access, theme switch and logout.
 */
export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const logout = useLogout()
  const { data: me } = useMe()
  const location = useLocation()

  /* Start each new page at the top. */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-svh">
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        meName={me?.full_name}
        meLogin={me?.login}
        onLogout={logout}
      />
      <DesktopSidebar onLogout={logout} />
      <MobileTopBar onOpenMenu={() => setMobileOpen(true)} />

      <div className="lg:pl-60">
        <main
          key={location.pathname}
          className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}