<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-morandi-ink/35 p-4">
    <section class="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div>
        <p class="text-sm font-semibold text-morandi-sageDark">{{ eyebrow }}</p>
        <h2 :id="titleId" class="mt-2 text-2xl font-bold text-morandi-ink">{{ title }}</h2>
        <p class="mt-3 text-sm leading-6 text-morandi-sageDark">{{ message }}</p>
      </div>

      <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button class="secondary-button" type="button" @click="$emit('cancel')">{{ cancelLabel }}</button>
        <button class="primary-button bg-morandi-rose hover:bg-morandi-ink" type="button" @click="$emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const titleId = `confirm-dialog-${Math.random().toString(36).slice(2)}`

defineProps<{
  eyebrow: string
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
