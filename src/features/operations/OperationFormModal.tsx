import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { CategoryPicker } from '@/components/ui/CategoryPicker'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { useCategories } from '@/features/categories/categories.hooks'
import { useOperationTypes } from '@/hooks/operationTypes'
import { useTranslation } from '@/i18n/useTranslation'
import { getApiErrorMessage } from '@/services/error'
import type { CreateOperationRequest, Operation } from '@/types/api'
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from '@/utils/format'
import { resolveOperationKind } from '@/utils/operation'
import { useCreateOperation, useUpdateOperation } from './operations.hooks'

interface OperationFormModalProps {
  open: boolean
  accountId: number
  /** When present the modal edits this operation, otherwise it creates one. */
  operation?: Operation
  onClose: () => void
}

interface FormValues extends Omit<CreateOperationRequest, 'exec_at'> {
  /** `datetime-local` value kept as local wall time while editing. */
  exec_at_local: string
}

type FormErrors = Partial<Record<keyof FormValues | 'exec_at', string>>

function initialValues(operation?: Operation): FormValues {
  return {
    title: operation?.title ?? '',
    description: operation?.description ?? '',
    sum: operation?.sum ?? 0,
    exec_at_local: operation
      ? toDatetimeLocalValue(operation.exec_at)
      : toDatetimeLocalValue(new Date().toISOString()),
    category_id: operation?.category_id ?? 0,
  }
}

/**
 * Create/edit dialog for operations. The form content is mounted only while
 * the modal is open, so its state is always seeded from the operation.
 */
export function OperationFormModal({
  open,
  accountId,
  operation,
  onClose,
}: OperationFormModalProps) {
  if (!open) return null
  return (
    <OperationFormContent
      key={operation?.id ?? 'create'}
      accountId={accountId}
      operation={operation}
      onClose={onClose}
    />
  )
}

function OperationFormContent({
  accountId,
  operation,
  onClose,
}: Omit<OperationFormModalProps, 'open'>) {
  const { t } = useTranslation()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: operationTypes } = useOperationTypes()

  const [values, setValues] = useState<FormValues>(() => initialValues(operation))
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const createOperation = useCreateOperation()
  const updateOperation = useUpdateOperation()
  const isPending = createOperation.isPending || updateOperation.isPending
  const isEdit = operation !== undefined

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (values.title.trim().length === 0) {
      errors.title = t('operations.titleRequired')
    }
    if (!Number.isFinite(values.sum)) {
      errors.sum = t('operations.amountInvalid')
    }
    if (values.exec_at_local.length === 0) {
      errors.exec_at = t('operations.dateRequired')
    } else if (fromDatetimeLocalValue(values.exec_at_local) === null) {
      errors.exec_at = t('operations.dateInvalid')
    }
    if (values.category_id <= 0) {
      errors.category_id = t('operations.categoryRequired')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setServerError(null)
    if (!validate()) return

    const execAt = fromDatetimeLocalValue(values.exec_at_local)
    if (execAt === null) return

    const payload: CreateOperationRequest = {
      title: values.title.trim(),
      description: values.description.trim(),
      sum: values.sum,
      exec_at: execAt,
      category_id: values.category_id,
    }

    if (isEdit) {
      updateOperation.mutate(
        {
          accountId,
          operationId: operation.id,
          payload: { ...payload, version: operation.version },
        },
        {
          onError: (error) => setServerError(getApiErrorMessage(error)),
          onSuccess: () => onClose(),
        },
      )
    } else {
      createOperation.mutate(
        { accountId, payload },
        {
          onError: (error) => setServerError(getApiErrorMessage(error)),
          onSuccess: () => onClose(),
        },
      )
    }
  }

  /* Live hint about the income/expense direction of the chosen category. */
  const typeMap = new Map((operationTypes ?? []).map((type) => [type.id, type]))
  const selectedCategory = (categories ?? []).find(
    (category) => category.id === values.category_id,
  )
  const selectedKind = selectedCategory
    ? resolveOperationKind(
        typeMap.get(selectedCategory.operation_type_id)?.title,
      )
    : null

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? t('operations.modalEdit') : t('operations.modalNew')}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="operation-form" loading={isPending}>
            {isEdit ? t('common.saveChanges') : t('operations.newOperation')}
          </Button>
        </>
      }
    >
      <form
        id="operation-form"
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
          placeholder={t('operations.titlePlaceholder')}
          autoFocus
          value={values.title}
          error={fieldErrors.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t('common.amount')}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={String(values.sum)}
            error={fieldErrors.sum}
            hint={
              selectedKind !== null
                ? selectedKind === 'income'
                  ? t('operations.recordedAsIncome')
                  : t('operations.recordedAsExpense')
                : undefined
            }
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                sum:
                  event.target.value === '' ? 0 : Number(event.target.value),
              }))
            }
          />

          <Input
            label={t('common.dateAndTime')}
            type="datetime-local"
            value={values.exec_at_local}
            error={fieldErrors.exec_at}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                exec_at_local: event.target.value,
              }))
            }
          />
        </div>

        <CategoryPicker
          label={t('common.category')}
          value={values.category_id > 0 ? values.category_id : null}
          onChange={(categoryId) =>
            setValues((prev) => ({
              ...prev,
              category_id: categoryId ?? 0,
            }))
          }
          categories={categories ?? []}
          operationTypes={operationTypes ?? []}
          placeholder={
            categoriesLoading
              ? t('operations.categoriesLoading')
              : t('operations.chooseCategory')
          }
          error={fieldErrors.category_id}
          disabled={categoriesLoading}
        />

        <Textarea
          label={t('common.description')}
          rows={2}
          placeholder={t('operations.descriptionPlaceholder')}
          value={values.description}
          error={fieldErrors.description}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
        />
      </form>
    </Modal>
  )
}
