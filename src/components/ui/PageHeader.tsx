import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Buttons/links rendered on the right (or below on small screens). */
  actions?: ReactNode
  /** Content rendered above the title (e.g. a back link). */
  eyebrow?: ReactNode
}

/** Consistent page heading used by every authenticated page. */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow !== undefined && <div className="mb-1.5">{eyebrow}</div>}
        <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          {title}
        </h1>
        {description !== undefined && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actions !== undefined && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}