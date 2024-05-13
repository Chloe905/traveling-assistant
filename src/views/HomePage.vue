<template>
  <div class="container py-5">
    <!-- Display trip cards -->
    <div v-if="trips.length">
      <div v-for="trip in trips" :key="trip.id">
        <trip-card :trip="trip" @edit="editInfo" @dblclick="editTrip(trip.id)"></trip-card>
      </div>
    </div>
    <div v-else>
      No trips found.
    </div>

    <!-- Button to create new trip plan -->
    <button @click="setModalMode('add')" class="btn btn-primary mt-3 add-new-btn">+ Add New Trip</button>

    <!-- Modal for creating new trip plan -->
    <trip-modal @close="closeModal" @save="saveTrip" @delete="deleteTrip" :visible="showModal" :mode="modalMode"
      :tripData="selectedTrip"></trip-modal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import TripCard from '../components/TripCard.vue'
import TripModal from '../components/TripModal.vue'

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
  mounted () {
    // Fetch trip data when the component is mounted
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
        const baseUrl = 'http://localhost:4000'
        const response = await axios.get(`${baseUrl}/trips`)
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
      // Handle saving the trip data
      if (this.modalMode === 'add') {
        // Add new trip
        const newTrip = {
          id: uuidv4(),
          ...tripData
        }

        this.trips.push(newTrip)
      } else if (this.modalMode === 'edit' && this.selectedTrip) {
        this.selectedTrip.name = tripData.name
        this.selectedTrip.dateStart = tripData.dateStart
        this.selectedTrip.dateEnd = tripData.dateEnd
        this.selectedTrip.people = tripData.people
        this.selectedTrip.picture = tripData.picture
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