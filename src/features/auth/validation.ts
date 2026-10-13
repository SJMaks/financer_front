import type { TFunction } from '@/i18n'
import type { LoginRequest, RegisterRequest } from '@/types/api'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

/**
 * Registration password rules — mirrors the backend `invalid_password` code:
 * Latin letters and digits, at least one uppercase letter, one lowercase
 * letter and one digit, 5–50 characters long.
 */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,50}$/

export function validateLogin(
  values: LoginRequest,
  t: TFunction,
): FieldErrors<LoginRequest> {
  const errors: FieldErrors<LoginRequest> = {}

  if (values.login.trim().length === 0) {
    errors.login = t('auth.loginRequired')
  }
  if (values.password.length === 0) {
    errors.password = t('auth.passwordRequired')
  }

  return errors
}

export function validateRegister(
  values: RegisterRequest,
  t: TFunction,
): FieldErrors<RegisterRequest> {
  const errors: FieldErrors<RegisterRequest> = {}

  if (values.full_name.trim().length === 0) {
    errors.full_name = t('auth.fullNameRequired')
  } else if (values.full_name.trim().length < 2) {
    errors.full_name = t('auth.fullNameShort')
  }

  if (values.login.trim().length === 0) {
    errors.login = t('auth.loginRequired')
  } else if (values.login.trim().length < 3) {
    errors.login = t('auth.loginShort')
  }

  if (values.password.length === 0) {
    errors.password = t('auth.passwordRequired')
  } else if (!PASSWORD_PATTERN.test(values.password)) {
    errors.password = t('auth.passwordInvalid')
  }

  return errors
}