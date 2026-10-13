import { http } from './http'
import type {
  CategoriesResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'

/** Category endpoints from swagger: /categories, /categories/{id}. */
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await http.get<CategoriesResponse>('/categories')
    return data.categories
  },

  async getById(id: number): Promise<Category> {
    const { data } = await http.get<Category>(`/categories/${id}`)
    return data
  },

  async create(payload: CreateCategoryRequest): Promise<Category> {
    const { data } = await http.post<Category>('/categories', payload)
    return data
  },

  /** Uses PATCH with `version` for optimistic concurrency control. */
  async update(id: number, payload: UpdateCategoryRequest): Promise<Category> {
    const { data } = await http.patch<Category>(`/categories/${id}`, payload)
    return data
  },

  /** Responds with 204 No Content. */
  async remove(id: number): Promise<void> {
    await http.delete(`/categories/${id}`)
  },
}