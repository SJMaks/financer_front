import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  ChartPie,
  Plus,
  Tag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Spinner'
import { useAccounts } from '@/features/accounts/accounts.hooks'
import { useMe } from '@/features/profile/profile.hooks'
import {
  IncomeExpenseChart,
  type MonthlyPoint,
} from '@/features/statistics/charts'
import { useUserStatistics } from '@/features/statistics/statistics.hooks'
import { useMoney } from '@/hooks/useMoney'
import { useTranslation } from '@/i18n/useTranslation'
import { formatMonth } from '@/utils/format'
import { cn } from '@/utils/cn'
import { RecentOperationsCard } from './RecentOperationsCard'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: ReactNode
  tone: 'brand' | 'income' | 'expense' | 'neutral'
}

const TONE_CLASSES: Record<StatCardProps['tone'], string> = {
  brand: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  income: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  expense: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  neutral: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
}

function StatCard({ label, value, hint, icon, tone }: StatCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {value}
            </p>
            {hint !== undefined && (
              <p className="mt-1 truncate text-xs text-slate-400">{hint}</p>
            )}
          </div>
          <span
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              TONE_CLASSES[tone],
            )}
          >
            {icon}
          </span>
        </div>
      </CardBody>
    </Card>
  )
}

export function DashboardPage() {
  const { t } = useTranslation()
  const money = useMoney()
  const { data: me } = useMe()
  const {
    data: accounts,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsFetchError,
    refetch: refetchAccounts,
  } = useAccounts()
  const {
    data: months,
    isLoading: statsLoading,
    isError: statsError,
    error: statsFetchError,
    refetch: refetchStats,
  } = useUserStatistics()

  const allAccounts = accounts ?? []
  const totalBalance = allAccounts.reduce(
    (acc, account) => acc + account.balance,
    0,
  )

  const summary = summarizeMonths(months)
  const firstName = me?.full_name?.split(' ')[0]

  const greetingText = (() => {
    const hour = new Date().getHours()
    if (hour < 5) return t('dashboard.greetingNight')
    if (hour < 12) return t('dashboard.greetingMorning')
    if (hour < 18) return t('dashboard.greetingAfternoon')
    return t('dashboard.greetingEvening')
  })()

  if (accountsError) {
    return (
      <ErrorState
        error={accountsFetchError}
        title={t('errors.genericTitle')}
        onRetry={() => void refetchAccounts()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          {greetingText}
          {firstName !== undefined && firstName.length > 0
            ? `, ${firstName}`
            : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* -------- Summary cards -------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {accountsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))
        ) : (
          <>
            <StatCard
              label={t('dashboard.totalBalance')}
              value={money.format(totalBalance)}
              hint={
                allAccounts.length === 1
                  ? t('dashboard.accountsCountOne')
                  : t('dashboard.accountsCount', { count: allAccounts.length })
              }
              icon={<Wallet className="size-5" />}
              tone="brand"
            />
            <StatCard
              label={t('dashboard.netProfit')}
              value={summary ? money.format(summary.totalProfit) : '—'}
              hint={summary ? t('dashboard.allTime') : t('dashboard.noDataYet')}
              icon={<ChartPie className="size-5" />}
              tone={summary && summary.totalProfit >= 0 ? 'neutral' : 'expense'}
            />
            <StatCard
              label={t('dashboard.latestIncome')}
              value={summary?.latest ? money.format(summary.latest.income) : '—'}
              hint={
                summary?.latest
                  ? formatMonth(summary.latest.month)
                  : t('dashboard.noDataYet')
              }
              icon={<TrendingUp className="size-5" />}
              tone="income"
            />
            <StatCard
              label={t('dashboard.latestExpense')}
              value={summary?.latest ? money.format(summary.latest.expense) : '—'}
              hint={
                summary?.latest
                  ? formatMonth(summary.latest.month)
                  : t('dashboard.noDataYet')
              }
              icon={<TrendingDown className="size-5" />}
              tone="expense"
            />
          </>
        )}
      </div>

      {/* -------- Quick actions -------- */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/accounts"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-sky-900/20 transition-all hover:from-sky-500 hover:to-blue-600"
        >
          <Plus className="size-4" />
          {t('dashboard.manageAccounts')}
        </Link>
        <Link
          to="/categories"
          className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <Tag className="size-4" />
          {t('nav.categories')}
        </Link>
        <Link
          to="/statistics"
          className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <ChartPie className="size-4" />
          {t('nav.statistics')}
        </Link>
      </div>

      {/* -------- Accounts + recent activity -------- */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="h-full">
          <CardHeader
            title={t('nav.accounts')}
            description={t('dashboard.accountsDesc')}
            actions={
              <Link
                to="/accounts"
                className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                {t('dashboard.manage')}
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
          <CardBody className="p-0">
            {!accountsLoading && allAccounts.length === 0 && (
              <EmptyState
                icon={<Wallet className="size-6" />}
                title={t('accounts.noAccountsTitle')}
                description={t('accounts.noAccountsDescription')}
                action={
                  <Link
                    to="/accounts"
                    className="inline-flex rounded-lg bg-gradient-to-b from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md shadow-sky-900/20 transition-all hover:from-sky-500 hover:to-blue-600"
                  >
                    {t('accounts.createAccount')}
                  </Link>
                }
              />
            )}

            {!accountsLoading && allAccounts.length > 0 && (
              <ul className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
                {allAccounts.slice(0, 6).map((account) => (
                  <li key={account.id}>
                    <Link
                      to={`/accounts/${account.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/40"
                    >
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${account.color}26`,
                          color: account.color,
                        }}
                      >
                        <AppIcon name={account.icon} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                          {account.title}
                        </span>
                        {account.description.length > 0 && (
                          <span className="block truncate text-xs text-slate-400">
                            {account.description}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {money.format(account.balance)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {accountsLoading && (
              <div className="space-y-3 p-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-full" />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <RecentOperationsCard accounts={allAccounts} />
      </div>

      {/* -------- Income vs expense chart -------- */}
      <Card>
        <CardHeader
          title={t('statistics.incomeVsExpense')}
          description={t('dashboard.statsDesc')}
          actions={
            <Link
              to="/statistics"
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              {t('dashboard.fullStatistics')}
              <ArrowRight className="size-3.5" />
            </Link>
          }
        />
        <CardBody>
          {statsLoading && <Skeleton className="h-72 w-full" />}
          {statsError && (
            <ErrorState
              error={statsFetchError}
              onRetry={() => void refetchStats()}
            />
          )}
          {!statsLoading && !statsError && months !== undefined && (
            <>
              {months.length === 0 ? (
                <EmptyState
                  icon={<ChartPie className="size-6" />}
                  title={t('statistics.noDataTitle')}
                  description={t('statistics.noDataDescription')}
                />
              ) : (
                <IncomeExpenseChart
                  currency={money.currency}
                  data={[...months].sort((a, b) =>
                    a.month.localeCompare(b.month),
                  )}
                />
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

interface DashboardSummary {
  totalProfit: number
  latest: MonthlyPoint | undefined
}

/** Aggregates the /statistics response for the dashboard cards. */
function summarizeMonths(
  months: MonthlyPoint[] | undefined,
): DashboardSummary | null {
  if (!months || months.length === 0) return null

  const totalProfit = months.reduce((acc, row) => acc + row.profit, 0)
  const latest = [...months]
    .sort((a, b) => a.month.localeCompare(b.month))
    .at(-1)

  return { totalProfit, latest }
}

