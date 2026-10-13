import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/i18n/useTranslation'
import { categoriesApi } from '@/services/categoriesApi'
import { getApiErrorMessage } from '@/services/error'
import { useToast } from '@/store/hooks'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: number | string) => ['categories', 'detail', id] as const,
}

/** All categories of the current user. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesApi.getAll,
  })
}

/** A single category by id. */
export function useCategory(id: number | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id ?? 0),
    queryFn: () => categoriesApi.getById(id as number),
    enabled: id !== undefined && Number.isFinite(id),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => categoriesApi.create(payload),
    onSuccess: (category) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(t('categories.created', { title: category.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCategoryRequest
    }) => categoriesApi.update(id, payload),
    onSuccess: (category) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.setQueryData(categoryKeys.detail(category.id), category)
      toast.success(t('categories.updated', { title: category.title }))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (category: { id: number; title: string }) =>
      categoriesApi.remove(category.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success(t('categories.deleted'))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}