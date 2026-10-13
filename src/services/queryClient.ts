import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

/**
 * Shared QueryClient. Exported as a module-level singleton so non-React code
 * (e.g. the Axios 401 interceptor) can clear private caches on logout.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Never retry auth/not-found errors — they will not recover on retry.
        if (isAxiosError(error)) {
          const status = error.response?.status
          if (status === 401 || status === 403 || status === 404) return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})