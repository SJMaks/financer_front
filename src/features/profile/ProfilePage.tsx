import { useState, type FormEvent } from 'react'
import { ShieldAlert, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Spinner'
import { useTranslation } from '@/i18n/useTranslation'
import type { TFunction, TranslationKey } from '@/i18n'
import type { User } from '@/types/api'
import { CURRENCY_OPTIONS } from '@/utils/currency'
import { useDeleteMe, useMe, useUpdateMe } from './profile.hooks'

/** Initials badge derived from the full name. */
function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Builds currency options with labels localized to the current language. */
function currencyOptions(t: TFunction): { value: string; label: string }[] {
  return CURRENCY_OPTIONS.map((currency) => ({
    value: currency.code,
    label: `${currency.symbol} · ${t(`currency.${currency.code}` as TranslationKey)}`,
  }))
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { data: me, isLoading, isError, error, refetch } = useMe()
  const deleteMe = useDeleteMe()

  const [deleteOpen, setDeleteOpen] = useState(false)

  if (isLoading) {
    return (
      <div>
        <PageHeader title={t('profile.title')} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !me) {
    return (
      <div>
        <PageHeader title={t('profile.title')} />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={t('profile.title')}
        description={t('profile.description')}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t('profile.account')}
            description={t('profile.accountDescription')}
          />
          <CardBody className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-lg font-semibold text-white">
                {initials(me.full_name) || <UserRound className="size-6" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {me.full_name}
                </p>
                <p className="truncate text-sm text-slate-400">
                  {t('profile.login')}: {me.login}
                </p>
              </div>
            </div>

            <ProfileForm me={me} />
          </CardBody>
        </Card>

        <Card className="h-fit border-rose-200/70 dark:border-rose-900/60">
          <CardHeader
            title={t('profile.dangerZone')}
            description={t('profile.irreversible')}
            className="border-rose-100 dark:border-rose-900/60"
          />
          <CardBody className="space-y-4">
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <ShieldAlert className="size-5" />
              </span>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  {t('profile.deleteAccount')}
                </p>
                <p className="mt-1 leading-relaxed">
                  {t('profile.deleteDescription')}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={() => setDeleteOpen(true)}
                icon={<ShieldAlert className="size-4" />}
              >
                {t('profile.deleteAccount')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title={t('profile.deleteTitle')}
        message={t('profile.deleteMessage', { login: me.login })}
        confirmLabel={t('profile.deleteConfirm')}
        loading={deleteMe.isPending}
        onConfirm={() => deleteMe.mutate()}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}

/**
 * Editable full name + currency and read-only login (login is not editable
 * per the API contract).
 */
function ProfileForm({ me }: { me: User }) {
  const { t } = useTranslation()
  const updateMe = useUpdateMe()
  const [fullName, setFullName] = useState(me.full_name)
  const [currency, setCurrency] = useState(me.currency)
  const [fieldError, setFieldError] = useState<string | undefined>(undefined)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (fullName.trim().length === 0) {
      setFieldError(t('profile.fullNameRequired'))
      return
    }
    if (fullName.trim().length < 2) {
      setFieldError(t('profile.fullNameShort'))
      return
    }
    setFieldError(undefined)
    updateMe.mutate({ full_name: fullName.trim(), currency })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label={t('auth.fullName')}
        value={fullName}
        error={fieldError}
        autoComplete="name"
        onChange={(event) => {
          setFullName(event.target.value)
          if (fieldError !== undefined) setFieldError(undefined)
        }}
      />

      <Select
        label={t('common.currency')}
        value={currency}
        options={currencyOptions(t)}
        hint={t('profile.currencyHint')}
        onChange={(event) => setCurrency(event.target.value)}
      />

      <Input
        label={t('profile.login')}
        value={me.login}
        readOnly
        disabled
        hint={t('profile.loginReadOnly')}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={updateMe.isPending}>
          {t('common.saveChanges')}
        </Button>
      </div>
    </form>
  )
}
