import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

/** Standard frosted surface used across the dashboard. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass rounded-2xl', className)} {...rest} />
}

/** Card with a padded header section (title + optional actions). */
export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800',
        className,
      )}
    >
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {description !== undefined && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actions}
    </div>
  )
}

/** Padded body section of a card. */
export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...rest} />
  )
}