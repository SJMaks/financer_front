import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'
import { clearSession } from '@/services/session'
import { useToast } from '@/store/hooks'

/**
 * Frontend-only logout: clears the JWT, resets Redux auth state, drops all
 * cached server data and returns the user to the login page. The API exposes
 * no logout endpoint, so nothing is sent to the backend.
 */
export function useLogout() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useTranslation()

  return useCallback(() => {
    clearSession()
    toast.success(t('toast.signedOut'))
    navigate('/login', { replace: true })
  }, [navigate, toast, t])
}