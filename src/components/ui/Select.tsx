import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  /** Placeholder rendered as a disabled first option when value is empty. */
  placeholder?: string
  options: SelectOption[]
}

export function Select({
  label,
  error,
  hint,
  placeholder,
  options,
  id,
  className,
  value,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="space-y-1.5">
      {label !== undefined && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          className={cn(
            'field block w-full appearance-none rounded-lg border px-3 py-2 pr-9 text-sm',
            'transition-colors',
            'focus:outline-2 focus:outline-offset-0 focus:outline-sky-500',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error !== undefined &&
              'border-rose-400 focus:outline-rose-500 dark:border-rose-500',
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute inset-y-0 right-2.5 my-auto size-4 text-slate-400"
          aria-hidden
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