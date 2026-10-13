import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import { clearSession } from '@/services/session'
import { usersApi } from '@/services/usersApi'
import { useToast } from '@/store/hooks'
import type { UpdateUserRequest } from '@/types/api'

export const profileKeys = {
  all: ['me'] as const,
}

/** Current authenticated user (GET /users/me). */
export function useMe() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: usersApi.getMe,
  })
}

/** Updates the editable profile fields (PATCH /users/me). */
export function useUpdateMe() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: UpdateUserRequest) => usersApi.updateMe(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(profileKeys.all, user)
      toast.success(t('profile.updated'))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

/**
 * Deletes the current user (DELETE /users/me), then clears the client session
 * and redirects to registration because the account no longer exists.
 */
export function useDeleteMe() {
  const toast = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: () => usersApi.deleteMe(),
    onSuccess: () => {
      clearSession()
      toast.success(t('profile.deleted'))
      navigate('/register', { replace: true })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}