import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Spinner'
import { useCategories } from '@/features/categories/categories.hooks'
import { useMoney } from '@/hooks/useMoney'
import { useOperationTypes } from '@/hooks/operationTypes'
import { useTranslation } from '@/i18n/useTranslation'
import { operationsApi } from '@/services/operationsApi'
import type { Account, Operation, OperationsQuery } from '@/types/api'
import {
  buildCategoryMap,
  buildOperationTypeMap,
  resolveOperationKindForCategory,
} from '@/utils/operation'

/** Latest operations per account (server-side sorted, newest first). */
const RECENT_QUERY: OperationsQuery = {
  limit: 6,
  sort: 'exec_at',
  order: 'desc',
}

/** Bound the number of parallel requests for very large account lists. */
const MAX_RECENT_ACCOUNTS = 10

interface RecentOperationsCardProps {
  accounts: Account[]
}

/**
 * Fetches the most recent operations of up to MAX_RECENT_ACCOUNTS accounts in
 * parallel (the API requires an account id to list operations), then merges
 * them into a single "recent activity" feed.
 */
export function RecentOperationsCard({ accounts }: RecentOperationsCardProps) {
  const { t } = useTranslation()
  const money = useMoney()
  const accountIds = accounts
    .slice(0, MAX_RECENT_ACCOUNTS)
    .map((account) => account.id)

  const results = useQueries({
    queries: accountIds.map((accountId) => ({
      queryKey: ['operations', accountId, 'list', RECENT_QUERY],
      queryFn: () => operationsApi.list(accountId, RECENT_QUERY),
    })),
  })

  const { data: categories } = useCategories()
  const { data: operationTypes } = useOperationTypes()

  const categoryMap = buildCategoryMap(categories ?? [])
  const typeMap = buildOperationTypeMap(operationTypes ?? [])
  const accountMap = new Map(accounts.map((account) => [account.id, account]))

  const isLoading = results.some((result) => result.isPending)

  const recent: Operation[] = results
    .flatMap((result) => result.data?.items ?? [])
    .sort((a, b) => b.exec_at.localeCompare(a.exec_at))
    .slice(0, 8)

  return (
    <Card className="h-full">
      <CardHeader
        title={t('dashboard.recentActivity')}
        description={t('dashboard.recentSubtitle')}
        actions={
          accounts.length > 0 ? (
            <Link
              to={`/accounts/${accounts[0].id}/operations`}
              className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              {t('common.viewAll')}
            </Link>
          ) : undefined
        }
      />
      <CardBody className="p-0">
        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        )}

        {!isLoading && recent.length === 0 && (
          <EmptyState
            icon={<Receipt className="size-6" />}
            title={t('operations.noOperationsTitle')}
            description={t('dashboard.noOperationsDescription')}
          />
        )}

        {!isLoading && recent.length > 0 && (
          <ul className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
            {recent.map((operation) => {
              const category = categoryMap.get(operation.category_id)
              const kind = resolveOperationKindForCategory(
                operation.category_id,
                categoryMap,
                typeMap,
              )
              const account = accountMap.get(operation.account_id)

              return (
                <li key={`${operation.account_id}-${operation.id}`}>
                  <Link
                    to={`/accounts/${operation.account_id}/operations`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50 dark:hover:bg-slate-800/40"
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${category?.color ?? '#64748b'}26`,
                        color: category?.color ?? '#64748b',
                      }}
                    >
                      <AppIcon name={category?.icon ?? 'receipt'} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                        {operation.title}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        {account !== undefined && <span>{account.title}</span>}
                        {category !== undefined && (
                          <>
                            <span aria-hidden>·</span>
                            <Badge color={category.color}>
                              {category.title}
                            </Badge>
                          </>
                        )}
                      </span>
                    </span>
                    <span
                      className={
                        kind === 'income'
                          ? 'shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400'
                          : 'shrink-0 text-sm font-semibold text-rose-600 dark:text-rose-400'
                      }
                    >
                      {money.formatSigned(operation.sum, kind)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}