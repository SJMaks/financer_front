import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { IconPicker } from '@/components/ui/IconPicker'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useOperationTypes } from '@/hooks/operationTypes'
import { operationTypeLabel } from '@/i18n'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import type { Category, CreateCategoryRequest } from '@/types/api'
import { useCreateCategory, useUpdateCategory } from './categories.hooks'

interface CategoryFormModalProps {
  open: boolean
  /** When present the modal edits this category, otherwise it creates one. */
  category?: Category
  onClose: () => void
}

type FormValues = CreateCategoryRequest
type FormErrors = Partial<Record<keyof FormValues, string>>

function initialValues(category?: Category): FormValues {
  return {
    title: category?.title ?? '',
    color: category?.color ?? '#0ea5e9',
    icon: category?.icon ?? 'cart',
    operation_type_id: category?.operation_type_id ?? 0,
  }
}

/**
 * Create/edit dialog for categories. The form content is mounted only while
 * the modal is open, so its state is always seeded from the current category.
 */
export function CategoryFormModal({
  open,
  category,
  onClose,
}: CategoryFormModalProps) {
  if (!open) return null
  return (
    <CategoryFormContent
      key={category?.id ?? 'create'}
      category={category}
      onClose={onClose}
    />
  )
}

function CategoryFormContent({
  category,
  onClose,
}: Omit<CategoryFormModalProps, 'open'>) {
  const { t } = useTranslation()
  const { data: operationTypes, isLoading: typesLoading } = useOperationTypes()
  const [values, setValues] = useState<FormValues>(() => initialValues(category))
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending
  const isEdit = category !== undefined

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (values.title.trim().length === 0) {
      errors.title = t('categories.titleRequired')
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(values.color.trim())) {
      errors.color = t('common.colorInvalid')
    }
    if (values.operation_type_id <= 0) {
      errors.operation_type_id = t('categories.typeRequired')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setServerError(null)
    if (!validate()) return

    const payload: CreateCategoryRequest = {
      title: values.title.trim(),
      color: values.color.trim(),
      icon: values.icon.trim(),
      operation_type_id: values.operation_type_id,
    }

    if (isEdit) {
      updateCategory.mutate(
        { id: category.id, payload: { ...payload, version: category.version } },
        {
          onError: (error) => setServerError(getApiErrorMessage(error)),
          onSuccess: () => onClose(),
        },
      )
    } else {
      createCategory.mutate(payload, {
        onError: (error) => setServerError(getApiErrorMessage(error)),
        onSuccess: () => onClose(),
      })
    }
  }

  const typeOptions = (operationTypes ?? []).map((type) => ({
    value: String(type.id),
    label: operationTypeLabel(t, type.title),
  }))

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? t('categories.modalEdit') : t('categories.modalNew')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="category-form" loading={isPending}>
            {isEdit ? t('common.saveChanges') : t('categories.createCategory')}
          </Button>
        </>
      }
    >
      <form
        id="category-form"
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
          placeholder={t('categories.titlePlaceholder')}
          autoFocus
          value={values.title}
          error={fieldErrors.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
        />

        <Select
          label={t('categories.operationType')}
          placeholder={
            typesLoading ? t('categories.typesLoading') : t('categories.chooseType')
          }
          value={
            values.operation_type_id > 0 ? String(values.operation_type_id) : ''
          }
          error={fieldErrors.operation_type_id}
          disabled={typesLoading}
          options={typeOptions}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              operation_type_id: Number(event.target.value),
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
              htmlFor="category-color"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {t('common.color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="category-color"
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
