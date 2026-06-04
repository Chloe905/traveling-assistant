<template>
  <section class="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
    <h1 class="text-2xl font-bold text-morandi-ink">{{ t('auth.signUpTitle') }}</h1>
    <div v-if="verificationEmail" class="mt-6 rounded-xl border border-morandi-sage bg-morandi-sage/10 p-4">
      <h2 class="text-lg font-bold text-morandi-ink">{{ t('auth.verifyTitle') }}</h2>
      <p class="mt-2 text-sm leading-6 text-morandi-sageDark">
        {{ t('auth.verifyBody', { email: verificationEmail }) }}
      </p>
      <RouterLink to="/signin" class="primary-button mt-4 w-full">{{ t('auth.goToSignIn') }}</RouterLink>
    </div>
    <form v-else class="mt-6 space-y-4" @submit.prevent="handleSubmit">
      <label>
        <span class="form-label">{{ t('auth.name') }}</span>
        <input v-model="name" class="form-field" type="text" required />
      </label>
      <label>
        <span class="form-label">{{ t('auth.email') }}</span>
        <input v-model="email" class="form-field" type="email" required />
      </label>
      <label>
        <span class="form-label">{{ t('auth.password') }}</span>
        <input v-model="password" class="form-field" type="password" minlength="6" required />
      </label>
      <p v-if="errorMessage" class="rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>
      <button class="primary-button w-full" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? t('auth.creating') : t('auth.signUpAndLogin') }}
      </button>
      <RouterLink to="/signin" class="secondary-button w-full">{{ t('auth.alreadyHaveAccount') }}</RouterLink>
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
    return t('auth.errors.emailAlreadyRegistered')
  }

  if (/email address.*invalid/i.test(message)) {
    return t('auth.errors.invalidEmail')
  }

  return message ? t('auth.errors.signUpFailed', { message }) : t('auth.errors.signUpFallback')
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
