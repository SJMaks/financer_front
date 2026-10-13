import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { IconPicker } from '@/components/ui/IconPicker'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import type { Account, CreateAccountRequest } from '@/types/api'
import { useCreateAccount, useUpdateAccount } from './accounts.hooks'

interface AccountFormModalProps {
  open: boolean
  /** When present the modal edits this account, otherwise it creates one. */
  account?: Account
  onClose: () => void
}

type FormValues = CreateAccountRequest
type FormErrors = Partial<Record<keyof FormValues, string>>

function initialValues(account?: Account): FormValues {
  return {
    title: account?.title ?? '',
    description: account?.description ?? '',
    balance: account?.balance ?? 0,
    color: account?.color ?? '#10b981',
    icon: account?.icon ?? 'wallet',
  }
}

/**
 * Create/edit dialog for accounts. The form content is mounted only while the
 * modal is open, so its state is always seeded from the current account.
 */
export function AccountFormModal({
  open,
  account,
  onClose,
}: AccountFormModalProps) {
  if (!open) return null
  return (
    <AccountFormContent
      key={account?.id ?? 'create'}
      account={account}
      onClose={onClose}
    />
  )
}

function AccountFormContent({
  account,
  onClose,
}: Omit<AccountFormModalProps, 'open'>) {
  const { t } = useTranslation()
  const [values, setValues] = useState<FormValues>(() => initialValues(account))
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const isPending = createAccount.isPending || updateAccount.isPending
  const isEdit = account !== undefined

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (values.title.trim().length === 0) {
      errors.title = t('accounts.titleRequired')
    }
    if (!Number.isFinite(values.balance)) {
      errors.balance = t('operations.amountInvalid')
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(values.color.trim())) {
      errors.color = t('common.colorInvalid')
    }
    if (values.icon.trim().length === 0) {
      errors.icon = t('accounts.chooseIcon')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setServerError(null)
    if (!validate()) return

    const payload: CreateAccountRequest = {
      title: values.title.trim(),
      description: values.description.trim(),
      balance: values.balance,
      color: values.color.trim(),
      icon: values.icon.trim(),
    }

    if (isEdit) {
      updateAccount.mutate(
        { id: account.id, payload: { ...payload, version: account.version } },
        {
          onError: (error) => setServerError(getApiErrorMessage(error)),
          onSuccess: () => onClose(),
        },
      )
    } else {
      createAccount.mutate(payload, {
        onError: (error) => setServerError(getApiErrorMessage(error)),
        onSuccess: () => onClose(),
      })
    }
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? t('accounts.modalEdit') : t('accounts.modalNew')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="account-form" loading={isPending}>
            {isEdit ? t('common.saveChanges') : t('accounts.createAccount')}
          </Button>
        </>
      }
    >
      <form
        id="account-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {serverError !== null && (
          <div
            className="rounded-lg border border-rose-200 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <Input
          label={t('common.title')}
          placeholder={t('accounts.titlePlaceholder')}
          autoFocus
          value={values.title}
          error={fieldErrors.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
        />

        <Textarea
          label={t('common.description')}
          rows={2}
          placeholder={t('accounts.descriptionPlaceholder')}
          value={values.description}
          error={fieldErrors.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
        />

        <Input
          label={t('common.balance')}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={String(values.balance)}
          error={fieldErrors.balance}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              balance:
                event.target.value === '' ? 0 : Number(event.target.value),
            }))
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <IconPicker
            label={t('common.icon')}
            value={values.icon}
            onChange={(icon) => setValues((prev) => ({ ...prev, icon }))}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="account-color"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t('common.color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="account-color"
                type="color"
                value={values.color}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, color: event.target.value }))
                }
                aria-label={t('common.color')}
              />
              <Input
                aria-label={t('common.color')}
                className="flex-1"
                value={values.color}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, color: event.target.value }))
                }
              />
            </div>
            {fieldErrors.color !== undefined && (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                {fieldErrors.color}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  )
}
