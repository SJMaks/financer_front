import { useMemo, useState } from 'react'
import { Pencil, Tag, Trash } from 'lucide-react'
import { AppIcon } from '@/components/AppIcon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { useOperationTypes } from '@/hooks/operationTypes'
import { operationTypeLabel } from '@/i18n'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/utils/cn'
import type { Category } from '@/types/api'
import { CategoryFormModal } from './CategoryFormModal'
import { useCategories, useDeleteCategory } from './categories.hooks'

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  )
}

function CategoryCard({
  category,
  typeTitle,
  onEdit,
  onDelete,
}: {
  category: Category
  typeTitle?: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col rounded-2xl p-4 glass">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${category.color}26`,
              color: category.color,
            }}
          >
            <AppIcon name={category.icon} size={20} />
          </span>
          <p className="min-w-0 truncate pt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {category.title}
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-700 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
            aria-label={t('categories.editAria', { title: category.title })}
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
            aria-label={t('categories.deleteAria', { title: category.title })}
          >
            <Trash className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Badge color={category.color}>
          {typeTitle !== undefined
            ? operationTypeLabel(t, typeTitle)
            : t('common.unknownType')}
        </Badge>
      </div>
    </div>
  )
}

export function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories()
  const { data: operationTypes, isError: typesError } = useOperationTypes()
  const deleteCategory = useDeleteCategory()
  const { t } = useTranslation()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>(undefined)
  const [deleting, setDeleting] = useState<Category | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const typeMap = useMemo(
    () => new Map((operationTypes ?? []).map((type) => [type.id, type])),
    [operationTypes],
  )

  const filterOptions = useMemo(
    () => [
      { value: 'all', label: t('common.allTypes') },
      ...(operationTypes ?? []).map((type) => ({
        value: String(type.id),
        label: operationTypeLabel(t, type.title),
      })),
    ],
    [operationTypes, t],
  )

  const visibleCategories = useMemo(() => {
    const all = categories ?? []
    if (typeFilter === 'all') return all
    return all.filter(
      (category) => String(category.operation_type_id) === typeFilter,
    )
  }, [categories, typeFilter])

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteCategory.mutate(
      { id: deleting.id, title: deleting.title },
      { onSuccess: () => setDeleting(undefined) },
    )
  }

  return (
    <div>
      <PageHeader
        title={t('categories.title')}
        description={t('categories.subtitle')}
        actions={
          <Button onClick={openCreate}>{t('categories.newCategory')}</Button>
        }
      />

      {filterOptions.length > 1 && (
        <div
          className="mb-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label={t('categories.filterLabel')}
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={typeFilter === option.value}
              onClick={() => setTypeFilter(option.value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                typeFilter === option.value
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'glass text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isLoading && <CategoriesSkeleton />}

      {(isError || typesError) && (
        <ErrorState
          error={error ?? typesError}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && (categories?.length ?? 0) === 0 && (
        <EmptyState
          icon={<Tag className="size-6" />}
          title={t('categories.noCategoriesTitle')}
          description={t('categories.noCategoriesDescription')}
          action={
            <Button onClick={openCreate}>{t('categories.createCategory')}</Button>
          }
        />
      )}

      {!isLoading && !isError && visibleCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              typeTitle={typeMap.get(category.operation_type_id)?.title}
              onEdit={() => openEdit(category)}
              onDelete={() => setDeleting(category)}
            />
          ))}
        </div>
      )}

      {!isLoading &&
        !isError &&
        (categories?.length ?? 0) > 0 &&
        visibleCategories.length === 0 && (
          <EmptyState
            icon={<Tag className="size-6" />}
            title={t('categories.noMatchTitle')}
            description={t('categories.noMatchDescription')}
            action={
              <Button onClick={openCreate}>
                {t('categories.createCategory')}
              </Button>
            }
          />
        )}

      <CategoryFormModal
        open={formOpen}
        category={editing}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        title={t('categories.deleteTitle')}
        message={t('categories.deleteMessage', {
          title: deleting?.title ?? '',
        })}
        confirmLabel={t('categories.deleteConfirm')}
        loading={deleteCategory.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
