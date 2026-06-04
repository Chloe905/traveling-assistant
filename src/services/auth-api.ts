import { apiClient } from './http'
import type { User } from '@/types/models'

interface AuthResponse {
  accessToken: string
  user: User
}

export const authApi = {
  async signIn(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/login', { email, password })
    return data
  },

  async signUp(payload: { name: string; email: string; password: string }) {
    const { data } = await apiClient.post<AuthResponse>('/register', payload)
    return data
  }
}
