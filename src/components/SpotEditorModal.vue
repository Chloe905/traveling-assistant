<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/30 p-4">
    <form class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-morandi-ink">{{ spot ? t('tripDetail.spotEditor.editTitle') : t('tripDetail.spotEditor.addTitle') }}</h3>
        <button class="ghost-button" type="button" @click="$emit('close')">{{ t('tripDetail.spotEditor.close') }}</button>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('tripDetail.spotEditor.name') }}</span>
          <input v-model="form.spotName" class="form-field" type="text" required />
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.spotEditor.start') }}</span>
          <input v-model="form.timeStart" class="form-field" type="time" required />
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.spotEditor.duration') }}</span>
          <input v-model.number="form.durationMinutes" class="form-field" type="number" min="15" step="15" />
        </label>
        <div>
          <span class="form-label">{{ t('tripDetail.spotEditor.end') }}</span>
          <div class="rounded-lg border border-morandi-linen bg-morandi-mist px-3 py-2 text-sm font-semibold text-morandi-sageDark">
            {{ calculatedTimeEnd }}
          </div>
        </div>
        <label>
          <span class="form-label">{{ t('tripDetail.spotEditor.transportMinutes') }}</span>
          <input v-model.number="form.transportMinutes" class="form-field" type="number" min="0" step="5" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('tripDetail.spotEditor.address') }}</span>
          <input v-model="form.address" class="form-field" type="text" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('tripDetail.spotEditor.transportNote') }}</span>
          <textarea v-model="form.transportNote" class="form-field min-h-20" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">{{ t('tripDetail.spotEditor.notes') }}</span>
          <textarea v-model="form.notes" class="form-field min-h-20" />
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button class="secondary-button" type="button" @click="$emit('close')">{{ t('tripDetail.spotEditor.cancel') }}</button>
        <button class="primary-button" type="submit">{{ t('tripDetail.spotEditor.save') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { v4 as uuid } from 'uuid'
import type { Spot } from '@/types/models'
import { addMinutesToTime } from '@/utils/planner'

const props = defineProps<{
  spot?: Spot | null
}>()

const emit = defineEmits<{
  save: [spot: Spot]
  close: []
}>()
const { t } = useI18n()

const emptySpot = (): Spot => ({
  id: uuid(),
  spotName: '',
  category: 'sightseeing',
  address: '',
  durationMinutes: 90,
  openTime: '09:00',
  closeTime: '21:00',
  priority: 'medium',
  notes: '',
  time: '09:30',
  timeStart: '09:30',
  timeEnd: '11:00',
  transportMinutes: 0,
  transportNote: t('tripDetail.spotEditor.defaultTransportNote'),
  aiReason: ''
})

const form = reactive<Spot>(emptySpot())
const calculatedTimeEnd = computed(() => addMinutesToTime(form.timeStart || '09:30', Number(form.durationMinutes || 0)))

watch(
  () => props.spot,
  spot => {
    Object.assign(form, spot || emptySpot())
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('save', {
    ...form,
    time: form.timeStart,
    timeEnd: calculatedTimeEnd.value
  })
}
</script>
