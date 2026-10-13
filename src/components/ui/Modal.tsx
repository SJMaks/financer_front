import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Optional sticky footer (typically form actions). */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const { t } = useTranslation()

  /* Close on Escape while open. */
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  /* Prevent background scrolling while the modal is open. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={cn(
          'glass-strong relative z-10 my-auto w-full rounded-2xl',
          sizeClasses[size],
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4 dark:border-slate-700/50">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={t('common.close')}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer !== undefined && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}