<template>
  <section class="landing-page">
    <div class="landing-page__hero">
      <div class="landing-page__globe-stage">
        <div class="landing-page__globe">
          <div class="landing-page__globe-grid"></div>
          <div class="landing-page__globe-shade"></div>
          <span class="landing-page__route landing-page__route--first"></span>
          <span class="landing-page__route landing-page__route--second"></span>
          <span class="landing-page__route landing-page__route--third"></span>
          <span class="landing-page__destination landing-page__destination--tokyo">{{ t('landing.globe.tokyo') }}</span>
          <span class="landing-page__destination landing-page__destination--kyoto">{{ t('landing.globe.kyoto') }}</span>
          <span class="landing-page__destination landing-page__destination--paris">{{ t('landing.globe.paris') }}</span>
          <span class="landing-page__destination landing-page__destination--australia">{{ t('landing.globe.australia') }}</span>
          <span class="landing-page__destination landing-page__destination--switzerland">{{ t('landing.globe.switzerland') }}</span>
          <span class="landing-page__destination landing-page__destination--new-zealand">{{ t('landing.globe.newZealand') }}</span>
        </div>
        <div class="landing-page__journey-strip">
          <RouterLink v-for="journey in journeys" :key="journey.slug" :to="{ name: 'recommended-journey', params: { season: journey.slug } }" class="landing-page__journey-card">
            <span>{{ journey.meta }}</span>
            <strong>{{ journey.title }}</strong>
          </RouterLink>
        </div>
      </div>

      <div class="landing-page__hero-content">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-morandi-sageDark">{{ t('landing.eyebrow') }}</p>
        <h1 class="mt-5 max-w-5xl text-2xl font-semibold leading-tight text-morandi-ink sm:text-5xl sm:leading-[0.98] lg:text-6xl">
          {{ t('landing.title') }}
        </h1>
        <div class="mt-8 grid max-w-4xl gap-5 text-morandi-sageDark md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <p class="text-base leading-7 sm:text-lg">
            {{ t('landing.description') }}
          </p>
          <div class="flex flex-wrap gap-3 md:justify-end">
            <RouterLink :to="authStore.isAuthenticated ? '/trips' : '/signup'" class="landing-page__primary-link">{{ t('landing.startPlanning') }}</RouterLink>
            <RouterLink v-if="!authStore.isAuthenticated" to="/signin" class="landing-page__secondary-link">{{ t('landing.signIn') }}</RouterLink>
          </div>
        </div>
      </div>

      <div class="landing-page__scroll-cue" aria-hidden="true">
        <span></span>
        <p>{{ t('landing.scrollCue') }}</p>
      </div>
    </div>

    <section ref="mapCoverSection" class="landing-page__map-cover-section">
      <div class="landing-page__map-cover-sticky">
        <div class="landing-page__map-cover" :style="mapCoverStyle">
          <img class="landing-page__map-cover-image" src="/images/world-map-cover.svg" alt="World map grid" />
          <div class="landing-page__map-cover-mask" :style="mapCoverStyle" aria-hidden="true"></div>
          <div class="landing-page__map-cover-grid" aria-hidden="true"></div>
          <div class="landing-page__map-route-group" :style="mapRouteStyle" aria-hidden="true">
            <svg class="landing-page__flight-route" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                class="landing-page__flight-route-line"
                d="M 27 43.5 C 36 36 47 37 55 42.8 S 69 56 76.5 52"
                pathLength="100"
              />
              <text class="landing-page__flight-plane" text-anchor="middle" dominant-baseline="central">
                <animateMotion
                  dur="5.6s"
                  repeatCount="indefinite"
                  rotate="auto"
                  path="M 27 43.5 C 36 36 47 37 55 42.8 S 69 56 76.5 52"
                />
                ✈
              </text>
            </svg>
            <span class="landing-page__map-pin landing-page__map-pin--north"></span>
            <span class="landing-page__map-pin landing-page__map-pin--east"></span>
            <span class="landing-page__map-pin landing-page__map-pin--south"></span>
          </div>
          <span class="landing-page__map-attribution"></span>
        </div>
        <div class="landing-page__map-cover-copy" :style="mapCoverCopyStyle">
          <p class="landing-page__eyebrow text-morandi-sageDark">{{ t('landing.mapCover.eyebrow') }}</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-morandi-ink sm:text-5xl">
            {{ t('landing.mapCover.title') }}
          </h2>
          <p class="mt-5 max-w-2xl text-base leading-7 text-morandi-sageDark">
            {{ t('landing.mapCover.body') }}
          </p>
        </div>
      </div>
    </section>

    <div class="landing-page__intro">
      <p class="landing-page__eyebrow">{{ t('landing.introEyebrow') }}</p>
      <div class="landing-page__intro-grid">
        <h2 class="text-3xl font-semibold leading-tight text-morandi-ink sm:text-4xl">
          {{ t('landing.introTitle') }}
        </h2>
        <!-- <p class="text-base leading-8 text-morandi-sageDark">
          {{ t('landing.introBody') }}
        </p> -->
      </div>
    </div>

    <div class="landing-page__feature-band">
      <article v-for="feature in features" :key="feature.title" class="landing-page__feature-item">
        <span class="landing-page__feature-index">{{ feature.index }}</span>
        <h3 class="mt-6 text-2xl font-semibold text-morandi-ink">{{ feature.title }}</h3>
        <p class="mt-4 text-sm leading-7 text-morandi-sageDark">{{ feature.description }}</p>
      </article>
    </div>

    <div class="landing-page__showcase">
      <div>
        <p class="landing-page__eyebrow">{{ t('landing.showcaseEyebrow') }}</p>
        <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-morandi-ink sm:text-5xl">
          {{ t('landing.showcaseTitle') }}
        </h2>
      </div>
      <div class="landing-page__showcase-panel">
        <div class="flex items-center justify-between border-b border-white/15 pb-4">
          <span class="text-sm uppercase tracking-[0.22em] text-morandi-sageDark">{{ t('landing.draftLabel') }}</span>
          <!-- <span class="rounded-full bg-morandi-linen px-3 py-1 text-xs font-semibold text-morandi-ink">{{ t('landing.maplessLabel') }}</span> -->
        </div>
        <div class="mt-6 space-y-5">
          <div v-for="stop in sampleStops" :key="stop.name" class="landing-page__timeline-row">
            <span class="text-sm font-semibold text-morandi-sageDark">{{ stop.time }}</span>
            <div>
              <p class="text-lg font-semibold text-morandi-ink">{{ stop.name }}</p>
              <p class="mt-1 text-sm text-morandi-sageDark">{{ stop.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="landing-page__copyright">copyright © 2026 Chloe</div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { recommendedJourneys } from '@/data/recommendedJourneys';
import type { SupportedLocale } from '@/i18n/messages';
import { useAuthStore } from '@/stores/auth';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const mapCoverSection = ref<HTMLElement | null>(null);
const mapCoverProgress = ref(0);
const activeLocale = computed(() => locale.value as SupportedLocale);

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

const updateMapCoverProgress = () => {
  if (!mapCoverSection.value) return;

  const rect = mapCoverSection.value.getBoundingClientRect();
  const availableScroll = rect.height - window.innerHeight;
  mapCoverProgress.value = availableScroll > 0 ? clampProgress(-rect.top / availableScroll) : 0;
};

const mapCoverStyle = computed<Record<string, string>>(() => {
  const progress = mapCoverProgress.value;
  const scale = 0.48 + progress * 0.72;
  const opacity = 0.88 - progress * 0.1;

  return {
    '--map-mask-scale': scale.toFixed(3),
    '--map-mask-opacity': Math.max(0.78, opacity).toFixed(2)
  };
});

const mapCoverCopyStyle = computed<Record<string, string>>(() => ({
  opacity: Math.max(0, 1 - mapCoverProgress.value * 1.65).toFixed(2),
  transform: `translateY(${Math.round(mapCoverProgress.value * -26)}px)`
}));

const mapRouteStyle = computed<Record<string, string>>(() => {
  const routeProgress = clampProgress((mapCoverProgress.value - 0.66) / 0.18);

  return {
    opacity: routeProgress.toFixed(2),
    transform: `translateY(${Math.round((1 - routeProgress) * 18)}px)`,
    pointerEvents: routeProgress > 0.05 ? 'auto' : 'none'
  };
});

onMounted(() => {
  updateMapCoverProgress();
  window.addEventListener('scroll', updateMapCoverProgress, { passive: true });
  window.addEventListener('resize', updateMapCoverProgress);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateMapCoverProgress);
  window.removeEventListener('resize', updateMapCoverProgress);
});

const features = computed(() => [
  {
    index: '01',
    title: t('landing.features.candidateTitle'),
    description: t('landing.features.candidateDescription')
  },
  {
    index: '02',
    title: t('landing.features.aiTitle'),
    description: t('landing.features.aiDescription')
  },
  {
    index: '03',
    title: t('landing.features.collaborationTitle'),
    description: t('landing.features.collaborationDescription')
  }
]);

const sampleStops = computed(() => [
  {
    time: '09:30',
    name: t('landing.sampleStops.meijiName'),
    note: t('landing.sampleStops.meijiNote')
  },
  {
    time: '11:10',
    name: t('landing.sampleStops.harajukuName'),
    note: t('landing.sampleStops.harajukuNote')
  },
  {
    time: '16:40',
    name: t('landing.sampleStops.shibuyaName'),
    note: t('landing.sampleStops.shibuyaNote')
  }
]);

const journeys = computed(() =>
  recommendedJourneys.map((journey) => {
    const content = journey.locales[activeLocale.value] || journey.locales['zh-TW'];
    return {
      slug: journey.slug,
      meta: content.seasonLabel,
      title: content.title
    };
  })
);
</script>
