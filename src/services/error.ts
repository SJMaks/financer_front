import { isAxiosError } from 'axios'
import { translate } from '@/i18n'
import { getCurrentLanguage } from '@/i18n/current'
import type { TranslationKey } from '@/i18n'
import type { HTTPError } from '@/types/api'

function extractErrorBody(error: unknown): HTTPError | null {
  if (!isAxiosError(error)) return null
  const data: unknown = error.response?.data
  if (
    data !== null &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as HTTPError).error === 'string' &&
    (data as HTTPError).error.length > 0
  ) {
    return data as HTTPError
  }
  return null
}

/** HTTP status of a failed API call, or `undefined` for non-HTTP errors. */
export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

/**
 * Maps backend `HTTPError.code` values to localized messages. Unknown codes
 * fall back to the raw `error` text returned by the server.
 */
const SERVER_CODE_KEYS: Record<string, TranslationKey> = {
  // Users
  user_exists: 'errors.code.user_exists',
  user_not_found: 'errors.code.user_not_found',
  login_required: 'errors.code.login_required',
  password_required: 'errors.code.password_required',
  fullname_required: 'errors.code.fullname_required',
  invalid_login: 'errors.code.invalid_login',
  invalid_password: 'errors.code.invalid_password',
  invalid_fullname: 'errors.code.invalid_fullname',
  invalid_currency: 'errors.code.invalid_currency',
  invalid_credentials: 'errors.code.invalid_credentials',
  // Operations
  operation_not_found: 'errors.code.operation_not_found',
  account_not_found: 'errors.code.account_not_found',
  account_id_required: 'errors.code.account_id_required',
  category_id_required: 'errors.code.category_id_required',
  title_required: 'errors.code.title_required',
  invalid_title: 'errors.code.invalid_title',
  invalid_description: 'errors.code.invalid_description',
  invalid_exec_at: 'errors.code.invalid_exec_at',
  update_conflict: 'errors.code.update_conflict',
  // Categories
  category_not_found: 'errors.code.category_not_found',
  operation_type_id_required: 'errors.code.operation_type_id_required',
  invalid_icon: 'errors.code.invalid_icon',
  invalid_color: 'errors.code.invalid_color',
  // Accounts
  invalid_balance: 'errors.code.invalid_balance',
}

const STATUS_KEYS: Record<number, TranslationKey> = {
  400: 'errors.badRequest',
  401: 'errors.unauthorized',
  403: 'errors.forbidden',
  404: 'errors.notFound',
  409: 'errors.conflict',
  500: 'errors.server',
}

/**
 * Turns any API failure into a human-readable message:
 * 1. localized message for a known backend `HTTPError.code`,
 * 2. otherwise the raw `HTTPError.error` text from the server,
 * 3. otherwise a localized message based on the HTTP status.
 */
export function getApiErrorMessage(error: unknown): string {
  const language = getCurrentLanguage()

  if (isAxiosError(error)) {
    const body = extractErrorBody(error)
    if (body) {
      const codeKey = SERVER_CODE_KEYS[body.code]
      if (codeKey !== undefined) return translate(language, codeKey)
      if (body.error.length > 0) return body.error
    }

    if (!error.response) {
      return translate(language, 'errors.network')
    }

    const statusKey = STATUS_KEYS[error.response.status]
    if (statusKey) return translate(language, statusKey)
  }

  return translate(language, 'errors.somethingWrong')
}