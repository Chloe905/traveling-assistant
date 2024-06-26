<template>
  <div class="container py-5">
    <!-- Display trip cards -->
    <div v-if="trips.length">
      <div v-for="trip in trips" :key="trip.id">
        <trip-card :trip="trip" @edit="editInfo" @dblclick="handleDbClick(trip.id)"
          @touchend="handleTouchStart(trip.id)"></trip-card>
      </div>
    </div>
    <div v-else>
      No trips found.
    </div>

    <!-- Button to create new trip plan -->
    <button @click="setModalMode('add')" class="btn btn-dark mt-3 add-new-btn">+ Add New Trip</button>

    <!-- Modal for creating new trip plan -->
    <trip-modal @close="closeModal" @save="saveTrip" @delete="deleteTrip" :visible="showModal" :mode="modalMode"
      :tripData="selectedTrip"></trip-modal>
  </div>
</template>

<script>
import TripCard from '../components/TripCard.vue'
import TripModal from '../components/TripModal.vue'
import debounce from 'lodash.debounce'
import { apiHelper } from '../../src/utils/helper'

export default {
  components: {
    TripCard,
    TripModal
  },
  data () {
    return {
      trips: [], 
      showModal: false,
      modalMode: '', // Add or Edit mode
      selectedTrip: null // Selected trip data for editing
    }
  },
  created () {
    this.fetchTrips()
  },
  watch: {
    tripData: {
      handler(newTripData) {
        this.tripData = newTripData
      },
      immediate: true
    },
  },
  methods: {
    async fetchTrips () {
      try {
        const response = await apiHelper.get('/trips')
        this.trips = response.data || []
      } catch (error) {
        console.error('Error fetching trips:', error)
      }
    },
    setModalMode (mode) {
      this.modalMode = mode
      this.showModal = true
    },
    closeModal () {
      this.showModal = false
      this.modalMode = ''
      this.selectedTrip = null
    },
    saveTrip (tripData) {
      if (this.modalMode === 'add') {
        this.trips.push(tripData)
      } else if (this.modalMode === 'edit' && this.selectedTrip) {
        const index = this.trips.findIndex(trip => trip.id === this.selectedTrip.id)
        if (index !== -1) {
          this.trips[index] = { ...this.selectedTrip, ...tripData }
        }
      }
      this.closeModal()
    },
    editInfo (trip) {
        this.selectedTrip = trip
        this.modalMode = 'edit'
        this.showModal = true
    },
    deleteTrip (tripId) {
      const index = this.trips?.findIndex(trip => trip.id === tripId)
      if (index !== -1) {
        this.trips.splice(index, 1)
      }
      this.closeModal()
    },
    editTrip (tripId) {
      this.$router.push({ name: 'TripDetail', params: { id: tripId } })
    },
    handleDbClick (tripId) {
      this.editTrip(tripId)
    },
    handleTouchStart (tripId) {
      debounce(() => {
        this.editTrip(tripId)
      }, 300)()
    }
  }
}
</script>

<style>
.add-new-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
