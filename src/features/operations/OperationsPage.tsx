import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, Pencil, Receipt, Trash } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Spinner'
import { useAccount } from '@/features/accounts/accounts.hooks'
import { useCategories } from '@/features/categories/categories.hooks'
import { useMoney } from '@/hooks/useMoney'
import { useOperationTypes } from '@/hooks/operationTypes'
import { operationTypeLabel } from '@/i18n'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorStatus } from '@/services/error'
import type { Operation } from '@/types/api'
import { formatDate } from '@/utils/format'
import {
  buildCategoryMap,
  buildOperationTypeMap,
  resolveOperationKindForCategory,
} from '@/utils/operation'
import { cn } from '@/utils/cn'
import { OperationDetailModal } from './OperationDetailModal'
import { OperationFormModal } from './OperationFormModal'
import { OperationsFiltersBar } from './OperationsFiltersBar'
import { useDeleteOperation, useOperations } from './operations.hooks'
import { useOperationsFilters } from './useOperationsFilters'

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function OperationsPage() {
  const { accountId } = useParams()
  const { t } = useTranslation()
  const money = useMoney()
  const numericId = Number(accountId)
  const isValidId = Number.isInteger(numericId) && numericId > 0
  const resolvedAccountId = isValidId ? numericId : undefined

  const { data: account, isLoading: accountLoading } =
    useAccount(resolvedAccountId)
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: operationTypes, isLoading: typesLoading } =
    useOperationTypes()

  const { filters, setFilter, resetFilters, toQuery, hasActiveFilters } =
    useOperationsFilters()

  const query = useMemo(() => toQuery(), [toQuery])
  const {
    data: page,
    isLoading,
    isError,
    error,
    refetch,
  } = useOperations(resolvedAccountId, query)

  const deleteOperation = useDeleteOperation()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Operation | undefined>(undefined)
  const [deleting, setDeleting] = useState<Operation | undefined>(undefined)
  const [detailId, setDetailId] = useState<number | null>(null)

  const categoryMap = useMemo(
    () => buildCategoryMap(categories ?? []),
    [categories],
  )
  const typeMap = useMemo(
    () => buildOperationTypeMap(operationTypes ?? []),
    [operationTypes],
  )

  const typeOptions = useMemo(
    () => [
      { value: '', label: t('common.allTypes') },
      ...(operationTypes ?? []).map((type) => ({
        // The API filter expects the lowercase type value ('income'/'expense'),
        // while the label is localized for display.
        value: type.title.toLowerCase(),
        label: operationTypeLabel(t, type.title),
      })),
    ],
    [operationTypes, t],
  )

  const backLink = (
    <Link
      to={`/accounts/${numericId}`}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    >
      <ArrowLeft className="size-3.5" />
      {t('operations.backToAccount')}
    </Link>
  )

  if (!isValidId) {
    return (
      <div>
        <PageHeader title={t('nav.accounts')} />
        <ErrorState
          title={t('operations.invalidTitle')}
          message={t('operations.invalidMessage')}
        />
      </div>
    )
  }

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteOperation.mutate(
      { accountId: numericId, operationId: deleting.id },
      {
        onSuccess: () => {
          setDeleting(undefined)
          setDetailId(null)
        },
      },
    )
  }

  const showSkeleton =
    isLoading || categoriesLoading || typesLoading || accountLoading

  return (
    <div>
      <PageHeader
        eyebrow={backLink}
        title={
          account
            ? t('operations.titleWithAccount', { account: account.title })
            : t('nav.accounts')
        }
        description={t('operations.subtitle')}
        actions={
          <Button onClick={openCreate}>
            <span aria-hidden>+</span>
            {t('operations.newOperation')}
          </Button>
        }
      />

      <div className="space-y-4">
        <OperationsFiltersBar
          filters={filters}
          setFilter={setFilter}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          typeOptions={typeOptions}
          categories={categories ?? []}
          operationTypes={operationTypes ?? []}
        />

        <div className="overflow-hidden rounded-2xl glass">
          {showSkeleton && !isError && <TableSkeleton />}

          {isError && (
            <ErrorState
              error={error}
              title={
                getApiErrorStatus(error) === 404
                  ? t('operations.notFoundTitle')
                  : t('operations.loadErrorTitle')
              }
              onRetry={() => void refetch()}
            />
          )}

          {!showSkeleton && !isError && (page?.items.length ?? 0) === 0 && (
            <EmptyState
              icon={<Receipt className="size-6" />}
              title={
                hasActiveFilters
                  ? t('operations.noMatchTitle')
                  : t('operations.noOperationsTitle')
              }
              description={
                hasActiveFilters
                  ? t('operations.noMatchDescription')
                  : t('operations.noOperationsDescription')
              }
              action={
                hasActiveFilters ? (
                  <Button variant="outline" onClick={resetFilters}>
                    {t('common.clearFilters')}
                  </Button>
                ) : (
                  <Button onClick={openCreate}>
                    {t('operations.newOperation')}
                  </Button>
                )
              }
            />
          )}

          {!showSkeleton && !isError && (page?.items.length ?? 0) > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/50">
                      <th className="px-5 py-3 font-medium">
                        {t('operations.headerOperation')}
                      </th>
                      <th className="px-3 py-3 font-medium">
                        {t('operations.headerCategory')}
                      </th>
                      <th className="px-3 py-3 font-medium">
                        {t('operations.headerDate')}
                      </th>
                      <th className="px-3 py-3 text-right font-medium">
                        {t('operations.headerAmount')}
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60">
                    {page?.items.map((operation) => {
                      const category = categoryMap.get(operation.category_id)
                      const typeTitle = category
                        ? typeMap.get(category.operation_type_id)?.title
                        : undefined
                      const kind = resolveOperationKindForCategory(
                        operation.category_id,
                        categoryMap,
                        typeMap,
                      )

                      return (
                        <tr
                          key={operation.id}
                          className="transition-colors hover:bg-white/50 dark:hover:bg-slate-800/40"
                        >
                          <td className="px-5 py-3">
                            <button
                              type="button"
                              onClick={() => setDetailId(operation.id)}
                              className="flex min-w-0 items-center gap-3 text-left"
                            >
                              <span
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                                style={{
                                  backgroundColor: `${category?.color ?? '#64748b'}26`,
                                  color: category?.color ?? '#64748b',
                                }}
                              >
                                <AppIcon
                                  name={category?.icon ?? 'receipt'}
                                  size={16}
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                                  {operation.title}
                                </span>
                                {operation.description.length > 0 && (
                                  <span className="block max-w-[24ch] truncate text-xs text-slate-400 sm:max-w-[40ch]">
                                    {operation.description}
                                  </span>
                                )}
                              </span>
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <Badge color={category?.color}>
                              {category?.title ?? t('common.uncategorized')}
                            </Badge>
                            {typeTitle !== undefined && (
                              <span className="ml-1.5 hidden text-xs text-slate-400 lg:inline">
                                {operationTypeLabel(t, typeTitle)}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-slate-400">
                            {formatDate(operation.exec_at)}
                          </td>
                          <td
                            className={cn(
                              'whitespace-nowrap px-3 py-3 text-right font-semibold',
                              kind === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400',
                            )}
                          >
                            {money.formatSigned(operation.sum, kind)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setDetailId(operation.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white/70 hover:text-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                                aria-label={t('operations.viewAria', {
                                  title: operation.title,
                                })}
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditing(operation)
                                  setFormOpen(true)
                                }}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white/70 hover:text-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                                aria-label={t('operations.editAria', {
                                  title: operation.title,
                                })}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleting(operation)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                                aria-label={t('operations.deleteAria', {
                                  title: operation.title,
                                })}
                              >
                                <Trash className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {page !== undefined && (
                <Pagination
                  offset={page.offset}
                  limit={page.limit}
                  total={page.total}
                  onOffsetChange={(offset) =>
                    setFilter('offset', offset, { keepOffset: true })
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      <OperationFormModal
        open={formOpen}
        accountId={numericId}
        operation={editing}
        onClose={() => setFormOpen(false)}
      />

      <OperationDetailModal
        open={detailId !== null}
        accountId={numericId}
        operationId={detailId}
        onClose={() => setDetailId(null)}
        onEdit={(operation) => {
          setDetailId(null)
          setEditing(operation)
          setFormOpen(true)
        }}
        onDelete={(operation) => setDeleting(operation)}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        title={t('operations.deleteTitle')}
        message={t('operations.deleteMessage', {
          title: deleting?.title ?? '',
        })}
        confirmLabel={t('operations.deleteConfirm')}
        loading={deleteOperation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}


