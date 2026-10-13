import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** True while the confirmation request is in flight. */
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Explicit confirmation step required before any destructive action.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t('common.delete')}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <TriangleAlert className="size-5" />
        </span>
        <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {message}
        </div>
      </div>
    </Modal>
  )
}