import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** Outline icon illustrating the empty collection. */
  icon: ReactNode
  title: string
  description?: string
  /** Call-to-action rendered below the description. */
  action?: ReactNode
}

/** Friendly placeholder shown when a list has no data yet. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400">
        {icon}
      </span>
      <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description !== undefined && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action !== undefined && <div className="mt-3">{action}</div>}
    </div>
  )
}