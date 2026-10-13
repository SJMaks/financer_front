import { http } from './http'
import type { OperationType, OperationTypesResponse } from '@/types/api'

/** Operation types endpoint from swagger: GET /operation_types. */
export const operationTypesApi = {
  async getAll(): Promise<OperationType[]> {
    const { data } = await http.get<OperationTypesResponse>('/operation_types')
    return data.operation_types
  },
}