<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-morandi-linen/80 bg-white/85 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/trips" class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-morandi-sage text-sm font-bold text-white">TA</span>
        <span class="text-sm font-semibold tracking-wide text-morandi-ink">Traveling Assistant</span>
      </RouterLink>

      <div class="flex items-center gap-2">
        <span v-if="authStore.user" class="hidden text-sm text-morandi-sageDark sm:inline">
          {{ authStore.user.name }}
        </span>
        <button v-if="authStore.isAuthenticated" class="ghost-button" type="button" @click="handleLogout">
          登出
        </button>
        <RouterLink v-else to="/signin" class="secondary-button">
          登入
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'sign-in' })
}
</script>
