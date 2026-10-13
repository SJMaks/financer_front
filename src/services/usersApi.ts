import { http } from './http'
import type { UpdateUserRequest, User } from '@/types/api'

/** Current-user endpoints from swagger: /users/me. */
export const usersApi = {
  async getMe(): Promise<User> {
    const { data } = await http.get<User>('/users/me')
    return data
  },

  async updateMe(data: UpdateUserRequest): Promise<User> {
    const { data: body } = await http.patch<User>('/users/me', data)
    return body
  },

  /** Deletes the current user; responds with 204 No Content. */
  async deleteMe(): Promise<void> {
    await http.delete('/users/me')
  },
}