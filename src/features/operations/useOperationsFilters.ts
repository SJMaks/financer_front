import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { OperationsQuery, OperationSortField, SortOrder } from '@/types/api'
import { dateBoundaryToRfc3339 } from '@/utils/format'

export interface OperationsFiltersState {
  /** Operation type value accepted by the API ('' = all). */
  type: string
  /** Category id (''/0 = all). */
  categoryId: number
  /** `YYYY-MM-DD` (empty = unbounded). */
  minDate: string
  /** `YYYY-MM-DD` (empty = unbounded). */
  maxDate: string
  sort: OperationSortField
  order: SortOrder
  limit: number
  offset: number
}

export type OperationsFilterKey = keyof OperationsFiltersState

const DEFAULT_SORT: OperationSortField = 'exec_at'
const DEFAULT_ORDER: SortOrder = 'desc'
export const DEFAULT_LIMIT = 10

/**
 * Maps state keys to the actual URL/query parameter names (the same names the
 * backend expects: `category_id`, `min_date`, ...).
 */
const PARAM_NAMES: Record<OperationsFilterKey, string> = {
  type: 'type',
  categoryId: 'category_id',
  minDate: 'min_date',
  maxDate: 'max_date',
  sort: 'sort',
  order: 'order',
  limit: 'limit',
  offset: 'offset',
}

function readNumber(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

/**
 * Filter/pagination state backed by URL search params so that operation lists
 * are shareable and survive reloads. All values are sent to the backend as
 * query parameters (server-side filtering/sorting/pagination).
 */
export function useOperationsFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<OperationsFiltersState>(
    () => ({
      type: searchParams.get('type') ?? '',
      categoryId: readNumber(searchParams.get('category_id'), 0),
      minDate: searchParams.get('min_date') ?? '',
      maxDate: searchParams.get('max_date') ?? '',
      sort:
        searchParams.get('sort') === 'sum' ? 'sum' : DEFAULT_SORT,
      order: searchParams.get('order') === 'asc' ? 'asc' : DEFAULT_ORDER,
      limit: readNumber(searchParams.get('limit'), DEFAULT_LIMIT) || DEFAULT_LIMIT,
      offset: readNumber(searchParams.get('offset'), 0),
    }),
    [searchParams],
  )

  const setFilter = useCallback(
    <K extends OperationsFilterKey>(
      key: K,
      value: OperationsFiltersState[K],
      options?: { keepOffset?: boolean },
    ) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const param = PARAM_NAMES[key]
          const raw =
            value === 0 || value === '' || value === undefined
              ? null
              : String(value)
          if (raw === null) next.delete(param)
          else next.set(param, raw)

          // A category from another operation type no longer applies.
          if (key === 'type') next.delete(PARAM_NAMES.categoryId)

          // Any filter change restarts pagination unless stated otherwise.
          if (!options?.keepOffset) next.delete(PARAM_NAMES.offset)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  /** Builds the exact query object for GET /accounts/{id}/operations. */
  const toQuery = useCallback((): OperationsQuery => {
    const query: OperationsQuery = {
      limit: filters.limit,
      offset: filters.offset,
      sort: filters.sort,
      order: filters.order,
    }
    if (filters.type !== '') query.type = filters.type
    if (filters.categoryId > 0) query.category_id = filters.categoryId
    if (filters.minDate !== '') {
      query.min_date = dateBoundaryToRfc3339(filters.minDate, false)
    }
    if (filters.maxDate !== '') {
      query.max_date = dateBoundaryToRfc3339(filters.maxDate, true)
    }
    return query
  }, [filters])

  const hasActiveFilters =
    filters.type !== '' ||
    filters.categoryId > 0 ||
    filters.minDate !== '' ||
    filters.maxDate !== ''

  return { filters, setFilter, resetFilters, toQuery, hasActiveFilters }
}