<template>
  <section v-if="tripStore.currentTrip" class="space-y-6">
    <div class="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <RouterLink to="/trips" class="text-sm font-semibold text-morandi-sageDark">← 回旅程列表</RouterLink>
        <h1 class="mt-3 text-3xl font-bold text-morandi-ink">{{ tripStore.currentTrip.name }}</h1>
        <p class="mt-2 text-sm text-morandi-sageDark">
          {{ tripStore.currentTrip.destination }} · {{ tripStore.currentTrip.dateStart }} - {{ tripStore.currentTrip.dateEnd }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="rounded-full bg-morandi-mist px-3 py-1 text-sm text-morandi-sageDark">
          {{ tripStore.currentTrip.people }} 人
        </span>
        <span class="rounded-full bg-morandi-blue/20 px-3 py-1 text-sm text-morandi-ink">
          {{ tripStore.currentTrip.travelStyle }}
        </span>
      </div>
    </div>

    <div v-if="tripStore.errorMessage" class="rounded-xl bg-morandi-rose/15 px-4 py-3 text-sm text-morandi-ink">
      {{ tripStore.errorMessage }}
    </div>

    <div class="grid gap-6 xl:grid-cols-[220px_1fr_360px]">
      <aside class="space-y-3">
        <section class="rounded-2xl border border-morandi-linen bg-white p-4">
          <h2 class="text-sm font-bold uppercase tracking-wide text-morandi-sageDark">Days</h2>
          <div class="mt-4 grid gap-2">
            <button
              v-for="day in tripStore.currentTrip.days"
              :key="day.id"
              class="rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
              :class="day.id === tripStore.selectedDayId ? 'bg-morandi-sage text-white' : 'bg-morandi-mist text-morandi-ink hover:bg-morandi-linen'"
              type="button"
              @click="tripStore.selectedDayId = day.id"
            >
              第 {{ day.id }} 天
              <span class="block text-xs font-normal opacity-80">{{ day.spots.length }} 個行程</span>
            </button>
          </div>
        </section>

        <CollaboratorPanel
          :collaborators="tripStore.currentTrip.collaborators"
          :invite-url="inviteUrl"
          :on-invite="handleInvite"
          :on-create-invite-link="handleCreateInviteLink"
        />
      </aside>

      <ItineraryTimeline
        v-if="tripStore.selectedDay"
        :day="tripStore.selectedDay"
        @edit="openSpotEditor"
        @delete="handleDeleteSpot"
        @move="handleMoveSpot"
        @add-spot="openSpotEditor(null)"
      />

      <aside class="space-y-4">
        <AiPlannerPanel
          :trip="tripStore.currentTrip"
          :is-planning="plannerStore.isPlanning"
          @plan="handleAiPlan"
        />

        <CandidateSpotForm
          :editing-spot="editingCandidate"
          :on-save="handleSaveCandidate"
          @cancel="editingCandidate = null"
        />

        <section class="rounded-2xl border border-morandi-linen bg-white p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-morandi-ink">候選池</h3>
            <span class="text-sm text-morandi-sageDark">{{ tripStore.currentTrip.candidateSpots.length }} 個</span>
          </div>
          <div class="mt-4 space-y-3">
            <article
              v-for="spot in tripStore.currentTrip.candidateSpots"
              :key="spot.id"
              class="rounded-xl bg-morandi-mist p-3 text-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="font-bold text-morandi-ink">{{ spot.spotName }}</h4>
                  <p class="mt-1 text-morandi-sageDark">{{ spot.address || '未填區域' }}</p>
                  <p class="mt-1 text-xs text-morandi-sageDark">{{ spot.durationMinutes }} 分鐘 · {{ priorityLabel(spot.priority) }}</p>
                </div>
                <div class="flex gap-1">
                  <button class="ghost-button px-2 py-1" type="button" @click="editingCandidate = { ...spot }">編輯</button>
                  <button class="ghost-button px-2 py-1 text-morandi-rose" type="button" @click="tripStore.deleteCandidate(spot.id)">刪除</button>
                </div>
              </div>
            </article>
            <p v-if="!tripStore.currentTrip.candidateSpots.length" class="text-sm text-morandi-sageDark">
              先加入幾個想去的景點，再啟用 AI 排程。
            </p>
          </div>
        </section>
      </aside>
    </div>

    <SpotEditorModal
      v-if="isSpotEditorOpen"
      :spot="editingSpot"
      @close="closeSpotEditor"
      @save="handleSaveSpot"
    />
  </section>

  <section v-else class="rounded-2xl bg-white p-8 text-center shadow-soft">
    <p class="text-morandi-sageDark">讀取旅程中...</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AiPlannerPanel from '@/components/AiPlannerPanel.vue'
import CandidateSpotForm from '@/components/CandidateSpotForm.vue'
import CollaboratorPanel from '@/components/CollaboratorPanel.vue'
import ItineraryTimeline from '@/components/ItineraryTimeline.vue'
import SpotEditorModal from '@/components/SpotEditorModal.vue'
import { usePlannerStore } from '@/stores/planner'
import { useTripStore } from '@/stores/trip'
import type { AiPlanRequest, CandidateSpot, Spot, SpotPriority } from '@/types/models'
import { normalizeSpotTime, recalculateSequentialSpots } from '@/utils/planner'

const route = useRoute()
const tripStore = useTripStore()
const plannerStore = usePlannerStore()
const editingCandidate = ref<CandidateSpot | null>(null)
const editingSpot = ref<Spot | null>(null)
const isSpotEditorOpen = ref(false)
const inviteUrl = ref('')

const tripId = computed(() => String(route.params.id))

onMounted(() => {
  tripStore.fetchTrip(tripId.value)
})

const priorityLabel = (priority: SpotPriority) => {
  const labels: Record<SpotPriority, string> = {
    must: '必去',
    high: '很想去',
    medium: '可安排',
    low: '有空再去'
  }
  return labels[priority]
}

const handleSaveCandidate = async (payload: Omit<CandidateSpot, 'id'> | CandidateSpot) => {
  if ('id' in payload) {
    await tripStore.updateCandidate(payload)
  } else {
    await tripStore.addCandidate(payload)
  }
  editingCandidate.value = null
}

const handleAiPlan = async (payload: AiPlanRequest) => {
  plannerStore.setPlanning(true)
  try {
    const plan = await tripStore.runAiPlan(payload)
    plannerStore.setLatestPlan(plan)
  } finally {
    plannerStore.setPlanning(false)
  }
}

const openSpotEditor = (spot: Spot | null) => {
  editingSpot.value = spot
  isSpotEditorOpen.value = true
}

const closeSpotEditor = () => {
  editingSpot.value = null
  isSpotEditorOpen.value = false
}

const handleSaveSpot = async (spot: Spot) => {
  if (!tripStore.currentTrip) return
  const dayId = tripStore.selectedDayId
  const existingDay = tripStore.currentTrip.days.find(day => day.id === dayId)
  const days = tripStore.currentTrip.days.map(day => {
    if (day.id !== dayId) return day
    const exists = day.spots.some(item => item.id === spot.id)
    return {
      ...day,
      spots: recalculateSequentialSpots(
        exists
          ? day.spots.map(item => (item.id === spot.id ? normalizeSpotTime(spot) : item))
          : [...day.spots, normalizeSpotTime(spot)],
        tripStore.currentTrip?.dailyStartTime
      )
    }
  })

  if (!existingDay) {
    days.push({ id: dayId, spots: recalculateSequentialSpots([normalizeSpotTime(spot)], tripStore.currentTrip?.dailyStartTime) })
  }

  await tripStore.updateTrip({ days })
  closeSpotEditor()
}

const handleDeleteSpot = async (spotId: string) => {
  await tripStore.deleteSpot(tripStore.selectedDayId, spotId)
}

const handleMoveSpot = async (spotId: string, direction: -1 | 1) => {
  await tripStore.moveSpot(tripStore.selectedDayId, spotId, direction)
}

const handleInvite = async (email: string) => {
  await tripStore.addCollaborator(email)
}

const handleCreateInviteLink = async () => {
  const invite = await tripStore.createInviteLink()
  const token = invite?.inviteToken || tripStore.currentTrip?.inviteToken

  if (!token) {
    throw new Error('Invite token missing')
  }

  inviteUrl.value = `${window.location.origin}${window.location.pathname}#/join/${token}`
  return inviteUrl.value
}
</script>
