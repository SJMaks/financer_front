import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Language } from '@/i18n'

export type Theme = 'light' | 'dark'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

const THEME_KEY = 'financer.theme'
const LANGUAGE_KEY = 'financer.language'

export interface UiState {
  theme: Theme
  language: Language
  toasts: Toast[]
}

function initialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function initialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  if (stored === 'en' || stored === 'ru') return stored
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

const initialState: UiState = {
  theme: initialTheme(),
  language: initialLanguage(),
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem(THEME_KEY, action.payload)
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, state.theme)
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      localStorage.setItem(LANGUAGE_KEY, action.payload)
    },
    addToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload)
      },
      prepare(payload: Omit<Toast, 'id'>) {
        return { payload: { ...payload, id: nanoid() } }
      },
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { setTheme, toggleTheme, setLanguage, addToast, removeToast } =
  uiSlice.actions
export const uiReducer = uiSlice.reducer