<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-morandi-ink/30 p-4">
    <form class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="handleSubmit">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-morandi-ink">{{ spot ? '編輯行程' : '手動加入行程' }}</h3>
        <button class="ghost-button" type="button" @click="$emit('close')">關閉</button>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2">
          <span class="form-label">景點名稱</span>
          <input v-model="form.spotName" class="form-field" type="text" required />
        </label>
        <label>
          <span class="form-label">開始</span>
          <input v-model="form.timeStart" class="form-field" type="time" required />
        </label>
        <label>
          <span class="form-label">停留分鐘</span>
          <input v-model.number="form.durationMinutes" class="form-field" type="number" min="15" step="15" />
        </label>
        <div>
          <span class="form-label">結束</span>
          <div class="rounded-lg border border-morandi-linen bg-morandi-mist px-3 py-2 text-sm font-semibold text-morandi-sageDark">
            {{ calculatedTimeEnd }}
          </div>
        </div>
        <label>
          <span class="form-label">交通分鐘</span>
          <input v-model.number="form.transportMinutes" class="form-field" type="number" min="0" step="5" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">地址 / 區域</span>
          <input v-model="form.address" class="form-field" type="text" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">交通備註</span>
          <textarea v-model="form.transportNote" class="form-field min-h-20" />
        </label>
        <label class="sm:col-span-2">
          <span class="form-label">備註</span>
          <textarea v-model="form.notes" class="form-field min-h-20" />
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button class="secondary-button" type="button" @click="$emit('close')">取消</button>
        <button class="primary-button" type="submit">儲存</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
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
  transportNote: '手動加入，可自行補上交通方式。',
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
