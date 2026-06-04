<template>
  <section class="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
    <h1 class="text-2xl font-bold text-morandi-ink">建立帳號</h1>
    <div v-if="verificationEmail" class="mt-6 rounded-xl border border-morandi-sage bg-morandi-sage/10 p-4">
      <h2 class="text-lg font-bold text-morandi-ink">請先到 email 完成驗證</h2>
      <p class="mt-2 text-sm leading-6 text-morandi-sageDark">
        我們已經把驗證信寄到 {{ verificationEmail }}。請點開信中的確認連結後，再回來登入。
      </p>
      <RouterLink to="/signin" class="primary-button mt-4 w-full">我已完成驗證，前往登入</RouterLink>
    </div>
    <form v-else class="mt-6 space-y-4" @submit.prevent="handleSubmit">
      <label>
        <span class="form-label">Name</span>
        <input v-model="name" class="form-field" type="text" required />
      </label>
      <label>
        <span class="form-label">Email</span>
        <input v-model="email" class="form-field" type="email" required />
      </label>
      <label>
        <span class="form-label">Password</span>
        <input v-model="password" class="form-field" type="password" minlength="6" required />
      </label>
      <p v-if="errorMessage" class="rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>
      <button class="primary-button w-full" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '建立中...' : '註冊並登入' }}
      </button>
      <RouterLink to="/signin" class="secondary-button w-full">已有帳號</RouterLink>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const verificationEmail = ref('')

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''

  if (/EMAIL_VERIFICATION_REQUIRED|email not confirmed|confirm your email/i.test(message)) {
    verificationEmail.value = email.value
    return ''
  }

  if (/already registered|already exists|user already registered/i.test(message)) {
    return '這個 email 已註冊，請直接登入或換一組 email。'
  }

  if (/email address.*invalid/i.test(message)) {
    return 'Supabase 判定此 email 格式不可用，請換一個有效 email。'
  }

  return message ? `註冊失敗：${message}` : '註冊失敗，請換一組 email 或稍後再試。'
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    verificationEmail.value = ''
    await authStore.signUp({ name: name.value, email: email.value, password: password.value })
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'trips' })
  } catch (error) {
    errorMessage.value = getAuthErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
