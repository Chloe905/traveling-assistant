<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">第 {{ day.id }} 天時間軸</h3>
        <p class="text-sm text-morandi-sageDark">{{ totalMinutes }} 分鐘含交通估算</p>
      </div>
      <button class="secondary-button" type="button" @click="$emit('add-spot')">手動加入行程</button>
    </div>

    <div v-if="day.spots.length" class="mt-5 space-y-4">
      <article v-for="spot in day.spots" :key="spot.id" class="rounded-xl border border-morandi-linen bg-morandi-mist/60 p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-morandi-sageDark">{{ spot.timeStart }} - {{ spot.timeEnd }}</p>
            <h4 class="mt-1 text-xl font-bold text-morandi-ink">{{ spot.spotName }}</h4>
            <p class="mt-2 text-sm text-morandi-sageDark">{{ spot.address || '未填地址/區域' }}</p>
            <p class="mt-3 text-sm leading-6 text-morandi-ink">{{ spot.transportNote }}</p>
            <p v-if="spot.aiReason" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-morandi-sageDark">{{ spot.aiReason }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="secondary-button" type="button" @click="$emit('move', spot.id, -1)">上移</button>
            <button class="secondary-button" type="button" @click="$emit('move', spot.id, 1)">下移</button>
            <button class="secondary-button" type="button" @click="$emit('edit', spot)">編輯</button>
            <button class="ghost-button text-morandi-rose" type="button" @click="$emit('delete', spot.id)">刪除</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="mt-5 rounded-xl border border-dashed border-morandi-sage p-8 text-center text-sm text-morandi-sageDark">
      這一天還沒有行程。可以先新增候選景點，再啟用 AI 排程。
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Spot, TripDay } from '@/types/models'
import { calculateDayDuration } from '@/utils/planner'

const props = defineProps<{
  day: TripDay
}>()

defineEmits<{
  edit: [spot: Spot]
  delete: [spotId: string]
  move: [spotId: string, direction: -1 | 1]
  'add-spot': []
}>()

const totalMinutes = computed(() => calculateDayDuration(props.day))
</script>
