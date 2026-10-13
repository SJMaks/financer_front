import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IdCard, KeyRound, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import type { RegisterRequest } from '@/types/api'
import { AuthLayout } from './AuthLayout'
import { useRegister } from './auth.hooks'
import { validateRegister, type FieldErrors } from './validation'

const EMPTY_VALUES: RegisterRequest = { full_name: '', login: '', password: '' }

export function RegisterPage() {
  const [values, setValues] = useState<RegisterRequest>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FieldErrors<RegisterRequest>>({})
  const register = useRegister()
  const { t } = useTranslation()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const validationErrors = validateRegister(values, t)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    register.mutate({
      full_name: values.full_name.trim(),
      login: values.login.trim(),
      password: values.password,
    })
  }

  const serverError = register.isError ? getApiErrorMessage(register.error) : null

  return (
    <AuthLayout
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.haveAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400"
          >
            {t('auth.signIn')}
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
          label={t('auth.fullName')}
          autoComplete="name"
          autoFocus
          icon={<IdCard className="size-4" />}
          placeholder={t('auth.fullNamePlaceholder')}
          value={values.full_name}
          error={errors.full_name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, full_name: event.target.value }))
          }
        />

        <Input
          label={t('auth.login')}
          autoComplete="username"
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
          autoComplete="new-password"
          icon={<KeyRound className="size-4" />}
          placeholder={t('auth.passwordPlaceholder')}
          hint={t('auth.passwordHint')}
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
          loading={register.isPending}
        >
          {t('auth.createAccount')}
        </Button>
      </form>
    </AuthLayout>
  )
}