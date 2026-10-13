import { useMemo, type ReactNode } from 'react'
import { ChartPie } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Spinner'
import { useMoney } from '@/hooks/useMoney'
import { useTranslation } from '@/i18n/useTranslation'
import { formatMonth } from '@/utils/format'
import { cn } from '@/utils/cn'
import { IncomeExpenseChart, ProfitChart, type MonthlyPoint } from './charts'

interface SummaryCardProps {
  label: string
  value: string
  subtext?: string
  accent?: 'income' | 'expense' | 'profit' | 'neutral'
}

const ACCENT_CLASS: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  income: 'text-emerald-600 dark:text-emerald-400',
  expense: 'text-rose-600 dark:text-rose-400',
  profit: 'text-sky-600 dark:text-sky-400',
  neutral: 'text-slate-900 dark:text-slate-50',
}

function SummaryCard({ label, value, subtext, accent = 'neutral' }: SummaryCardProps) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className={cn('mt-1.5 text-2xl font-semibold tracking-tight', ACCENT_CLASS[accent])}>
          {value}
        </p>
        {subtext !== undefined && (
          <p className="mt-1 text-xs text-slate-400">{subtext}</p>
        )}
      </CardBody>
    </Card>
  )
}

interface MonthlyStatisticsViewProps {
  months: MonthlyPoint[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  /** Rendered in the empty state (e.g. a call to action). */
  emptyAction?: ReactNode
}

/**
 * Summary cards, Recharts visualizations and a monthly breakdown table
 * shared by the overall and per-account statistics pages.
 */
export function MonthlyStatisticsView({
  months,
  isLoading,
  isError,
  error,
  onRetry,
  emptyAction,
}: MonthlyStatisticsViewProps) {
  const { t } = useTranslation()
  const money = useMoney()

  const summary = useMemo(() => {
    const rows = months ?? []
    if (rows.length === 0) return null

    const totalIncome = rows.reduce((acc, row) => acc + row.income, 0)
    const totalExpense = rows.reduce((acc, row) => acc + row.expense, 0)
    const netProfit = rows.reduce((acc, row) => acc + row.profit, 0)
    const latest = [...rows].sort((a, b) => a.month.localeCompare(b.month)).at(-1)
    const best = [...rows].sort((a, b) => b.profit - a.profit)[0]

    return { totalIncome, totalExpense, netProfit, latest, best, count: rows.length }
  }, [months])

  const sortedRows = useMemo(
    () => [...(months ?? [])].sort((a, b) => b.month.localeCompare(a.month)),
    [months],
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />
  }

  if (summary === null || months === undefined) {
    return (
      <EmptyState
        icon={<ChartPie className="size-6" />}
        title={t('statistics.noDataTitle')}
        description={t('statistics.noDataDescription')}
        action={emptyAction}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={t('statistics.totalIncome')}
          value={money.format(summary.totalIncome)}
          accent="income"
          subtext={t('statistics.acrossMonths', { count: summary.count })}
        />
        <SummaryCard
          label={t('statistics.totalExpense')}
          value={money.format(summary.totalExpense)}
          accent="expense"
        />
        <SummaryCard
          label={t('statistics.netProfit')}
          value={money.format(summary.netProfit)}
          accent={summary.netProfit >= 0 ? 'profit' : 'expense'}
          subtext={
            summary.netProfit >= 0
              ? t('statistics.positiveOverall')
              : t('statistics.negativeOverall')
          }
        />
        <SummaryCard
          label={
            summary.latest
              ? t('statistics.latestMonth', {
                  month: formatMonth(summary.latest.month),
                })
              : t('statistics.latestMonthShort')
          }
          value={summary.latest ? money.format(summary.latest.profit) : '—'}
          accent={summary.latest && summary.latest.profit >= 0 ? 'profit' : 'expense'}
          subtext={
            summary.best
              ? t('statistics.best', {
                  month: formatMonth(summary.best.month),
                  value: money.format(summary.best.profit),
                })
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title={t('statistics.incomeVsExpense')}
            description={t('statistics.incomeVsExpenseDesc')}
          />
          <CardBody>
            <IncomeExpenseChart
              currency={money.currency}
              data={[...months].sort((a, b) => a.month.localeCompare(b.month))}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t('statistics.profit')}
            description={t('statistics.profitDesc')}
          />
          <CardBody>
            <ProfitChart
              currency={money.currency}
              data={[...months].sort((a, b) => a.month.localeCompare(b.month))}
            />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t('statistics.breakdown')}
          description={t('statistics.breakdownDesc')}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/50">
                <th className="px-5 py-3 font-medium">{t('statistics.month')}</th>
                <th className="px-3 py-3 text-right font-medium">
                  {t('statistics.income')}
                </th>
                <th className="px-3 py-3 text-right font-medium">
                  {t('statistics.expense')}
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  {t('statistics.profit')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
              {sortedRows.map((row) => (
                <tr
                  key={row.month}
                  className="hover:bg-white/50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {formatMonth(row.month)}
                  </td>
                  <td className="px-3 py-3 text-right text-emerald-600 dark:text-emerald-400">
                    {money.format(row.income)}
                  </td>
                  <td className="px-3 py-3 text-right text-rose-600 dark:text-rose-400">
                    {money.format(row.expense)}
                  </td>
                  <td
                    className={cn(
                      'px-5 py-3 text-right font-semibold',
                      row.profit >= 0
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-rose-600 dark:text-rose-400',
                    )}
                  >
                    {money.format(row.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
