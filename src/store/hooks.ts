import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { addToast, type ToastType } from './uiSlice'
import type { AppDispatch, RootState } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/** Imperative toast helpers backed by the Redux `ui` slice. */
export function useToast() {
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const notify = (type: ToastType, message: string) => {
      dispatch(addToast({ type, message }))
    }
    return {
      success: (message: string) => notify('success', message),
      error: (message: string) => notify('error', message),
      info: (message: string) => notify('info', message),
    }
  }, [dispatch])
}