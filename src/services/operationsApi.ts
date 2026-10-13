import { http } from './http'
import type {
  CreateOperationRequest,
  Operation,
  OperationsQuery,
  OperationsResponse,
  UpdateOperationRequest,
} from '@/types/api'

/**
 * Operation endpoints from swagger:
 * /accounts/{accountID}/operations and /accounts/{accountID}/operations/{operationID}
 */
export const operationsApi = {
  async list(
    accountId: number,
    query: OperationsQuery = {},
  ): Promise<OperationsResponse> {
    const { data } = await http.get<OperationsResponse>(
      `/accounts/${accountId}/operations`,
      { params: query },
    )
    return data
  },

  async getById(accountId: number, operationId: number): Promise<Operation> {
    const { data } = await http.get<Operation>(
      `/accounts/${accountId}/operations/${operationId}`,
    )
    return data
  },

  async create(
    accountId: number,
    payload: CreateOperationRequest,
  ): Promise<Operation> {
    const { data } = await http.post<Operation>(
      `/accounts/${accountId}/operations`,
      payload,
    )
    return data
  },

  /** Uses PATCH with `version` for optimistic concurrency control. */
  async update(
    accountId: number,
    operationId: number,
    payload: UpdateOperationRequest,
  ): Promise<Operation> {
    const { data } = await http.patch<Operation>(
      `/accounts/${accountId}/operations/${operationId}`,
      payload,
    )
    return data
  },

  /** Responds with 204 No Content. */
  async remove(accountId: number, operationId: number): Promise<void> {
    await http.delete(`/accounts/${accountId}/operations/${operationId}`)
  },
}