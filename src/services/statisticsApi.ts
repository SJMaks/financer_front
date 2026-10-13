import { http } from './http'
import type {
  AccountStatistics,
  AccountStatisticsResponse,
  UserStatistics,
  UserStatisticsResponse,
} from '@/types/api'

/** Statistics endpoints from swagger: /statistics and /accounts/{id}/statistics. */
export const statisticsApi = {
  /** Monthly income/expense/profit across all user accounts. */
  async getUserStatistics(): Promise<UserStatistics[]> {
    const { data } = await http.get<UserStatisticsResponse>('/statistics')
    return data.months
  },

  /** Monthly income/expense/profit for a single account. */
  async getAccountStatistics(accountId: number): Promise<AccountStatistics[]> {
    const { data } = await http.get<AccountStatisticsResponse>(
      `/accounts/${accountId}/statistics`,
    )
    return data.months
  },
}