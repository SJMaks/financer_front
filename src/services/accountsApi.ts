import { http } from './http'
import type {
  Account,
  AccountsResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types/api'

/** Account endpoints from swagger: /accounts, /accounts/{id}. */
export const accountsApi = {
  async getAll(): Promise<Account[]> {
    const { data } = await http.get<AccountsResponse>('/accounts')
    return data.accounts
  },

  async getById(id: number): Promise<Account> {
    const { data } = await http.get<Account>(`/accounts/${id}`)
    return data
  },

  async create(payload: CreateAccountRequest): Promise<Account> {
    const { data } = await http.post<Account>('/accounts', payload)
    return data
  },

  /** Uses PATCH with `version` for optimistic concurrency control. */
  async update(id: number, payload: UpdateAccountRequest): Promise<Account> {
    const { data } = await http.patch<Account>(`/accounts/${id}`, payload)
    return data
  },

  /** Responds with 204 No Content. */
  async remove(id: number): Promise<void> {
    await http.delete(`/accounts/${id}`)
  },
}