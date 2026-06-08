import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
})

apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const { token, guestId } = authStore

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (!token && guestId) {
    config.headers['X-Guest-Id'] = guestId
  }

  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      void authStore.logout()
    }

    return Promise.reject(error)
  }
)
