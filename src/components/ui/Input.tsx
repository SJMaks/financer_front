import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Validation / API error shown below the field. */
  error?: string
  hint?: string
  /** Optional leading icon inside the control. */
  icon?: ReactNode
}

export function Input({
  label,
  error,
  hint,
  icon,
  id,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="space-y-1.5">
      {label !== undefined && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="group relative">
        {icon !== undefined && (
          <span className="field-icon pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'field block w-full rounded-lg border px-3 py-2 text-sm',
            'transition-colors',
            'focus:outline-2 focus:outline-offset-0 focus:outline-sky-500',
            'disabled:cursor-not-allowed disabled:opacity-60',
            icon !== undefined && 'pl-9',
            error !== undefined &&
              'border-rose-400 focus:outline-rose-500 dark:border-rose-500',
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
      </div>
      {error !== undefined && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {hint !== undefined && error === undefined && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}