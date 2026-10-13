import type { Category, OperationType } from '@/types/api'

/**
 * Direction of an operation, derived from the title of the operation type
 * attached to its category. The API does not expose an operation-type field on
 * operations themselves; `type` filtering accepts 'income' | 'expense'.
 */
export type OperationKind = 'income' | 'expense'

export function resolveOperationKind(typeTitle?: string): OperationKind {
  return typeTitle?.trim().toLowerCase() === 'income' ? 'income' : 'expense'
}

/** Fast lookup of a category by id. */
export function buildCategoryMap(categories: Category[]): Map<number, Category> {
  return new Map(categories.map((category) => [category.id, category]))
}

/** Fast lookup of an operation type by id. */
export function buildOperationTypeMap(
  types: OperationType[],
): Map<number, OperationType> {
  return new Map(types.map((type) => [type.id, type]))
}

/** Kind of an operation, resolved through category → operation type. */
export function resolveOperationKindForCategory(
  categoryId: number,
  categoryMap: Map<number, Category>,
  typeMap: Map<number, OperationType>,
): OperationKind {
  const category = categoryMap.get(categoryId)
  if (!category) return 'expense'
  return resolveOperationKind(typeMap.get(category.operation_type_id)?.title)
}