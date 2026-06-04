<template>
  <article class="rounded-2xl border border-morandi-linen bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-morandi-sage">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <button class="min-w-0 flex-1 text-left" type="button" @click="$emit('open', trip.id)">
        <p class="text-xs font-semibold uppercase tracking-wide text-morandi-sageDark">{{ trip.destination || '未設定目的地' }}</p>
        <h2 class="mt-2 text-xl font-bold text-morandi-ink">{{ trip.name }}</h2>
        <div class="mt-4 flex flex-wrap gap-2 text-sm text-morandi-sageDark">
          <span class="rounded-full bg-morandi-mist px-3 py-1">{{ trip.dateStart }} - {{ trip.dateEnd }}</span>
          <span class="rounded-full bg-morandi-mist px-3 py-1">{{ trip.people }} 人</span>
          <span class="rounded-full bg-morandi-mist px-3 py-1">{{ plannedCount }} 個行程</span>
        </div>
      </button>

      <div class="flex shrink-0 gap-2">
        <button class="secondary-button" type="button" @click="$emit('edit', trip)">編輯</button>
        <button class="ghost-button text-morandi-rose" type="button" @click="$emit('delete', trip.id)">刪除</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Trip } from '@/types/models'
import { countPlannedSpots } from '@/utils/planner'

const props = defineProps<{
  trip: Trip
}>()

defineEmits<{
  open: [id: string]
  edit: [trip: Trip]
  delete: [id: string]
}>()

const plannedCount = computed(() => countPlannedSpots(props.trip.days || []))
</script>
