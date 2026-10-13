import { logout } from '@/store/authSlice'
import { store } from '@/store'
import { queryClient } from './queryClient'
import { tokenStorage } from './tokenStorage'

/**
 * Ends the client-side session: drops the stored JWT, resets the Redux auth
 * state and clears every cached server response. The API has no logout
 * endpoint, so this is purely a frontend concern.
 */
export function clearSession(): void {
  tokenStorage.remove()
  store.dispatch(logout())
  queryClient.clear()
}