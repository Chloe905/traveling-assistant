<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.ai.title') }}</h3>
        <p class="mt-1 text-sm text-morandi-sageDark">{{ t('tripDetail.ai.description') }}</p>
      </div>
      <!-- <span class="rounded-full bg-morandi-blue/20 px-3 py-1 text-xs font-semibold text-morandi-ink">Mapless</span> -->
    </div>

    <div class="mt-4 grid gap-3">
      <label>
        <span class="form-label">{{ t('tripDetail.ai.destination') }}</span>
        <input v-model="localRequest.destination" class="form-field" type="text" />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label>
          <span class="form-label">{{ t('tripDetail.ai.dailyStart') }}</span>
          <input v-model="localRequest.dailyStartTime" class="form-field" type="time" />
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.ai.dailyEnd') }}</span>
          <input v-model="localRequest.dailyEndTime" class="form-field" type="time" />
        </label>
      </div>
      <label>
        <span class="form-label">{{ t('tripDetail.ai.travelStyle') }}</span>
        <select v-model="localRequest.travelStyle" class="form-field">
          <option value="relaxed">{{ t('tripDetail.travelStyles.relaxed') }}</option>
          <option value="balanced">{{ t('tripDetail.travelStyles.balanced') }}</option>
          <option value="packed">{{ t('tripDetail.travelStyles.packed') }}</option>
        </select>
      </label>
    </div>

    <button class="primary-button mt-4 w-full" type="button" :disabled="isPlanning || !canPlan" @click="$emit('plan', { ...localRequest })">
      {{ isPlanning ? t('tripDetail.ai.planning') : t('tripDetail.ai.plan') }}
    </button>

    <p class="mt-3 text-xs leading-5 text-morandi-sageDark">{{ t('tripDetail.ai.note') }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AiPlanRequest, Trip } from '@/types/models';

const props = defineProps<{
  trip: Trip;
  isPlanning: boolean;
}>();

defineEmits<{
  plan: [payload: AiPlanRequest];
}>();

const { t } = useI18n();
const localRequest = reactive<AiPlanRequest>({
  destination: '',
  dailyStartTime: '09:30',
  dailyEndTime: '20:30',
  travelStyle: 'balanced'
});

watch(
  () => props.trip,
  (trip) => {
    localRequest.destination = trip.destination || '';
    localRequest.dailyStartTime = trip.dailyStartTime || '09:30';
    localRequest.dailyEndTime = trip.dailyEndTime || '20:30';
    localRequest.travelStyle = trip.travelStyle || 'balanced';
  },
  { immediate: true }
);

const canPlan = computed(() => props.trip.candidateSpots.length > 0);
</script>
