import { useQuery } from '@tanstack/react-query'
import { operationTypesApi } from '@/services/operationTypesApi'

export const operationTypesKeys = {
  all: ['operation_types'] as const,
}

/**
 * Operation types loaded from the API (e.g. income/expense). Never hardcoded.
 */
export function useOperationTypes() {
  return useQuery({
    queryKey: operationTypesKeys.all,
    queryFn: operationTypesApi.getAll,
    staleTime: 5 * 60_000,
  })
}