import { NavLink } from 'react-router-dom'
import {
  ChartPie,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Tag,
  User,
  Wallet,
} from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleTheme } from '@/store/uiSlice'
import { cn } from '@/utils/cn'

interface NavItem {
  to: string
  labelKey: 'nav.dashboard' | 'nav.accounts' | 'nav.categories' | 'nav.statistics' | 'nav.profile'
  icon: typeof Wallet
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/accounts', labelKey: 'nav.accounts', icon: Wallet },
  { to: '/categories', labelKey: 'nav.categories', icon: Tag },
  { to: '/statistics', labelKey: 'nav.statistics', icon: ChartPie },
  { to: '/profile', labelKey: 'nav.profile', icon: User },
]

/** Primary navigation links, shared by the desktop sidebar and mobile drawer. */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
            )
          }
        >
          <item.icon className="size-5 shrink-0" aria-hidden />
          {t(item.labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}

/** Light/dark theme switch used in the sidebar, top bar and drawer. */
export function ThemeToggleButton({ className }: { className?: string }) {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/60 hover:text-slate-900',
        'dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
        className,
      )}
      aria-label={
        theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')
      }
    >
      {theme === 'dark' ? (
        <Sun className="size-5" aria-hidden />
      ) : (
        <Moon className="size-5" aria-hidden />
      )}
      <span className="lg:hidden">
        {theme === 'dark' ? t('nav.lightTheme') : t('nav.darkTheme')}
      </span>
    </button>
  )
}

/** Product brand mark (also used on guest pages). */
export function BrandMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/40">
      <AppIcon name="trend" className="size-5" size={20} />
    </span>
  )
}

/** Frontend-only logout action (there is no logout endpoint). */
export function LogoutButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
    >
      <LogOut className="size-5" aria-hidden />
      {t('nav.logOut')}
    </button>
  )
}