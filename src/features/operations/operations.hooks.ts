import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import { operationsApi } from '@/services/operationsApi'
import { useToast } from '@/store/hooks'
import type {
  CreateOperationRequest,
  OperationsQuery,
  UpdateOperationRequest,
} from '@/types/api'

export const operationsKeys = {
  all: ['operations'] as const,
  list: (accountId: number, params: OperationsQuery) =>
    ['operations', accountId, 'list', params] as const,
  detail: (accountId: number, operationId: number) =>
    ['operations', accountId, 'detail', operationId] as const,
}

/** Server-side paginated/filtered/sorted operations of one account. */
export function useOperations(accountId: number | undefined, query: OperationsQuery) {
  return useQuery({
    queryKey: operationsKeys.list(accountId ?? 0, query),
    queryFn: () => operationsApi.list(accountId as number, query),
    enabled: accountId !== undefined && Number.isFinite(accountId),
  })
}

/** A single operation (GET one operation endpoint). */
export function useOperation(
  accountId: number | undefined,
  operationId: number | undefined,
) {
  return useQuery({
    queryKey: operationsKeys.detail(accountId ?? 0, operationId ?? 0),
    queryFn: () =>
      operationsApi.getById(accountId as number, operationId as number),
    enabled:
      accountId !== undefined &&
      operationId !== undefined &&
      Number.isFinite(accountId) &&
      Number.isFinite(operationId),
  })
}

/**
 * Operations affect the account list (balances), statistics and the dashboard,
 * so every mutation invalidates all three caches.
 */
function useOperationCacheSync() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: operationsKeys.all })
    void queryClient.invalidateQueries({ queryKey: ['statistics'] })
    void queryClient.invalidateQueries({ queryKey: ['accounts'] })
  }
}

export function useCreateOperation() {
  const toast = useToast()
  const syncCache = useOperationCacheSync()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: number
      payload: CreateOperationRequest
    }) => operationsApi.create(accountId, payload),
    onSuccess: (operation) => {
      syncCache()
      toast.success(t('operations.created', { title: operation.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateOperation() {
  const toast = useToast()
  const syncCache = useOperationCacheSync()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({
      accountId,
      operationId,
      payload,
    }: {
      accountId: number
      operationId: number
      payload: UpdateOperationRequest
    }) => operationsApi.update(accountId, operationId, payload),
    onSuccess: (operation) => {
      syncCache()
      toast.success(t('operations.updated', { title: operation.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteOperation() {
  const toast = useToast()
  const syncCache = useOperationCacheSync()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({
      accountId,
      operationId,
    }: {
      accountId: number
      operationId: number
    }) => operationsApi.remove(accountId, operationId),
    onSuccess: () => {
      syncCache()
      toast.success(t('operations.deleted'))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}