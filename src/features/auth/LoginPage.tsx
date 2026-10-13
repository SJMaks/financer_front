import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { KeyRound, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n/useTranslation'
import type { LoginRequest } from '@/types/api'
import { getApiErrorMessage } from '@/services/error'
import { AuthLayout } from './AuthLayout'
import { useLogin } from './auth.hooks'
import { validateLogin, type FieldErrors } from './validation'

const EMPTY_VALUES: LoginRequest = { login: '', password: '' }

export function LoginPage() {
  const [values, setValues] = useState<LoginRequest>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FieldErrors<LoginRequest>>({})
  const login = useLogin()
  const location = useLocation()
  const { t } = useTranslation()

  const from = (location.state as { from?: string } | null)?.from

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const validationErrors = validateLogin(values, t)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    login.mutate({
      login: values.login.trim(),
      password: values.password,
    })
  }

  const serverError = login.isError ? getApiErrorMessage(login.error) : null

  return (
    <AuthLayout
      title={t('auth.signInTitle')}
      subtitle={
        from !== undefined
          ? t('auth.signInSubtitleRequested')
          : t('auth.signInSubtitle')
      }
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
          >
            {t('auth.createOne')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError !== null && (
          <div
            className="rounded-lg border border-rose-200 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <Input
          label={t('auth.login')}
          autoComplete="username"
          autoFocus
          icon={<UserRound className="size-4" />}
          placeholder={t('auth.loginPlaceholder')}
          value={values.login}
          error={errors.login}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, login: event.target.value }))
          }
        />

        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          icon={<KeyRound className="size-4" />}
          placeholder={t('auth.passwordPlaceholder')}
          value={values.password}
          error={errors.password}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, password: event.target.value }))
          }
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={login.isPending}
        >
          {t('auth.signIn')}
        </Button>
      </form>
    </AuthLayout>
  )
}