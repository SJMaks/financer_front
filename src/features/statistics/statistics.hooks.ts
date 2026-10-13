import { useQuery } from '@tanstack/react-query'
import { statisticsApi } from '@/services/statisticsApi'

export const statisticsKeys = {
  all: ['statistics'] as const,
  user: ['statistics', 'user'] as const,
  account: (accountId: number | string) =>
    ['statistics', 'account', accountId] as const,
}

/** Monthly statistics across all user accounts (GET /statistics). */
export function useUserStatistics() {
  return useQuery({
    queryKey: statisticsKeys.user,
    queryFn: statisticsApi.getUserStatistics,
  })
}

/** Monthly statistics for a single account (GET /accounts/{id}/statistics). */
export function useAccountStatistics(accountId: number | undefined) {
  return useQuery({
    queryKey: statisticsKeys.account(accountId ?? 0),
    queryFn: () => statisticsApi.getAccountStatistics(accountId as number),
    enabled: accountId !== undefined && Number.isFinite(accountId),
  })
}