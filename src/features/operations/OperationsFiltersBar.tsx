import { useState } from 'react'
import { ChevronDown, Funnel, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CategoryPicker } from '@/components/ui/CategoryPicker'
import { Select } from '@/components/ui/Select'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'
import type { Category, OperationType } from '@/types/api'
import type {
  OperationsFilterKey,
  OperationsFiltersState,
} from './useOperationsFilters'

interface OperationsFiltersBarProps {
  filters: OperationsFiltersState
  setFilter: <K extends OperationsFilterKey>(
    key: K,
    value: OperationsFiltersState[K],
  ) => void
  resetFilters: () => void
  hasActiveFilters: boolean
  typeOptions: { value: string; label: string }[]
  categories: Category[]
  operationTypes: OperationType[]
}

/**
 * Server-driven filter controls for GET /accounts/{id}/operations:
 * type, category, date range, sort field and sort order.
 */
export function OperationsFiltersBar({
  filters,
  setFilter,
  resetFilters,
  hasActiveFilters,
  typeOptions,
  categories,
  operationTypes,
}: OperationsFiltersBarProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="relative z-20 rounded-2xl p-4 glass">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls="operations-filters"
          title={expanded ? t('common.hideFilters') : t('common.showFilters')}
          className="-m-1 flex items-center gap-2 rounded-lg p-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
        >
          <Funnel className="size-3.5" />
          {t('common.filtersAndSorting')}
          <ChevronDown
            aria-hidden
            className={cn(
              'size-3.5 transition-transform duration-200',
              expanded ? 'rotate-180' : 'rotate-0',
            )}
          />
        </button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            icon={<X className="size-3.5" />}
          >
            {t('common.clearFilters')}
          </Button>
        )}
      </div>

      {expanded && (
        <div
          id="operations-filters"
          className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <Select
            label={t('common.type')}
            value={filters.type}
            options={typeOptions}
            onChange={(event) => setFilter('type', event.target.value)}
          />

          <CategoryPicker
            label={t('operations.categoryFilter')}
            value={filters.categoryId > 0 ? filters.categoryId : null}
            onChange={(categoryId) => setFilter('categoryId', categoryId ?? 0)}
            categories={categories}
            operationTypes={operationTypes}
            allLabel={t('common.allCategories')}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="filter-min-date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t('operations.fromDate')}
            </label>
            <input
              id="filter-min-date"
              type="date"
              value={filters.minDate}
              onChange={(event) => setFilter('minDate', event.target.value)}
              className="field block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-2 focus:outline-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="filter-max-date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t('operations.toDate')}
            </label>
            <input
              id="filter-max-date"
              type="date"
              value={filters.maxDate}
              onChange={(event) => setFilter('maxDate', event.target.value)}
              className="field block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-2 focus:outline-sky-500"
            />
          </div>

          <Select
            label={t('operations.sortBy')}
            value={filters.sort}
            options={[
              { value: 'exec_at', label: t('operations.sortDate') },
              { value: 'sum', label: t('operations.sortAmount') },
            ]}
            onChange={(event) =>
              setFilter('sort', event.target.value as OperationsFiltersState['sort'])
            }
          />

          <Select
            label={t('operations.order')}
            value={filters.order}
            options={[
              { value: 'desc', label: t('operations.orderDesc') },
              { value: 'asc', label: t('operations.orderAsc') },
            ]}
            onChange={(event) =>
              setFilter('order', event.target.value as OperationsFiltersState['order'])
            }
          />
        </div>
      )}
    </div>
  )
}