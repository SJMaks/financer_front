import { useEffect } from 'react'
import { CircleCheck, CircleX, Info, X } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeToast, type Toast, type ToastType } from '@/store/uiSlice'
import { cn } from '@/utils/cn'

const ICONS: Record<ToastType, typeof CircleCheck> = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
}

const ACCENT: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-sky-500',
}

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const Icon = ICONS[toast.type]

  /* Auto-dismiss after a short delay. */
  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4000)
    return () => clearTimeout(timer)
  }, [dispatch, toast.id])

  return (
    <div
      className={cn(
        'glass-strong pointer-events-auto flex w-full items-start gap-3 rounded-xl p-3.5',
      )}
      role="status"
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', ACCENT[toast.type])} />
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        aria-label={t('common.dismissNotification')}
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

/** Fixed notification stack rendered once near the app root. */
export function ToastHost() {
  const toasts = useAppSelector((state) => state.ui.toasts)

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((toast) => (
        <div key={toast.id} className="w-full sm:w-80">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}