import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { clearSession } from './session'
import { tokenStorage } from './tokenStorage'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

/**
 * Central Axios instance. Every API module talks to the backend through it so
 * that base URL, JWT header and 401 handling live in exactly one place.
 */
export const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* Attach `Authorization: Bearer <JWT>` to every outgoing request. */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* Centralized authentication failure handling. */
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isLoginAttempt = url.endsWith('/auth/login')

    // A 401 on an authenticated request means the session is no longer valid:
    // clear auth state and caches; route guards then redirect to /login.
    if (status === 401 && !isLoginAttempt && tokenStorage.get()) {
      clearSession()
    }

    return Promise.reject(error)
  },
)