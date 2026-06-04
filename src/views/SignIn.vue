<template>
  <section class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px]">
    <div class="flex flex-col justify-center rounded-2xl bg-morandi-sage/15 p-8">
      <p class="text-sm font-semibold text-morandi-sageDark">{{ t('auth.heroEyebrow') }}</p>
      <h1 class="mt-3 text-4xl font-bold text-morandi-ink">{{ t('auth.heroTitle') }}</h1>
      <p class="mt-4 text-base leading-7 text-morandi-sageDark">
        {{ t('auth.heroBody') }}
      </p>
    </div>

    <form class="rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-bold text-morandi-ink">{{ t('auth.signInTitle') }}</h2>
      <p class="mt-2 text-sm text-morandi-sageDark">{{ t('auth.signInHint') }}</p>

      <div class="mt-6 space-y-4">
        <label>
          <span class="form-label">{{ t('auth.email') }}</span>
          <input v-model="email" class="form-field" type="email" autocomplete="email" required />
        </label>
        <label>
          <span class="form-label">{{ t('auth.password') }}</span>
          <input v-model="password" class="form-field" type="password" autocomplete="current-password" required />
        </label>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>

      <button class="primary-button mt-6 w-full" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? t('auth.signingIn') : t('auth.signIn') }}
      </button>
      <RouterLink to="/signup" class="secondary-button mt-3 w-full">{{ t('auth.createAccount') }}</RouterLink>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''

  if (/email not confirmed/i.test(message)) {
    return t('auth.errors.emailNotConfirmed')
  }

  if (/invalid login credentials/i.test(message)) {
    return t('auth.errors.invalidCredentials')
  }

  if (/email address.*invalid/i.test(message)) {
    return t('auth.errors.invalidEmail')
  }

  return message ? t('auth.errors.signInFailed', { message }) : t('auth.errors.signInFallback')
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
