import { supabase } from './supabase'
import type { User } from '@/types/models'

interface AuthResponse {
  accessToken: string
  user: User
}

export const authApi = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session || !data.user.email) {
      throw error || new Error('Sign in failed')
    }

    const name = data.user.user_metadata.name || data.user.email.split('@')[0]
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name
    }

    return {
      accessToken: data.session.access_token,
      user
    }
  },

  async signUp(payload: { name: string; email: string; password: string }) {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name
        }
      }
    })

    if (error || !data.user?.email) {
      throw error || new Error('Sign up failed')
    }

    if (!data.session) {
      throw new Error('EMAIL_VERIFICATION_REQUIRED')
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email,
      name: payload.name
    })

    if (profileError) throw profileError

    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: payload.name
    }

    return {
      accessToken: data.session.access_token,
      user
    }
  },

  async signOut() {
    await supabase.auth.signOut()
  }
}
