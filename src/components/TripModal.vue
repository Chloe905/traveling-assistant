<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/30 p-4">
    <form class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-morandi-sageDark">{{ mode === 'edit' ? 'Edit trip' : 'New trip' }}</p>
          <h2 class="mt-1 text-2xl font-bold text-morandi-ink">{{ mode === 'edit' ? '編輯旅程' : '建立新旅程' }}</h2>
        </div>
        <button class="ghost-button" type="button" @click="$emit('close')">關閉</button>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="form-label">旅程名稱</span>
          <input v-model="form.name" class="form-field" type="text" required />
        </label>
        <label>
          <span class="form-label">目的地</span>
          <input v-model="form.destination" class="form-field" type="text" placeholder="例如：京都" required />
        </label>
        <label>
          <span class="form-label">人數</span>
          <input v-model.number="form.people" class="form-field" type="number" min="1" required />
        </label>
        <label>
          <span class="form-label">開始日期</span>
          <input v-model="form.dateStart" class="form-field" type="date" required />
        </label>
        <label>
          <span class="form-label">結束日期</span>
          <input v-model="form.dateEnd" class="form-field" type="date" required />
        </label>
        <label>
          <span class="form-label">每日開始</span>
          <input v-model="form.dailyStartTime" class="form-field" type="time" required />
        </label>
        <label>
          <span class="form-label">每日結束</span>
          <input v-model="form.dailyEndTime" class="form-field" type="time" required />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">旅行風格</span>
          <select v-model="form.travelStyle" class="form-field">
            <option value="relaxed">輕鬆慢遊</option>
            <option value="balanced">適中平衡</option>
            <option value="packed">充實緊湊</option>
          </select>
        </label>
      </div>

      <p v-if="errorMessage" class="mt-4 rounded-lg bg-morandi-rose/15 px-3 py-2 text-sm text-morandi-ink">
        {{ errorMessage }}
      </p>

      <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button class="secondary-button" type="button" @click="$emit('close')">取消</button>
        <button class="primary-button" type="submit">儲存</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
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
    errorMessage.value = '結束日期不能早於開始日期。'
    return
  }

  emit('save', { ...form })
}
</script>
