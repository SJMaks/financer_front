import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'

/** Inline activity indicator. */
export function Spinner({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600 dark:border-slate-700 dark:border-t-sky-500',
        className,
      )}
      role="status"
      aria-label={t('common.loading')}
    />
  )
}

/** Centered loading state for pages/panels. */
export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-500 dark:text-slate-400">
      <Spinner className="size-8" />
      <p className="text-sm">{label ?? t('common.loading')}</p>
    </div>
  )
}

/** Skeleton block for shimmer placeholders. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />
}