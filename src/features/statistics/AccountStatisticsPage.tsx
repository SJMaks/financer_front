import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAccount } from '@/features/accounts/accounts.hooks'
import { useTranslation } from '@/i18n/useTranslation'
import { MonthlyStatisticsView } from './MonthlyStatisticsView'
import { useAccountStatistics } from './statistics.hooks'

/** Monthly statistics for a single account (GET /accounts/{id}/statistics). */
export function AccountStatisticsPage() {
  const { t } = useTranslation()
  const { accountId } = useParams()
  const numericId = Number(accountId)
  const isValidId = Number.isInteger(numericId) && numericId > 0
  const resolvedId = isValidId ? numericId : undefined

  const { data: account } = useAccount(resolvedId)
  const { data: months, isLoading, isError, error, refetch } =
    useAccountStatistics(resolvedId)

  const backLink = (
    <Link
      to={isValidId ? `/accounts/${numericId}` : '/accounts'}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    >
      <ArrowLeft className="size-3.5" />
      {t('operations.backToAccount')}
    </Link>
  )

  if (!isValidId) {
    return (
      <div>
        <PageHeader title={t('statistics.title')} eyebrow={backLink} />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('statistics.invalidAccount')}
        </p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow={backLink}
        title={
          account
            ? t('statistics.titleWithAccount', { account: account.title })
            : t('statistics.title')
        }
        description={t('statistics.accountSubtitle')}
      />

      <MonthlyStatisticsView
        months={months}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        emptyAction={
          <Link
            to={`/accounts/${numericId}/operations`}
            className="inline-flex rounded-lg bg-gradient-to-b from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-sky-900/20 transition-all hover:from-sky-500 hover:to-blue-600"
          >
            {t('statistics.addOperation')}
          </Link>
        }
      />
    </div>
  )
}