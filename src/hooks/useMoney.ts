import { useMemo } from 'react'
import { useMe } from '@/features/profile/profile.hooks'
import { DEFAULT_CURRENCY } from '@/utils/currency'
import {
  formatMoney,
  formatSignedMoney,
} from '@/utils/format'

/**
 * Money formatter bound to the currency of the current user
 * (falls back to 'dollar' while the profile is loading).
 */
export function useMoney() {
  const { data: me } = useMe()
  const currency = me?.currency ?? DEFAULT_CURRENCY

  return useMemo(
    () => ({
      currency,
      /** `1234.5` → `$1,234.50` */
      format: (value: number) => formatMoney(value, currency),
      /** `-1234.5` as expense → `-$1,234.50`; income → `+$1,234.50` */
      formatSigned: (value: number, kind: 'income' | 'expense') =>
        formatSignedMoney(value, kind, currency),
    }),
    [currency],
  )
}