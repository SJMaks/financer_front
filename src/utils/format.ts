import { LOCALES } from '@/i18n'
import { getCurrentLanguage } from '@/i18n/current'
import { applyCurrency } from './currency'

/**
 * Locale used for Intl formatting; kept in sync with the selected UI
 * language by the ThemeEffect component.
 */
let currentLocale = LOCALES[getCurrentLanguage()]

/** Amount formatter shared by tables, cards and charts. */
let amountFormatter = new Intl.NumberFormat(currentLocale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function setFormattingLocale(locale: string): void {
  currentLocale = locale
  amountFormatter = new Intl.NumberFormat(currentLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Raw number without currency (used as the base for money formatting). */
export function formatAmount(value: number): string {
  return amountFormatter.format(value)
}

/** Amount with the user's currency symbol, e.g. `$1,234.56`. */
export function formatMoney(
  value: number,
  currency: string | undefined,
): string {
  return applyCurrency(amountFormatter.format(value), currency)
}

/**
 * Signed amount including the user's currency symbol for transaction lists.
 * The absolute value is used because the income/expense direction comes from
 * the category's operation type, not from the stored sign of `sum`.
 */
export function formatSignedMoney(
  value: number,
  kind: 'income' | 'expense',
  currency: string | undefined,
): string {
  const abs = amountFormatter.format(Math.abs(value))
  return kind === 'income'
    ? `+${applyCurrency(abs, currency)}`
    : `-${applyCurrency(abs, currency)}`
}

/** Formats an RFC3339 timestamp as e.g. "Aug 9, 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(currentLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Formats an RFC3339 timestamp as e.g. "Aug 9, 2026, 14:30". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(currentLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formats the `month` field of statistics responses. The backend returns a
 * month identifier (e.g. "2026-08") which is rendered as "Aug 2026".
 */
export function formatMonth(month: string): string {
  const yearMonth = /^(\d{4})-(\d{2})$/.exec(month)
  if (yearMonth) {
    const date = new Date(Number(yearMonth[1]), Number(yearMonth[2]) - 1, 1)
    return date.toLocaleDateString(currentLocale, {
      month: 'short',
      year: 'numeric',
    })
  }
  const date = new Date(month)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString(currentLocale, {
      month: 'short',
      year: 'numeric',
    })
  }
  return month
}

/** RFC3339 timestamp → value for `<input type="datetime-local">` (local time). */
export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * `<input type="datetime-local">` value → RFC3339 timestamp in UTC,
 * matching the `exec_at` format used by the backend (e.g. 2026-08-09T00:00:00Z).
 */
export function fromDatetimeLocalValue(value: string): string | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.toISOString().replace(/\.\d{3}Z$/, 'Z')}`
}

/** Builds an RFC3339 timestamp at the start (or end) of a `YYYY-MM-DD` day. */
export function dateBoundaryToRfc3339(date: string, endOfDay: boolean): string {
  return endOfDay ? `${date}T23:59:59Z` : `${date}T00:00:00Z`
}

/** `datetime-local` value → `YYYY-MM-DD` (used when building edit form state). */
export function toDateString(iso: string): string {
  return iso.slice(0, 10)
}