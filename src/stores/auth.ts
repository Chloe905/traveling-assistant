import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/auth-api'
import type { User } from '@/types/models'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const guestId = ref<string | null>(null)
  const isAuthenticated = computed(() => Boolean((token.value && user.value) || guestId.value))

  const setSession = (accessToken: string, currentUser: User) => {
    token.value = accessToken
    user.value = currentUser
    guestId.value = null
  }

  const signIn = async (email: string, password: string) => {
    const data = await authApi.signIn(email, password)
    setSession(data.accessToken, data.user)
  }

  const signUp = async (payload: { name: string; email: string; password: string }) => {
    const data = await authApi.signUp(payload)
    setSession(data.accessToken, data.user)
  }

  const logout = async () => {
    token.value = null
    user.value = null
    guestId.value = null
    await authApi.signOut().catch(() => undefined)
  }

  const setGuestSession = (id: string, name: string) => {
    token.value = null
    guestId.value = id
    user.value = { id: 0, email: '', name }
  }

  return {
    user,
    token,
    guestId,
    isAuthenticated,
    signIn,
    signUp,
    logout,
    setGuestSession
  }
})
