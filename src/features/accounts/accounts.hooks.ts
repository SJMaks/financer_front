import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/i18n/useTranslation'
import { accountsApi } from '@/services/accountsApi'
import { getApiErrorMessage } from '@/services/error'
import { useToast } from '@/store/hooks'
import type {
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types/api'

export const accountsKeys = {
  all: ['accounts'] as const,
  detail: (id: number | string) => ['accounts', 'detail', id] as const,
}

/** All accounts of the current user. */
export function useAccounts() {
  return useQuery({
    queryKey: accountsKeys.all,
    queryFn: accountsApi.getAll,
  })
}

/** A single account by id. */
export function useAccount(id: number | undefined) {
  return useQuery({
    queryKey: accountsKeys.detail(id ?? 0),
    queryFn: () => accountsApi.getById(id as number),
    enabled: id !== undefined && Number.isFinite(id),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateAccountRequest) => accountsApi.create(payload),
    onSuccess: (account) => {
      void queryClient.invalidateQueries({ queryKey: accountsKeys.all })
      toast.success(t('accounts.created', { title: account.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateAccountRequest
    }) => accountsApi.update(id, payload),
    onSuccess: (account) => {
      void queryClient.invalidateQueries({ queryKey: accountsKeys.all })
      queryClient.setQueryData(accountsKeys.detail(account.id), account)
      toast.success(t('accounts.updated', { title: account.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (account: { id: number; title: string }) =>
      accountsApi.remove(account.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accountsKeys.all })
      toast.success(t('accounts.deleted'))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}