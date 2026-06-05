<template>
  <section>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-morandi-sageDark">{{ t('trips.workspace') }}</p>
        <h1 class="mt-2 text-3xl font-bold text-morandi-ink">{{ t('trips.title') }}</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-morandi-sageDark">
          {{ t('trips.description') }}
        </p>
      </div>
      <button class="primary-button" type="button" @click="openAddModal">{{ t('trips.addTrip') }}</button>
    </div>

    <div v-if="tripStore.errorMessage" class="mt-6 rounded-xl bg-morandi-rose/15 px-4 py-3 text-sm text-morandi-ink">
      {{ tripStore.errorMessage }}
    </div>

    <div v-if="tripStore.isLoading" class="mt-8 rounded-2xl border border-morandi-linen bg-white p-8 text-center text-morandi-sageDark">
      {{ t('trips.loading') }}
    </div>

    <div v-else-if="tripStore.trips.length" class="mt-8 grid gap-4">
      <TripCard
        v-for="trip in tripStore.trips"
        :key="trip.id"
        :trip="trip"
        @open="openTrip"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="mt-8 rounded-2xl border border-dashed border-morandi-sage bg-white p-10 text-center">
      <h2 class="text-xl font-bold text-morandi-ink">{{ t('trips.emptyTitle') }}</h2>
      <p class="mt-2 text-sm text-morandi-sageDark">{{ t('trips.emptyDescription') }}</p>
      <button class="primary-button mt-5" type="button" @click="openAddModal">{{ t('trips.addTrip') }}</button>
    </div>

    <TripModal
      v-if="isModalOpen"
      :mode="modalMode"
      :trip="selectedTrip"
      @close="closeModal"
      @save="handleSave"
    />

    <ConfirmDialog
      v-if="pendingDeleteTripId"
      :eyebrow="t('common.confirm.eyebrow')"
      :title="t('trips.deleteModal.title')"
      :message="t('trips.deleteModal.message')"
      :cancel-label="t('common.confirm.cancel')"
      :confirm-label="t('common.confirm.delete')"
      @cancel="pendingDeleteTripId = null"
      @confirm="confirmDeleteTrip"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import TripCard from '@/components/TripCard.vue'
import TripModal from '@/components/TripModal.vue'
import { useTripStore } from '@/stores/trip'
import type { Trip, TripForm } from '@/types/models'

const router = useRouter()
const tripStore = useTripStore()
const { t } = useI18n()
const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedTrip = ref<Trip | null>(null)
const pendingDeleteTripId = ref<string | null>(null)

onMounted(() => {
  tripStore.fetchTrips()
})

const openTrip = (id: string) => {
  router.push({ name: 'trip-detail', params: { id } })
}

const openAddModal = () => {
  selectedTrip.value = null
  modalMode.value = 'add'
  isModalOpen.value = true
}

const openEditModal = (trip: Trip) => {
  selectedTrip.value = trip
  modalMode.value = 'edit'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedTrip.value = null
}

const handleSave = async (payload: TripForm) => {
  if (modalMode.value === 'add') {
    const trip = await tripStore.createTrip(payload)
    closeModal()
    openTrip(trip.id)
    return
  }

  if (selectedTrip.value) {
    await tripStore.updateTripById(selectedTrip.value.id, { ...selectedTrip.value, ...payload })
    await tripStore.fetchTrips()
  }

  closeModal()
}

const handleDelete = async (id: string) => {
  pendingDeleteTripId.value = id
}

const confirmDeleteTrip = async () => {
  if (!pendingDeleteTripId.value) return
  await tripStore.deleteTrip(pendingDeleteTripId.value)
  pendingDeleteTripId.value = null
}
</script>
