<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/30 p-4">
    <form class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-morandi-sageDark">{{ mode === 'edit' ? t('trips.modal.eyebrowEdit') : t('trips.modal.eyebrowAdd') }}</p>
          <h2 class="mt-1 text-2xl font-bold text-morandi-ink">{{ mode === 'edit' ? t('trips.modal.titleEdit') : t('trips.modal.titleAdd') }}</h2>
        </div>
        <button class="ghost-button" type="button" @click="$emit('close')">{{ t('trips.modal.close') }}</button>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('trips.modal.name') }}</span>
          <input v-model="form.name" class="form-field" type="text" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.destination') }}</span>
          <input v-model="form.destination" class="form-field" type="text" :placeholder="t('trips.modal.destinationPlaceholder')" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.people') }}</span>
          <input v-model.number="form.people" class="form-field" type="number" min="1" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.dateStart') }}</span>
          <input v-model="form.dateStart" class="form-field" type="date" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.dateEnd') }}</span>
          <input v-model="form.dateEnd" class="form-field" type="date" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.dailyStart') }}</span>
          <input v-model="form.dailyStartTime" class="form-field" type="time" required />
        </label>
        <label>
          <span class="form-label">{{ t('trips.modal.dailyEnd') }}</span>
          <input v-model="form.dailyEndTime" class="form-field" type="time" required />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('trips.modal.travelStyle') }}</span>
          <select v-model="form.travelStyle" class="form-field">
            <option value="relaxed">{{ t('trips.modal.styles.relaxed') }}</option>
            <option value="balanced">{{ t('trips.modal.styles.balanced') }}</option>
            <option value="packed">{{ t('trips.modal.styles.packed') }}</option>
          </select>
        </label>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>

      <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button class="secondary-button" type="button" @click="$emit('close')">{{ t('trips.modal.cancel') }}</button>
        <button class="primary-button" type="submit">{{ t('trips.modal.save') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Trip, TripForm } from '@/types/models'

const props = defineProps<{
  mode: 'add' | 'edit'
  trip?: Trip | null
}>()

const emit = defineEmits<{
  close: []
  save: [payload: TripForm]
}>()

const emptyForm = (): TripForm => ({
  name: '',
  dateStart: new Date().toISOString().slice(0, 10),
  dateEnd: new Date().toISOString().slice(0, 10),
  people: 1,
  destination: '',
  dailyStartTime: '09:30',
  dailyEndTime: '20:30',
  travelStyle: 'balanced'
})

const form = reactive<TripForm>(emptyForm())
const errorMessage = ref('')
const { t } = useI18n()

watch(
  () => props.trip,
  trip => {
    Object.assign(form, trip ? {
      name: trip.name,
      dateStart: trip.dateStart,
      dateEnd: trip.dateEnd,
      people: trip.people,
      destination: trip.destination || '',
      dailyStartTime: trip.dailyStartTime || '09:30',
      dailyEndTime: trip.dailyEndTime || '20:30',
      travelStyle: trip.travelStyle || 'balanced'
    } : emptyForm())
  },
  { immediate: true }
)

const handleSubmit = () => {
  errorMessage.value = ''

  if (form.dateStart > form.dateEnd) {
    errorMessage.value = t('trips.modal.dateError')
    return
  }

  emit('save', { ...form })
}
</script>
