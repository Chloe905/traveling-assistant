<template>
  <section class="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
    <h1 class="text-2xl font-bold text-morandi-ink">建立帳號</h1>
    <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
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

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.signUp({ name: name.value, email: email.value, password: password.value })
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'trips' })
  } catch {
    errorMessage.value = '註冊失敗，請換一組 email 或稍後再試。'
  } finally {
    isSubmitting.value = false
  }
}
</script>
