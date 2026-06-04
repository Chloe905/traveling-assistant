import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/auth-api'
import type { User } from '@/types/models'

const storedUser = () => {
  const user = localStorage.getItem('user')
  return user ? (JSON.parse(user) as User) : null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(storedUser())
  const token = ref(localStorage.getItem('token'))
  const guestId = ref(localStorage.getItem('guestId'))
  const isAuthenticated = computed(() => Boolean((token.value && user.value) || guestId.value))

  const persistSession = (accessToken: string, currentUser: User) => {
    token.value = accessToken
    user.value = currentUser
    guestId.value = null
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(currentUser))
    localStorage.removeItem('guestId')
  }

  const signIn = async (email: string, password: string) => {
    const data = await authApi.signIn(email, password)
    persistSession(data.accessToken, data.user)
  }

  const signUp = async (payload: { name: string; email: string; password: string }) => {
    const data = await authApi.signUp(payload)
    persistSession(data.accessToken, data.user)
  }

  const logout = async () => {
    await authApi.signOut()
    token.value = null
    user.value = null
    guestId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestId')
  }

  const setGuestSession = (id: string, name: string) => {
    guestId.value = id
    user.value = { id: 0, email: '', name }
    localStorage.setItem('guestId', id)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user,
    token,
    isAuthenticated,
    signIn,
    signUp,
    logout,
    setGuestSession
  }
})
