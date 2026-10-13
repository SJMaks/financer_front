import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { tokenStorage } from '@/services/tokenStorage'

export interface AuthState {
  /** JWT issued by POST /auth/login; `null` means unauthenticated. */
  token: string | null
}

const initialState: AuthState = {
  token: tokenStorage.get(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Called after a successful login (token is persisted separately). */
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    /**
     * Frontend-only logout: there is no logout endpoint in the API,
     * so we simply drop the token from memory and storage.
     */
    logout(state) {
      state.token = null
    },
  },
})

export const { setToken, logout } = authSlice.actions
export const authReducer = authSlice.reducer