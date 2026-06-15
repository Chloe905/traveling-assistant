<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.ai.title') }}</h3>
        <p class="mt-1 text-sm text-morandi-sageDark">{{ t('tripDetail.ai.description') }}</p>
      </div>
      <!-- <span class="rounded-full bg-morandi-blue/20 px-3 py-1 text-xs font-semibold text-morandi-ink">Mapless</span> -->
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-morandi-mist p-1">
      <button
        class="rounded-lg px-3 py-2 text-sm font-semibold transition"
        :class="localRequest.mode === 'candidate' ? 'bg-white text-morandi-ink shadow-sm' : 'text-morandi-sageDark hover:text-morandi-ink'"
        type="button"
        @click="localRequest.mode = 'candidate'"
      >
        {{ t('tripDetail.ai.candidateMode') }}
      </button>
      <button
        class="rounded-lg px-3 py-2 text-sm font-semibold transition"
        :class="localRequest.mode === 'preference' ? 'bg-white text-morandi-ink shadow-sm' : 'text-morandi-sageDark hover:text-morandi-ink'"
        type="button"
        @click="localRequest.mode = 'preference'"
      >
        {{ t('tripDetail.ai.preferenceMode') }}
      </button>
    </div>

    <div class="mt-4 grid gap-3">
      <label>
        <span class="form-label">{{ t('tripDetail.ai.destination') }}</span>
        <input v-model="localRequest.destination" class="form-field" type="text" />
      </label>

      <template v-if="localRequest.mode === 'preference'">
        <div class="grid grid-cols-2 gap-3">
          <label>
            <span class="form-label">{{ t('tripDetail.ai.people') }}</span>
            <input v-model.number="localRequest.people" class="form-field" min="1" type="number" />
          </label>
          <label>
            <span class="form-label">{{ t('tripDetail.ai.playDays') }}</span>
            <input v-model.number="localRequest.playDays" class="form-field" min="1" max="14" type="number" />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label>
            <span class="form-label">{{ t('tripDetail.ai.season') }}</span>
            <select v-model="localRequest.season" class="form-field">
              <option value="spring">{{ t('tripDetail.ai.seasons.spring') }}</option>
              <option value="summer">{{ t('tripDetail.ai.seasons.summer') }}</option>
              <option value="autumn">{{ t('tripDetail.ai.seasons.autumn') }}</option>
              <option value="winter">{{ t('tripDetail.ai.seasons.winter') }}</option>
            </select>
          </label>
          <label>
            <span class="form-label">{{ t('tripDetail.ai.routePreference') }}</span>
            <select v-model="localRequest.routePreference" class="form-field">
              <option value="mixed">{{ t('tripDetail.ai.routes.mixed') }}</option>
              <option value="classic">{{ t('tripDetail.ai.routes.classic') }}</option>
              <option value="hidden">{{ t('tripDetail.ai.routes.hidden') }}</option>
            </select>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <label>
            <span class="form-label">{{ t('tripDetail.ai.adults') }}</span>
            <input v-model.number="localRequest.adultCount" class="form-field" min="0" type="number" />
          </label>
          <label>
            <span class="form-label">{{ t('tripDetail.ai.children') }}</span>
            <input v-model.number="localRequest.childCount" class="form-field" min="0" type="number" />
          </label>
        </div>
      </template>

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

      <fieldset v-if="localRequest.mode === 'preference'" class="space-y-2">
        <legend class="form-label">{{ t('tripDetail.ai.attractionTypes') }}</legend>
        <div class="grid grid-cols-2 gap-2">
          <label v-for="type in attractionTypeOptions" :key="type" class="flex items-center gap-2 rounded-lg bg-morandi-mist px-3 py-2 text-sm text-morandi-ink">
            <input v-model="localRequest.attractionTypes" class="accent-morandi-sage" type="checkbox" :value="type" />
            <span>{{ t(`tripDetail.ai.attractions.${type}`) }}</span>
          </label>
        </div>
      </fieldset>

      <label v-if="localRequest.mode === 'preference'">
        <span class="form-label">{{ t('tripDetail.ai.mobilityNeeds') }}</span>
        <select v-model="localRequest.mobilityNeeds" class="form-field">
          <option value="none">{{ t('tripDetail.ai.mobility.none') }}</option>
          <option value="kids">{{ t('tripDetail.ai.mobility.kids') }}</option>
          <option value="senior">{{ t('tripDetail.ai.mobility.senior') }}</option>
        </select>
      </label>

      <label v-if="localRequest.mode === 'preference'">
        <span class="form-label">{{ t('tripDetail.ai.specialRequests') }}</span>
        <textarea v-model="localRequest.specialRequests" class="form-field min-h-24 resize-y" :placeholder="t('tripDetail.ai.specialRequestsPlaceholder')" />
      </label>
    </div>

    <button class="primary-button mt-4 w-full" type="button" :disabled="isPlanning || !canPlan" @click="$emit('plan', { ...localRequest })">
      {{ isPlanning ? t('tripDetail.ai.planning') : t('tripDetail.ai.plan') }}
    </button>

    <p class="mt-3 text-xs leading-5 text-morandi-sageDark">{{ localRequest.mode === 'preference' ? t('tripDetail.ai.preferenceNote') : t('tripDetail.ai.note') }}</p>
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
  mode: 'candidate',
  destination: '',
  dailyStartTime: '09:30',
  dailyEndTime: '20:30',
  travelStyle: 'balanced',
  people: 2,
  adultCount: 2,
  childCount: 0,
  playDays: 3,
  season: 'spring',
  routePreference: 'mixed',
  attractionTypes: ['city', 'shopping'],
  mobilityNeeds: 'none',
  specialRequests: ''
});

const attractionTypeOptions = ['beach', 'mountain', 'forest', 'snow', 'city', 'shopping', 'family', 'senior'];

watch(
  () => props.trip,
  (trip) => {
    localRequest.destination = trip.destination || '';
    localRequest.dailyStartTime = trip.dailyStartTime || '09:30';
    localRequest.dailyEndTime = trip.dailyEndTime || '20:30';
    localRequest.travelStyle = trip.travelStyle || 'balanced';
    localRequest.people = trip.people || 2;
    localRequest.adultCount = trip.people || 2;
    localRequest.childCount = 0;
    localRequest.playDays = Math.max(1, trip.days.length || 3);
  },
  { immediate: true }
);

const canPlan = computed(() => {
  if (!localRequest.destination.trim()) return false;
  if (localRequest.mode === 'preference') {
    return Number(localRequest.people) > 0 && Number(localRequest.playDays) > 0 && Boolean(localRequest.attractionTypes?.length);
  }
  return props.trip.candidateSpots.length > 0;
});
</script>
