<template>
  <div class="container py-5">
    <!-- Display trip cards -->
    <div v-if="trips.length">
      <div v-for="trip in trips" :key="trip.id">
        <trip-card :trip="trip" @edit="editTrip"></trip-card>
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
import TripCard from '../components/TripCard.vue'
import TripModal from '../components/TripModal.vue'

export default {
  components: {
    TripCard,
    TripModal
  },
  data () {
    return {
      trips: [
        { id: 1, name: 'Trip 1', dateStart: '2024-05-01', dateEnd: '2024-05-05', people: 2, banner: 'https://images.pexels.com/photos/10255590/pexels-photo-10255590.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load'},
        { id: 2, name: 'Trip 2', dateStart: '2024-06-15', dateEnd: '2024-06-25', people: 3, banner: 'https://images.pexels.com/photos/10255590/pexels-photo-10255590.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' },
      ], 
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
    fetchTrips () {
      // @TODO: Fetch trip data from backend API
      // @TODO: Assign fetched data to this.trips
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
        console.log('saved data:', tripData)
        this.selectedTrip.name = tripData.name
        this.selectedTrip.dateStart = tripData.dateStart
        this.selectedTrip.dateEnd = tripData.dateEnd
        this.selectedTrip.people = tripData.people
        this.selectedTrip.picture = tripData.picture
      }
      this.closeModal()
    },
    editTrip (trip) {
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
