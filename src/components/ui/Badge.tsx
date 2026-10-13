import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  /** Optional accent color (hex) taken from category/account data. */
  color?: string
  className?: string
}

/** Pill used for categories, operation types and statuses. */
export function Badge({ children, color, className }: BadgeProps) {
  if (color !== undefined && color.length > 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
          className,
        )}
        style={{
          backgroundColor: `${color}26`,
          color,
        }}
      >
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        {children}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
        className,
      )}
    >
      {children}
    </span>
  )
}