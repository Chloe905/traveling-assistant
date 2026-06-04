<template>
  <section class="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-soft">
    <div v-if="isLoading" class="py-10 text-center text-morandi-sageDark">讀取邀請中...</div>

    <div v-else-if="invite">
      <p class="text-sm font-semibold text-morandi-sageDark">Trip invite</p>
      <h1 class="mt-2 text-3xl font-bold text-morandi-ink">加入「{{ invite.tripName }}」</h1>
      <p class="mt-3 text-sm leading-6 text-morandi-sageDark">
        {{ invite.destination }} · {{ invite.dateStart }} - {{ invite.dateEnd }} · {{ invite.people }} 人
      </p>

      <div class="mt-6 rounded-xl bg-morandi-mist p-4">
        <h2 class="text-lg font-bold text-morandi-ink">選擇加入方式</h2>
        <p class="mt-2 text-sm leading-6 text-morandi-sageDark">
          登入後加入會和你的帳號綁定；訪客加入適合先快速共同編輯，之後仍可再註冊正式帳號。
        </p>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-morandi-linen p-4">
          <h3 class="font-bold text-morandi-ink">用帳號加入</h3>
          <p class="mt-2 text-sm text-morandi-sageDark">
            {{ authStore.isAuthenticated ? '你已登入，可以直接加入。' : '登入或註冊後再回到此連結加入。' }}
          </p>
          <button v-if="authStore.isAuthenticated" class="primary-button mt-4 w-full" type="button" @click="acceptAsUser">
            直接加入
          </button>
          <div v-else class="mt-4 grid gap-2">
            <RouterLink :to="{ name: 'sign-in', query: { redirect: route.fullPath } }" class="primary-button w-full">
              登入
            </RouterLink>
            <RouterLink :to="{ name: 'sign-up', query: { redirect: route.fullPath } }" class="secondary-button w-full">
              註冊
            </RouterLink>
          </div>
        </div>

        <form class="rounded-xl border border-morandi-linen p-4" @submit.prevent="acceptAsGuest">
          <h3 class="font-bold text-morandi-ink">訪客加入</h3>
          <label class="mt-4 block">
            <span class="form-label">顯示名稱</span>
            <input v-model="guestName" class="form-field" type="text" placeholder="例如：Chloe" required />
          </label>
          <button class="primary-button mt-4 w-full" type="submit">以訪客加入</button>
        </form>
      </div>

      <p v-if="message" class="mt-5 rounded-lg px-3 py-2 text-sm" :class="hasError ? 'bg-morandi-rose/15 text-morandi-ink' : 'bg-morandi-sage/15 text-morandi-sageDark'">
        {{ message }}
      </p>
    </div>

    <div v-else class="py-10 text-center">
      <h1 class="text-2xl font-bold text-morandi-ink">邀請連結不存在</h1>
      <p class="mt-2 text-sm text-morandi-sageDark">請確認連結是否完整，或請旅程建立者重新產生邀請連結。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import { tripApi } from '@/services/trip-api'
import { useAuthStore } from '@/stores/auth'
import type { InvitePreview } from '@/types/models'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invite = ref<InvitePreview | null>(null)
const guestName = ref('')
const message = ref('')
const hasError = ref(false)
const isLoading = ref(true)

const token = String(route.params.token)

const loadInvite = async () => {
  isLoading.value = true
  try {
    invite.value = await tripApi.fetchInvite(token)
  } catch {
    invite.value = null
  } finally {
    isLoading.value = false
  }
}

const handleAccepted = async (tripId: string) => {
  message.value = '加入成功，正在前往旅程...'
  hasError.value = false
  await router.push({ name: 'trip-detail', params: { id: tripId } })
}

const acceptAsUser = async () => {
  try {
    const result = await tripApi.acceptInvite(token)
    await handleAccepted(result.tripId)
  } catch {
    hasError.value = true
    message.value = '加入失敗，請重新登入或請旅程建立者重新產生連結。'
  }
}

const acceptAsGuest = async () => {
  try {
    const guestIdKey = `guest:${token}`
    const guestId = localStorage.getItem(guestIdKey) || uuid()
    localStorage.setItem(guestIdKey, guestId)
    const result = await tripApi.acceptInvite(token, { guestName: guestName.value, guestId })
    authStore.setGuestSession(result.collaborator.guestId || guestId, result.collaborator.name)
    await handleAccepted(result.tripId)
  } catch {
    hasError.value = true
    message.value = '訪客加入失敗，請確認名稱或稍後再試。'
  }
}

onMounted(loadInvite)
</script>
