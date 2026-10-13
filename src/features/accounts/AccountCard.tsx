import { Link } from 'react-router-dom'
import { Pencil, Trash } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { useTranslation } from '@/i18n/useTranslation'
import { useMoney } from '@/hooks/useMoney'
import type { Account } from '@/types/api'

interface AccountCardProps {
  account: Account
  onEdit: () => void
  onDelete: () => void
}

/** Visual summary of a single account with quick edit/delete actions. */
export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const { t } = useTranslation()
  const money = useMoney()

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl p-5 glass">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: account.color }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${account.color}26`,
              color: account.color,
            }}
          >
            <AppIcon name={account.icon} size={22} />
          </span>
          <Link
            to={`/accounts/${account.id}`}
            className="block min-w-0 truncate pt-1 text-sm font-semibold text-slate-900 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400"
          >
            {account.title}
          </Link>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
            aria-label={t('accounts.editAria', { title: account.title })}
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
            aria-label={t('accounts.deleteAria', { title: account.title })}
          >
            <Trash className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {money.format(account.balance)}
      </p>

      {account.description.length > 0 && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {account.description}
        </p>
      )}

      <Link
        to={`/accounts/${account.id}`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
      >
        {t('common.viewDetails')} →
      </Link>
    </div>
  )
}