import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={inputId}
        className={cn(
          'field block w-full rounded-lg border px-3 py-2 text-sm',
          'transition-colors',
          'focus:outline-2 focus:outline-offset-0 focus:outline-sky-500',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error !== undefined &&
            'border-rose-400 focus:outline-rose-500 dark:border-rose-500',
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error !== undefined && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {hint !== undefined && error === undefined && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}