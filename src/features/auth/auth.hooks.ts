import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'
import { authApi } from '@/services/authApi'
import { queryClient } from '@/services/queryClient'
import { tokenStorage } from '@/services/tokenStorage'
import { setToken } from '@/store/authSlice'
import { useAppDispatch, useToast } from '@/store/hooks'
import type { LoginRequest, RegisterRequest } from '@/types/api'

/**
 * Login: stores the returned JWT, updates Redux auth state, resets cached
 * server data and redirects to the originally requested page.
 */
export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: ({ jwt }) => {
      tokenStorage.set(jwt)
      dispatch(setToken(jwt))
      queryClient.clear()

      const state = location.state as { from?: string } | null
      navigate(state?.from ?? '/', { replace: true })
    },
  })
}

/**
 * Registration. The API does not authenticate immediately after signing up,
 * so on success the user is sent to the login page.
 */
export function useRegister() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (user) => {
      toast.success(t('auth.registeredToast', { name: user.full_name }))
      navigate('/login', { replace: true })
    },
  })
}