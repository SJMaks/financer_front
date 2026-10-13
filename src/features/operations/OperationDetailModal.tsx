import { Pencil, Trash } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Spinner'
import { useCategories } from '@/features/categories/categories.hooks'
import { useMoney } from '@/hooks/useMoney'
import { useOperationTypes } from '@/hooks/operationTypes'
import { operationTypeLabel } from '@/i18n'
import { useTranslation } from '@/i18n/useTranslation'
import type { Operation } from '@/types/api'
import { formatDateTime } from '@/utils/format'
import {
  buildCategoryMap,
  buildOperationTypeMap,
  resolveOperationKindForCategory,
} from '@/utils/operation'
import { useOperation } from './operations.hooks'

interface OperationDetailModalProps {
  open: boolean
  accountId: number
  operationId: number | null
  onClose: () => void
  onEdit: (operation: Operation) => void
  onDelete: (operation: Operation) => void
}

/** Read-only view of a single operation (uses GET one operation endpoint). */
export function OperationDetailModal({
  open,
  accountId,
  operationId,
  onClose,
  onEdit,
  onDelete,
}: OperationDetailModalProps) {
  const { t } = useTranslation()
  const money = useMoney()
  const {
    data: operation,
    isLoading,
    isError,
    error,
    refetch,
  } = useOperation(
    accountId,
    open && operationId !== null ? operationId : undefined,
  )
  const { data: categories } = useCategories()
  const { data: operationTypes } = useOperationTypes()

  const categoryMap = buildCategoryMap(categories ?? [])
  const typeMap = buildOperationTypeMap(operationTypes ?? [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('operations.detailsTitle')}
      footer={
        operation !== undefined ? (
          <>
            <Button
              variant="danger"
              icon={<Trash className="size-4" />}
              onClick={() => onDelete(operation)}
            >
              {t('common.delete')}
            </Button>
            <Button
              icon={<Pencil className="size-4" />}
              onClick={() => onEdit(operation)}
            >
              {t('common.edit')}
            </Button>
          </>
        ) : undefined
      }
    >
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {operation !== undefined && renderDetails()}
    </Modal>
  )

  function renderDetails() {
    const op = operation as Operation
    const category = categoryMap.get(op.category_id)
    const typeTitle = category
      ? typeMap.get(category.operation_type_id)?.title
      : undefined
    const kind = resolveOperationKindForCategory(
      op.category_id,
      categoryMap,
      typeMap,
    )

    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${category?.color ?? '#64748b'}26`,
                color: category?.color ?? '#64748b',
              }}
            >
              <AppIcon name={category?.icon ?? 'receipt'} size={22} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                {op.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {category !== undefined ? (
                  <Badge color={category.color}>{category.title}</Badge>
                ) : (
                  <Badge>{t('common.uncategorized')}</Badge>
                )}
                {typeTitle !== undefined && (
                  <Badge>{operationTypeLabel(t, typeTitle)}</Badge>
                )}
              </div>
            </div>
          </div>
          <p
            className={
              kind === 'income'
                ? 'shrink-0 text-lg font-semibold text-emerald-600 dark:text-emerald-400'
                : 'shrink-0 text-lg font-semibold text-rose-600 dark:text-rose-400'
            }
          >
            {money.formatSigned(op.sum, kind)}
          </p>
        </div>

        <div className="border-t border-slate-200/60 pt-4 text-sm dark:border-slate-700/50">
          <p className="text-slate-400">{t('common.date')}</p>
          <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">
            {formatDateTime(op.exec_at)}
          </p>
        </div>

        {op.description.length > 0 && (
          <div className="border-t border-slate-200/60 pt-4 text-sm dark:border-slate-700/50">
            <p className="text-slate-400">{t('common.description')}</p>
            <p className="mt-0.5 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {op.description}
            </p>
          </div>
        )}
      </div>
    )
  }
}
