import { useEffect, useRef, useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import { ICON_OPTIONS } from '@/components/iconRegistry'
import { cn } from '@/utils/cn'

interface IconPickerProps {
  label: string
  value: string
  onChange: (icon: string) => void
  disabled?: boolean
}

/**
 * Visual icon chooser: a scrollable grid of real icons instead of a plain-text
 * drop list.
 */
export function IconPicker({ label, value, onChange, disabled }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /* Close when clicking outside the picker. */
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

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'field flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
          'focus:outline-2 focus:outline-sky-500',
          'disabled:cursor-not-allowed disabled:opacity-60',
          open && 'border-sky-400 dark:border-sky-500',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
            <AppIcon name={value} size={17} />
          </span>
          <span className="capitalize text-slate-700 dark:text-slate-200">
            {value}
          </span>
        </span>
        <span
          className={cn(
            'text-xs text-slate-400 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="glass-strong absolute left-0 right-0 top-full z-50 mt-1.5 grid max-h-56 grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5 overflow-y-auto rounded-xl p-2"
        >
          {ICON_OPTIONS.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                title={option.label}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-lg border transition-colors',
                  selected
                    ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                )}
              >
                <AppIcon name={option.value} size={18} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}