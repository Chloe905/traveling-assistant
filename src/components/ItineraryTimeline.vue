<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.timeline.title', { day: day.id }) }}</h3>
        <p class="text-sm text-morandi-sageDark">{{ t('tripDetail.timeline.totalMinutes', { total: totalMinutes }) }}</p>
      </div>
      <button class="secondary-button" type="button" @click="$emit('add-spot')">{{ t('tripDetail.timeline.addSpot') }}</button>
    </div>

    <div v-if="day.spots.length" class="mt-5 space-y-4">
      <article
        v-for="spot in day.spots"
        :key="spot.id"
        class="itinerary-timeline__item rounded-xl border border-morandi-linen bg-morandi-mist/60 p-4"
        :class="{ 'is-active': draggedSpotId === spot.id }"
        draggable="true"
        @dragstart="handleDragStart($event, spot.id)"
        @dragend="handleDragEnd"
        @dragover.prevent
        @drop.prevent="handleDrop(spot.id)"
      >
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-morandi-sageDark">{{ t('tripDetail.timeline.dragHint') }}</p>
            <p class="text-sm font-semibold text-morandi-sageDark">{{ spot.timeStart }} - {{ spot.timeEnd }}</p>
            <h4 class="mt-1 text-xl font-bold text-morandi-ink">{{ spot.spotName }}</h4>
            <p class="mt-2 text-sm text-morandi-sageDark">{{ spot.address || t('tripDetail.timeline.emptyAddress') }}</p>
            <p class="mt-3 text-sm leading-6 text-morandi-ink">{{ spot.transportNote }}</p>
            <p v-if="spot.aiReason" class="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-morandi-sageDark">{{ spot.aiReason }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="secondary-button" type="button" @click="$emit('edit', spot)">{{ t('tripDetail.actions.edit') }}</button>
            <button class="ghost-button text-morandi-rose" type="button" @click="$emit('delete', spot.id)">{{ t('tripDetail.actions.delete') }}</button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="mt-5 rounded-xl border border-dashed border-morandi-sage p-8 text-center text-sm text-morandi-sageDark">
      {{ t('tripDetail.timeline.empty') }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Spot, TripDay } from '@/types/models'
import { calculateDayDuration } from '@/utils/planner'

const props = defineProps<{
  day: TripDay
}>()

const { t } = useI18n()
const emit = defineEmits<{
  edit: [spot: Spot]
  delete: [spotId: string]
  reorder: [sourceSpotId: string, targetSpotId: string]
  'add-spot': []
}>()
const draggedSpotId = ref<string | null>(null)
const totalMinutes = computed(() => calculateDayDuration(props.day))

const handleDragStart = (event: DragEvent, spotId: string) => {
  event.dataTransfer?.setData('text/plain', spotId)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
  draggedSpotId.value = spotId
}

const handleDragEnd = () => {
  draggedSpotId.value = null
}

const handleDrop = (targetSpotId: string) => {
  if (!draggedSpotId.value || draggedSpotId.value === targetSpotId) return
  emit('reorder', draggedSpotId.value, targetSpotId)
  draggedSpotId.value = null
}
</script>
