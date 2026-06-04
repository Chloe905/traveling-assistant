<template>
  <section class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px]">
    <div class="flex flex-col justify-center rounded-2xl bg-morandi-sage/15 p-8">
      <p class="text-sm font-semibold text-morandi-sageDark">AI itinerary workspace</p>
      <h1 class="mt-3 text-4xl font-bold text-morandi-ink">把想去的景點整理成可調整的每日行程</h1>
      <p class="mt-4 text-base leading-7 text-morandi-sageDark">
        手動加入候選景點，讓 AI 先排出時間、停留與交通備註，再依照旅伴需求共同調整。
      </p>
    </div>

    <form class="rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-bold text-morandi-ink">登入</h2>
      <p class="mt-2 text-sm text-morandi-sageDark">請使用 Supabase Auth 已註冊的 email 與密碼。</p>

      <div class="mt-6 space-y-4">
        <label>
          <span class="form-label">Email</span>
          <input v-model="email" class="form-field" type="email" autocomplete="email" required />
        </label>
        <label>
          <span class="form-label">Password</span>
          <input v-model="password" class="form-field" type="password" autocomplete="current-password" required />
        </label>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>

      <button class="primary-button mt-6 w-full" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '登入中...' : '登入' }}
      </button>
      <RouterLink to="/signup" class="secondary-button mt-3 w-full">建立新帳號</RouterLink>
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
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''

  if (/email not confirmed/i.test(message)) {
    return '此 email 尚未驗證。面試 demo 可先到 Supabase Auth 關閉 Confirm email，或先完成驗證信。'
  }

  if (/invalid login credentials/i.test(message)) {
    return '帳號或密碼不正確，請確認你輸入的是 Supabase Auth 裡的註冊帳號。'
  }

  if (/email address.*invalid/i.test(message)) {
    return 'Supabase 判定此 email 格式不可用，請換一個有效 email。'
  }

  return message ? `登入失敗：${message}` : '登入失敗，請確認帳號密碼或 Supabase Auth 設定。'
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await authStore.signIn(email.value, password.value)
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'trips' })
  } catch (error) {
    errorMessage.value = getAuthErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
