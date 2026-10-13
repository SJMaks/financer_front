import { http } from './http'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/api'

/** Auth endpoints from swagger: POST /auth/login, POST /auth/register. */
export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { data: body } = await http.post<LoginResponse>('/auth/login', data)
    return body
  },

  async register(data: RegisterRequest): Promise<User> {
    const { data: body } = await http.post<User>('/auth/register', data)
    return body
  },
}