import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import { operationTypeLabel } from '@/i18n'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'
import type { Category, OperationType } from '@/types/api'

interface CategoryPickerProps {
  label: string
  /** Selected category id, or `null` for "all"/"none". */
  value: number | null
  onChange: (categoryId: number | null) => void
  categories: Category[]
  operationTypes: OperationType[]
  /** Label of the empty option; rendered when `value` is null. */
  allLabel?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

/**
 * Category chooser that shows each category's real icon (in its color) and
 * operation type instead of plain text.
 */
export function CategoryPicker({
  label,
  value,
  onChange,
  categories,
  operationTypes,
  allLabel,
  placeholder,
  error,
  disabled,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const typeMap = new Map(operationTypes.map((type) => [type.id, type]))
  const selected = categories.find((category) => category.id === value)

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'field flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
          'focus:outline-2 focus:outline-sky-500',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error !== undefined
            ? 'border-rose-400 focus:outline-rose-500 dark:border-rose-500'
            : open && 'border-sky-400 dark:border-sky-500',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected !== undefined ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${selected.color}26`,
                color: selected.color,
              }}
            >
              <AppIcon name={selected.icon} size={15} />
            </span>
            <span className="truncate font-medium text-slate-800 dark:text-slate-200">
              {selected.title}
            </span>
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">
            {allLabel ?? placeholder ?? '—'}
          </span>
        )}
        <span
          className={cn(
            'shrink-0 text-xs text-slate-400 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {error !== undefined && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="glass-strong absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl p-1.5"
        >
          {allLabel !== undefined && (
            <button
              type="button"
              role="option"
              aria-selected={value === null}
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                value === null
                  ? 'bg-sky-50 font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              {allLabel}
            </button>
          )}

          {categories.map((category) => {
            const isSelected = category.id === value
            const typeTitle = typeMap.get(category.operation_type_id)?.title
            return (
              <button
                key={category.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(category.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  isSelected
                    ? 'bg-sky-50 font-medium dark:bg-sky-950'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${category.color}26`,
                    color: category.color,
                  }}
                >
                  <AppIcon name={category.icon} size={15} />
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate',
                    isSelected
                      ? 'text-sky-700 dark:text-sky-300'
                      : 'text-slate-800 dark:text-slate-200',
                  )}
                >
                  {category.title}
                </span>
                {typeTitle !== undefined && (
                  <span className="shrink-0 text-xs text-slate-400">
                    {operationTypeLabel(t, typeTitle)}
                  </span>
                )}
              </button>
            )
          })}

          {categories.length === 0 && (
            <p className="px-2.5 py-3 text-center text-xs text-slate-400">
              {placeholder ?? '—'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
