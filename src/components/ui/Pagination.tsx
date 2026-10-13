import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { Button } from './Button'

interface PaginationProps {
  offset: number
  limit: number
  total: number
  onOffsetChange: (offset: number) => void
}

/** Server-side pagination controls driven by `limit`/`offset`/`total`. */
export function Pagination({
  offset,
  limit,
  total,
  onOffsetChange,
}: PaginationProps) {
  const { t } = useTranslation()

  if (total <= limit) return null

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const page = Math.floor(offset / limit) + 1
  const from = offset + 1
  const to = Math.min(offset + limit, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 px-5 py-3 dark:border-slate-700/50">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('common.showingRange', { from, to, total })}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t('common.pageOf', { page, total: totalPages })}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
          icon={<ChevronLeft className="size-3.5" />}
        >
          {t('common.prev')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onOffsetChange(offset + limit)}
        >
          {t('common.next')}
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}