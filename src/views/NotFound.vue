<template>
  <section class="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-soft">
    <p class="text-sm font-semibold text-morandi-sageDark">404</p>
    <h1 class="mt-2 text-2xl font-bold text-morandi-ink">{{ t('common.notFoundTitle') }}</h1>
    <RouterLink to="/trips" class="primary-button mt-6">{{ t('common.backToTrips') }}</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
