<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-morandi-linen/80 bg-white/85 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-morandi-sage text-sm font-bold text-white">C</span>
        <span class="text-sm font-semibold tracking-wide text-morandi-ink">{{ t('nav.appName') }}</span>
      </RouterLink>

      <div class="flex items-center gap-2">
        <label class="sr-only" for="locale-select">{{ t('nav.language') }}</label>
        <select id="locale-select" v-model="selectedLocale" class="language-select" :aria-label="t('nav.language')">
          <option v-for="option in localeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <span v-if="authStore.user" class="hidden text-sm text-morandi-sageDark sm:inline">
          {{ authStore.user.name }}
        </span>
        <button v-if="authStore.isAuthenticated" class="ghost-button" type="button" @click="handleLogout">
          {{ t('nav.logout') }}
        </button>
        <RouterLink v-else to="/signin" class="secondary-button">
          {{ t('nav.login') }}
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { SupportedLocale } from '@/i18n/messages';

const router = useRouter();
const authStore = useAuthStore();
const { locale, t } = useI18n();

const localeOptions = [
  { value: 'en', label: 'EN' },
  { value: 'zh-TW', label: '繁中' },
  { value: 'ja', label: '日本語' }
];

const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value as SupportedLocale;
    localStorage.setItem('locale', value);
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'sign-in' });
};
</script>
