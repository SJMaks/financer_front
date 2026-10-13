/**
 * Currency metadata for the free-form `currency` string stored on the user
 * (set to 'dollar' by the backend at registration, editable in the profile).
 */
export interface CurrencyOption {
  code: string
  symbol: string
  /** Set for currencies whose symbol follows the amount. */
  suffix?: boolean
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'dollar', symbol: '$' },
  { code: 'euro', symbol: '€' },
  { code: 'ruble', symbol: '₽' },
  { code: 'hryvnia', symbol: '₴' },
  { code: 'pound', symbol: '£' },
  { code: 'yen', symbol: '¥' },
  { code: 'won', symbol: '₩' },
  { code: 'franc', symbol: 'Fr' },
  { code: 'yuan', symbol: '元' },
  { code: 'zloty', symbol: 'zł', suffix: true },
  { code: 'tenge', symbol: '₸' },
  { code: 'rupee', symbol: '₹' },
]

export const DEFAULT_CURRENCY = 'dollar'

export function getCurrency(code: string | undefined): CurrencyOption {
  return (
    CURRENCY_OPTIONS.find((currency) => currency.code === code) ?? {
      code: code ?? DEFAULT_CURRENCY,
      symbol: code ?? DEFAULT_CURRENCY,
      suffix: true,
    }
  )
}

export function getCurrencySymbol(code: string | undefined): string {
  return getCurrency(code).symbol
}

/** Wraps a formatted amount with the currency symbol. */
export function applyCurrency(
  formattedAmount: string,
  code: string | undefined,
): string {
  const currency = getCurrency(code)
  return currency.suffix
    ? `${formattedAmount}${currency.symbol}`
    : `${currency.symbol}${formattedAmount}`
}