<template>
  <section v-if="tripStore.currentTrip" class="space-y-6">
    <div class="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <RouterLink to="/trips" class="text-sm font-semibold text-morandi-sageDark">{{ t('tripDetail.backToTrips') }}</RouterLink>
        <h1 class="mt-3 text-3xl font-bold text-morandi-ink">{{ tripStore.currentTrip.name }}</h1>
        <p class="mt-2 text-sm text-morandi-sageDark">{{ tripStore.currentTrip.destination }} · {{ tripStore.currentTrip.dateStart }} - {{ tripStore.currentTrip.dateEnd }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="rounded-full bg-morandi-mist px-3 py-1 text-sm text-morandi-sageDark"> {{ t('tripDetail.people', { count: tripStore.currentTrip.people }) }} </span>
        <span class="rounded-full bg-morandi-blue/20 px-3 py-1 text-sm text-morandi-ink">
          {{ travelStyleLabel(tripStore.currentTrip.travelStyle) }}
        </span>
      </div>
    </div>

    <div v-if="tripStore.errorMessage" class="rounded-xl bg-morandi-rose/15 px-4 py-3 text-sm text-morandi-ink">
      {{ tripStore.errorMessage }}
    </div>

    <div class="grid gap-6 xl:grid-cols-[220px_1fr_360px]">
      <aside class="space-y-3">
        <section class="rounded-2xl border border-morandi-linen bg-white p-4">
          <h2 class="text-sm font-bold uppercase tracking-wide text-morandi-sageDark">{{ t('tripDetail.daysTitle') }}</h2>
          <div class="mt-4 grid gap-2">
            <button
              v-for="day in tripStore.currentTrip.days"
              :key="day.id"
              class="rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
              :class="day.id === tripStore.selectedDayId ? 'bg-morandi-sage text-white' : 'bg-morandi-mist text-morandi-ink hover:bg-morandi-linen'"
              type="button"
              @click="tripStore.selectedDayId = day.id"
            >
              {{ t('tripDetail.dayLabel', { day: day.id }) }}
              <span class="block text-xs font-normal opacity-80">{{ t('tripDetail.daySpotCount', { count: day.spots.length }) }}</span>
            </button>
          </div>
        </section>

        <CollaboratorPanel :collaborators="tripStore.currentTrip.collaborators" :invite-url="inviteUrl" :on-invite="handleInvite" :on-create-invite-link="handleCreateInviteLink" />
      </aside>

      <ItineraryTimeline v-if="tripStore.selectedDay" :day="tripStore.selectedDay" @edit="openSpotEditor" @delete="handleDeleteSpot" @reorder="handleReorderSpot" @add-spot="openSpotEditor(null)" />

      <aside class="space-y-4">
        <AiPlannerPanel :trip="tripStore.currentTrip" :is-planning="plannerStore.isPlanning" @plan="handleAiPlan" />

        <div ref="candidateFormSection">
          <CandidateSpotForm :editing-spot="editingCandidate" :on-save="handleSaveCandidate" @cancel="editingCandidate = null" />
        </div>

        <section class="rounded-2xl border border-morandi-linen bg-white p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.candidates.title') }}</h3>
            <span class="text-sm text-morandi-sageDark">{{ t('tripDetail.candidates.count', { count: tripStore.currentTrip.candidateSpots.length }) }}</span>
          </div>
          <div class="mt-4 space-y-3">
            <article v-for="spot in tripStore.currentTrip.candidateSpots" :key="spot.id" class="rounded-xl bg-morandi-mist p-3 text-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="font-bold text-morandi-ink">{{ spot.spotName }}</h4>
                  <p class="mt-1 text-morandi-sageDark">{{ spot.address || t('tripDetail.candidates.emptyAddress') }}</p>
                  <p class="mt-1 text-xs text-morandi-sageDark">{{ t('tripDetail.candidates.duration', { minutes: spot.durationMinutes }) }} · {{ priorityLabel(spot.priority) }}</p>
                </div>
                <div class="flex gap-1">
                  <button class="ghost-button px-2 py-1" type="button" @click="handleEditCandidate(spot)">{{ t('tripDetail.actions.edit') }}</button>
                  <button class="ghost-button px-2 py-1 text-morandi-rose" type="button" @click="handleDeleteCandidate(spot.id)">{{ t('tripDetail.actions.delete') }}</button>
                </div>
              </div>
            </article>
            <p v-if="!tripStore.currentTrip.candidateSpots.length" class="text-sm text-morandi-sageDark">{{ t('tripDetail.candidates.empty') }}</p>
          </div>
        </section>
      </aside>
    </div>

    <SpotEditorModal v-if="isSpotEditorOpen" :spot="editingSpot" @close="closeSpotEditor" @save="handleSaveSpot" />

    <ConfirmDialog
      v-if="pendingDelete"
      :eyebrow="t('common.confirm.eyebrow')"
      :title="deleteDialogTitle"
      :message="deleteDialogMessage"
      :cancel-label="t('common.confirm.cancel')"
      :confirm-label="t('common.confirm.delete')"
      @cancel="pendingDelete = null"
      @confirm="confirmDelete"
    />
  </section>

  <section v-else-if="tripStore.isLoading" class="rounded-2xl bg-white p-8 text-center shadow-soft">
    <p class="text-morandi-sageDark">{{ t('tripDetail.loading') }}</p>
  </section>

  <section v-else class="rounded-2xl bg-white p-8 text-center shadow-soft">
    <p class="font-semibold text-morandi-ink">{{ t('tripDetail.loadFailed') }}</p>
    <RouterLink to="/trips" class="secondary-button mt-5">{{ t('tripDetail.backToTrips') }}</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AiPlannerPanel from '@/components/AiPlannerPanel.vue';
import CandidateSpotForm from '@/components/CandidateSpotForm.vue';
import CollaboratorPanel from '@/components/CollaboratorPanel.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ItineraryTimeline from '@/components/ItineraryTimeline.vue';
import SpotEditorModal from '@/components/SpotEditorModal.vue';
import { usePlannerStore } from '@/stores/planner';
import { useTripStore } from '@/stores/trip';
import type { AiPlanRequest, CandidateSpot, Spot, SpotPriority } from '@/types/models';
import { normalizeSpotTime, recalculateSequentialSpots } from '@/utils/planner';

const route = useRoute();
const tripStore = useTripStore();
const plannerStore = usePlannerStore();
const { t } = useI18n();
const editingCandidate = ref<CandidateSpot | null>(null);
const editingSpot = ref<Spot | null>(null);
const isSpotEditorOpen = ref(false);
const inviteUrl = ref('');
const pendingDelete = ref<{ type: 'spot' | 'candidate'; id: string } | null>(null);
const candidateFormSection = ref<HTMLElement | null>(null);

const tripId = computed(() => String(route.params.id));
const deleteDialogTitle = computed(() => (pendingDelete.value?.type === 'candidate' ? t('tripDetail.deleteDialog.candidateTitle') : t('tripDetail.deleteDialog.spotTitle')));
const deleteDialogMessage = computed(() => (pendingDelete.value?.type === 'candidate' ? t('tripDetail.deleteDialog.candidateMessage') : t('tripDetail.deleteDialog.spotMessage')));

onMounted(() => {
  tripStore.fetchTrip(tripId.value);
});

const priorityLabel = (priority: SpotPriority) => {
  const labels: Record<SpotPriority, string> = {
    must: t('tripDetail.priorities.must'),
    high: t('tripDetail.priorities.high'),
    medium: t('tripDetail.priorities.medium'),
    low: t('tripDetail.priorities.low')
  };
  return labels[priority];
};

const travelStyleLabel = (style: string) => {
  if (['relaxed', 'balanced', 'packed'].includes(style)) {
    return t(`tripDetail.travelStyles.${style}`);
  }
  return style;
};

const handleSaveCandidate = async (payload: Omit<CandidateSpot, 'id'> | CandidateSpot) => {
  if ('id' in payload) {
    await tripStore.updateCandidate(payload);
  } else {
    await tripStore.addCandidate(payload);
  }
  editingCandidate.value = null;
};

const handleEditCandidate = async (spot: CandidateSpot) => {
  editingCandidate.value = { ...spot };
  await nextTick();
  candidateFormSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const handleAiPlan = async (payload: AiPlanRequest) => {
  plannerStore.setPlanning(true);
  try {
    const plan = await tripStore.runAiPlan(payload);
    plannerStore.setLatestPlan(plan);
  } finally {
    plannerStore.setPlanning(false);
  }
};

const openSpotEditor = (spot: Spot | null) => {
  editingSpot.value = spot;
  isSpotEditorOpen.value = true;
};

const closeSpotEditor = () => {
  editingSpot.value = null;
  isSpotEditorOpen.value = false;
};

const handleSaveSpot = async (spot: Spot) => {
  if (!tripStore.currentTrip) return;
  const dayId = tripStore.selectedDayId;
  const existingDay = tripStore.currentTrip.days.find((day) => day.id === dayId);
  const days = tripStore.currentTrip.days.map((day) => {
    if (day.id !== dayId) return day;
    const exists = day.spots.some((item) => item.id === spot.id);
    return {
      ...day,
      spots: recalculateSequentialSpots(
        exists ? day.spots.map((item) => (item.id === spot.id ? normalizeSpotTime(spot) : item)) : [...day.spots, normalizeSpotTime(spot)],
        tripStore.currentTrip?.dailyStartTime
      )
    };
  });

  if (!existingDay) {
    days.push({ id: dayId, spots: recalculateSequentialSpots([normalizeSpotTime(spot)], tripStore.currentTrip?.dailyStartTime) });
  }

  await tripStore.updateTrip({ days });
  closeSpotEditor();
};

const handleDeleteSpot = async (spotId: string) => {
  pendingDelete.value = { type: 'spot', id: spotId };
};

const handleReorderSpot = async (sourceSpotId: string, targetSpotId: string) => {
  await tripStore.reorderSpot(tripStore.selectedDayId, sourceSpotId, targetSpotId);
};

const handleDeleteCandidate = async (spotId: string) => {
  pendingDelete.value = { type: 'candidate', id: spotId };
};

const confirmDelete = async () => {
  if (!pendingDelete.value) return;

  if (pendingDelete.value.type === 'spot') {
    await tripStore.deleteSpot(tripStore.selectedDayId, pendingDelete.value.id);
  } else {
    await tripStore.deleteCandidate(pendingDelete.value.id);
  }

  pendingDelete.value = null;
};

const handleInvite = async (email: string) => {
  await tripStore.addCollaborator(email);
};

const handleCreateInviteLink = async () => {
  const invite = await tripStore.createInviteLink();
  const token = invite?.inviteToken || tripStore.currentTrip?.inviteToken;
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  const fallbackUrl = `${window.location.origin}${window.location.pathname}`;
  const baseUrl = (configuredUrl || fallbackUrl).replace(/\/$/, '');

  if (!token) {
    throw new Error('Invite token missing');
  }

  inviteUrl.value = `${baseUrl}/#/join/${token}`;
  // inviteUrl.value = `${window.location.origin}${window.location.pathname}#/join/${token}`
  return inviteUrl.value;
};
</script>
