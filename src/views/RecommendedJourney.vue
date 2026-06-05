<template>
  <section v-if="content" class="recommended-journey">
    <RouterLink to="/" class="recommended-journey__back">← Back to journeys</RouterLink>

    <header class="recommended-journey__hero">
      <div>
        <p class="landing-page__eyebrow">{{ content.seasonLabel }}</p>
        <h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-morandi-ink sm:text-6xl">
          {{ content.title }}
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-morandi-sageDark">
          {{ content.summary }}
        </p>
      </div>

      <dl class="recommended-journey__facts">
        <div>
          <dt>Destination</dt>
          <dd>{{ content.destination }}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{{ content.duration }}</dd>
        </div>
        <div>
          <dt>Style</dt>
          <dd>{{ content.style }}</dd>
        </div>
        <div v-if="content.bestTime">
          <dt>{{ bestTimeLabel }}</dt>
          <dd>{{ content.bestTime }}</dd>
        </div>
      </dl>
    </header>

    <div class="recommended-journey__days">
      <article v-for="(day, index) in content.days" :key="day.title" class="recommended-journey__day">
        <div class="recommended-journey__day-heading">
          <span>Day {{ index + 1 }}</span>
          <div>
            <h2>{{ day.title }}</h2>
            <p>{{ day.summary }}</p>
          </div>
        </div>

        <div class="recommended-journey__timeline">
          <div v-for="stop in day.stops" :key="`${day.title}-${stop.time}`" class="recommended-journey__stop">
            <time>{{ stop.time }}</time>
            <div>
              <h3>{{ stop.name }}</h3>
              <p>{{ stop.note }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="recommended-journey__cta">
      <p>{{ ctaText }}</p>
      <button class="primary-button" type="button" :disabled="isCopying" @click="copyRecommendedJourney">
        {{ isCopying ? copyingText : startText }}
      </button>
      <p v-if="errorMessage" class="recommended-journey__error">{{ errorMessage }}</p>
    </div>
  </section>

  <section v-else class="recommended-journey">
    <div class="recommended-journey__empty">
      <h1>Recommended journey not found</h1>
      <RouterLink to="/" class="primary-button mt-5">Back to landing</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuid } from 'uuid';
import { getRecommendedJourney } from '@/data/recommendedJourneys';
import type { SupportedLocale } from '@/i18n/messages';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/auth';
import { useTripStore } from '@/stores/trip';
import type { CandidateSpot, Spot, TripDay, TripForm } from '@/types/models';
import { addMinutesToTime } from '@/utils/planner';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const authStore = useAuthStore();
const tripStore = useTripStore();
const isCopying = ref(false);
const errorMessage = ref('');

const activeLocale = computed(() => locale.value as SupportedLocale);
const journey = computed(() => getRecommendedJourney(String(route.params.season)));
const content = computed(() => journey.value?.locales[activeLocale.value] || journey.value?.locales['zh-TW']);

const ctaText = computed(() => {
  const labels: Record<SupportedLocale, string> = {
    en: 'Copy this recommendation into a new editable trip, then adjust the days, spots, and notes freely.',
    'zh-TW': '把這份推薦行程複製成新的可編輯旅程，再依照自己的日期、景點與備註慢慢調整。',
    ja: 'このおすすめを新しい編集可能な旅程としてコピーし、日程、スポット、メモを自由に調整できます。'
  };
  return labels[activeLocale.value];
});

const startText = computed(() => {
  const labels: Record<SupportedLocale, string> = {
    en: 'Copy to my trips',
    'zh-TW': '複製到新增旅程',
    ja: '新しい旅程にコピー'
  };
  return labels[activeLocale.value];
});

const copyingText = computed(() => {
  const labels: Record<SupportedLocale, string> = {
    en: 'Copying...',
    'zh-TW': '複製中...',
    ja: 'コピー中...'
  };
  return labels[activeLocale.value];
});

const bestTimeLabel = computed(() => {
  const labels: Record<SupportedLocale, string> = {
    en: 'Best time',
    'zh-TW': '最佳時間',
    ja: 'ベストシーズン'
  };
  return labels[activeLocale.value];
});

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const buildRecommendedTripDays = (): { days: TripDay[]; candidateSpots: CandidateSpot[] } => {
  if (!content.value) {
    return { days: [], candidateSpots: [] };
  }

  const candidateSpots: CandidateSpot[] = [];
  const days = content.value.days.map<TripDay>((day, dayIndex) => {
    const spots = day.stops.map<Spot>((stop, stopIndex) => {
      const startTime = addMinutesToTime('09:30', stopIndex * 150);
      const candidateId = uuid();
      const baseSpot: CandidateSpot = {
        id: candidateId,
        spotName: stop.name,
        category: 'sightseeing',
        address: content.value?.destination || '',
        durationMinutes: 120,
        openTime: '09:00',
        closeTime: '21:00',
        priority: 'must',
        notes: stop.note
      };

      candidateSpots.push(baseSpot);

      return {
        ...baseSpot,
        id: uuid(),
        sourceCandidateId: candidateId,
        time: startTime,
        timeStart: startTime,
        timeEnd: addMinutesToTime(startTime, baseSpot.durationMinutes),
        transportMinutes: stopIndex === 0 ? 0 : 30,
        transportNote: stopIndex === 0 ? `${stop.time}：當天第一站，可依住宿位置調整出發時間。` : `${stop.time}：建議預留約 30 分鐘移動與緩衝。`,
        aiReason: day.summary,
        description: stop.note
      };
    });

    return {
      id: String(dayIndex + 1),
      spots
    };
  });

  return { days, candidateSpots };
};

const copyRecommendedJourney = async () => {
  errorMessage.value = '';

  if (!content.value) return;

  const { data } = await supabase.auth.getSession();

  if (!authStore.token || !authStore.user || !data.session) {
    await router.push({ name: 'sign-in', query: { redirect: route.fullPath } });
    return;
  }

  isCopying.value = true;

  try {
    const dayCount = Math.max(1, content.value.days.length);
    const startDate = new Date();
    const payload: TripForm = {
      name: content.value.title,
      destination: content.value.destination,
      people: 1,
      dateStart: toDateInputValue(startDate),
      dateEnd: toDateInputValue(addDays(startDate, dayCount - 1)),
      dailyStartTime: '09:30',
      dailyEndTime: '20:30',
      travelStyle: 'relaxed'
    };
    const trip = await tripStore.createTrip(payload);
    const { days, candidateSpots } = buildRecommendedTripDays();
    await tripStore.updateTripById(trip.id, { days, candidateSpots });
    await router.push({ name: 'trip-detail', params: { id: trip.id } });
  } catch {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      await router.push({ name: 'sign-in', query: { redirect: route.fullPath } });
      return;
    }

    const labels: Record<SupportedLocale, string> = {
      en: 'Could not copy this recommendation. Please confirm you are signed in and try again.',
      'zh-TW': '無法複製這份推薦行程，請確認已登入後再試一次。',
      ja: 'このおすすめをコピーできませんでした。ログイン状態を確認して、もう一度お試しください。'
    };
    errorMessage.value = labels[activeLocale.value];
  } finally {
    isCopying.value = false;
  }
};
</script>
