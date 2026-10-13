import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import { Button } from './Button'

interface ErrorStateProps {
  /** Raw error (typically the Axios error from React Query). */
  error?: unknown
  title?: string
  /** Overrides the derived message when provided. */
  message?: string
  onRetry?: () => void
}

/** Renders a clear, human-readable API failure with an optional retry action. */
export function ErrorState({
  error,
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  const { t } = useTranslation()
  const text =
    message ??
    (error !== undefined
      ? getApiErrorMessage(error)
      : t('errors.somethingWrong'))

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950 dark:text-rose-400">
        <TriangleAlert className="size-6" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title ?? t('errors.genericTitle')}
        </h3>
        <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {text}
        </p>
      </div>
      {onRetry !== undefined && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="size-3.5" />}
        >
          {t('common.tryAgain')}
        </Button>
      )}
    </div>
  )
}