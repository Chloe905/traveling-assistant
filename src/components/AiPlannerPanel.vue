<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">AI 排程</h3>
        <p class="mt-1 text-sm text-morandi-sageDark">Mock AI 會依優先級、停留時間與每日節奏安排。</p>
      </div>
      <span class="rounded-full bg-morandi-blue/20 px-3 py-1 text-xs font-semibold text-morandi-ink">Mapless</span>
    </div>

    <div class="mt-4 grid gap-3">
      <label>
        <span class="form-label">目的地</span>
        <input v-model="localRequest.destination" class="form-field" type="text" />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label>
          <span class="form-label">每日開始</span>
          <input v-model="localRequest.dailyStartTime" class="form-field" type="time" />
        </label>
        <label>
          <span class="form-label">每日結束</span>
          <input v-model="localRequest.dailyEndTime" class="form-field" type="time" />
        </label>
      </div>
      <label>
        <span class="form-label">旅行風格</span>
        <select v-model="localRequest.travelStyle" class="form-field">
          <option value="relaxed">輕鬆慢遊</option>
          <option value="balanced">適中平衡</option>
          <option value="packed">充實緊湊</option>
        </select>
      </label>
    </div>

    <button class="primary-button mt-4 w-full" type="button" :disabled="isPlanning || !canPlan" @click="$emit('plan', { ...localRequest })">
      {{ isPlanning ? 'AI 安排中...' : '啟用 AI 排行程' }}
    </button>

    <p class="mt-3 text-xs leading-5 text-morandi-sageDark">
      交通時間目前為 AI 估算文字，可在時間軸中手動修正。
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { AiPlanRequest, Trip } from '@/types/models'

const props = defineProps<{
  trip: Trip
  isPlanning: boolean
}>()

defineEmits<{
  plan: [payload: AiPlanRequest]
}>()

const localRequest = reactive<AiPlanRequest>({
  destination: '',
  dailyStartTime: '09:30',
  dailyEndTime: '20:30',
  travelStyle: 'balanced'
})

watch(
  () => props.trip,
  trip => {
    localRequest.destination = trip.destination || ''
    localRequest.dailyStartTime = trip.dailyStartTime || '09:30'
    localRequest.dailyEndTime = trip.dailyEndTime || '20:30'
    localRequest.travelStyle = trip.travelStyle || 'balanced'
  },
  { immediate: true }
)

const canPlan = computed(() => props.trip.candidateSpots.length > 0)
</script>
