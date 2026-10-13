import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and blocks the button while an action is running. */
  loading?: boolean
  /** Icon rendered before the label (hidden while loading). */
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-sky-600 to-blue-700 text-white shadow-md shadow-sky-900/25 hover:from-sky-500 hover:to-blue-600 focus-visible:outline-sky-600 disabled:hover:from-sky-600 disabled:hover:to-blue-700',
  secondary:
    'bg-slate-800 text-white shadow-sm hover:bg-slate-900 focus-visible:outline-slate-800 disabled:hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:disabled:hover:bg-slate-200',
  outline:
    'border border-white/70 bg-white/60 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white/85 focus-visible:outline-sky-500 dark:border-sky-400/15 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:disabled:hover:bg-slate-800/40',
  ghost:
    'text-slate-600 hover:bg-white/60 hover:text-slate-900 focus-visible:outline-sky-500 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white',
  danger:
    'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-md shadow-rose-900/25 hover:from-rose-400 hover:to-rose-500 focus-visible:outline-rose-600 disabled:hover:from-rose-500 disabled:hover:to-rose-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'gap-1.5 px-2.5 py-1.5 text-xs',
  md: 'gap-2 px-4 py-2 text-sm',
  lg: 'gap-2 px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}