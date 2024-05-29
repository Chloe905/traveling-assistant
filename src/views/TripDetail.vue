<template>
  <div class="trip-detail" v-if="trip">
    <div class="d-flex justify-content-center align-items-center mb-3">
      <router-link to="/trips" class="btn btn-secondary back-btn"><i class="fa-solid fa-arrow-left"></i></router-link>
      <h2 class=" mb-0">{{ trip.name }}</h2>
      <!-- Other trip details here -->
    </div>

    <div class="tabs-container">
      <ul class="nav nav-tabs">
        <li v-for="day in totalDays" :key="day" class="nav-item">
          <a class="nav-link" :class="{ active: currentDay === day }" @click="selectDay(day)">
            第{{ day }}天
          </a>
        </li>
      </ul>
    </div>

    <div v-if="currentDay" class="spots-container">
      <div v-if="getSpotsForDay(currentDay).length">
        <spot-card v-for="spot in getSpotsForDay(currentDay)" :key="spot.id" :spot="spot"
          @edit="openEditSpotModal(spot)">
        </spot-card>
      </div>
      <div v-else>
        <p class="mt-5">今天尚未安排行程</p>
      </div>

      <div class="add-spot-button-group">
        <button @click="openAddSpotModal" class="btn btn-secondary add-spot-button"> {{ showAddOptions ? 'x' : '+' }}
        </button>
        <div v-if="showAddOptions" class="mb-3 mx-2">
          <button @click="addFromFavorites" class="btn btn-secondary">Add From Favorites</button>
          <button @click="addFromMap" class="btn btn-secondary">Add From Map</button>
          <button @click="manualAddSpot" class="btn btn-secondary">Simply Add Spot</button>
        </div>
      </div>
    </div>


    <edit-spot-modal v-if="showEditSpotModal" :spot="selectedSpot" @save="saveSpot" @close="closeEditSpotModal">
    </edit-spot-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import SpotCard from '../components/SpotCard.vue'
import EditSpotModal from '../components/EditSpotModal.vue'

export default {
  components: {
    SpotCard,
    EditSpotModal
  },
  data () {
    return {
      trip: null,
      currentDay: null,
      newSpotName: '',
      newSpotTime: '',
      showEditSpotModal: false,
      selectedSpot: null,
      showAddOptions: false
    }
  },
  async mounted () {
    try {
      const tripId = this.$route.params.id
      const baseUrl = 'http://localhost:4000'
      const response = await axios.get(`${baseUrl}/trips/${tripId}`)
      this.trip = response.data || {}
      this.trip.days = this.trip.days || []
      this.selectDay(1) // Select day 1 by default
    } catch (error) {
      console.error('Error fetching trip details:', error)
    }
  },
  methods: {
    async fetchSpotsForDay (tripId, dayId) {
      try {
        const baseUrl = 'http://localhost:4000'
        const response = await axios.get(`${baseUrl}/trips/${tripId}?days=${dayId}`)
        const spots = response.data || []
        const dayIndex = this.trip.days.findIndex(d => d.id === dayId)
        if (dayIndex !== -1) {
          this.trip.days[dayIndex] = { ...this.trip.days[dayIndex], spots }
        }
      } catch (error) {
        console.error('Error fetching spots:', error)
      }
    },
    selectDay (day) {
      this.currentDay = day
      const tripId = this.$route.params.id
      this.fetchSpotsForDay(tripId, day)
    },
    openAddSpotModal () {
      // Toggle showAddOptions to display the options
      this.showAddOptions = !this.showAddOptions
    },
    addFromFavorites () {
      // @TODO: Implement method to add spot from favorites
      // this.selectedSpot = favoriteSpot
      this.showAddOptions = false
    },
    addFromMap () {
      // @TODO: Call Google Maps API and handle location selection
      // Once location is selected, populate this.selectedSpot with data
      this.showAddOptions = false
    },
    manualAddSpot () {
      this.showAddOptions = false
      this.showEditSpotModal = true
      this.selectedSpot = null
    },
    openEditSpotModal (spot) {
      this.showEditSpotModal = true
      this.selectedSpot = spot
    },
    closeEditSpotModal () {
      this.showEditSpotModal = false
      this.selectedSpot = null
    },
    getSpotsForDay (day) {
      if (!this.trip?.days?.length) {
        return []
      }

      const selectedDay = this?.trip?.days.find(d => d.id === day) || {}
      
      if (selectedDay) {
        return selectedDay.spots || []
      }
    },
    async saveSpot (updatedSpot) {
      if (!this.currentDay) {
        return
      }

      try {
        if (this.selectedSpot) {
          // Edit existing spot
          const currentDaySpots = this.getSpotsForDay(this.currentDay) || []

          const index = currentDaySpots.findIndex(spot => spot.id === updatedSpot.id)
          if (index === -1) {
            return
          }

          return currentDaySpots.splice(index, 1, updatedSpot)
        } else {
          // Add new spot
          const newSpot = {
            id: uuidv4(),
            ...updatedSpot
          }
          this.getSpotsForDay(this.currentDay).push(newSpot)

          // @TODO: Save new spot to backend
          await this.saveSpotToBackend(newSpot)
        }

        this.closeEditSpotModal()
      } catch (error) {
        console.error('Error saving spot:', error)
      }
    },
    async saveSpotToBackend (newSpot) {
      try {
        const tripId = this.$route.params.id
        const baseUrl = 'http://localhost:4000'

        if (!tripId || !this.currentDay) {
          return
        }

        // @TODO: use the correct route , now cannot put to the correct route
        const response = await axios.post(`${baseUrl}/trips/${tripId}/days/${this.currentDay}/spots`, newSpot)
        console.log('Spot saved successfully:', response.data)
  
      } catch (error) {
        console.error('Error saving spot to backend:', error)
        throw error
      }
    }
  },
  computed: {
    totalDays () {
      if (this.trip?.dateStart && this.trip?.dateEnd) {
        const startDate = new Date(this.trip.dateStart).getTime()
        const endDate = new Date(this.trip.dateEnd).getTime()
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

        return daysDiff
      }
      return 0
    }
  }
}
</script>

<style>
.trip-detail {
  margin-top: 20px;
}

.add-spot-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
}

.add-spot-button-group > div {
  position: absolute;
  bottom: 50px;
  right: 0;
  display: flex;
  flex-direction: column;
}

.add-spot-button-group>div>button {
  margin-bottom: 10px;
}

.tabs-container {
  overflow-x: auto;
  white-space: nowrap;
  width: 90%;
  padding: 0 10px;
  margin: auto;
}

.nav-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
}

.nav-item {
  list-style: none;
  margin-right: 10px;
}

.nav-link {
  padding: 10px;
  text-decoration: none;
  color: #333;
}

.nav-link.active {
  font-weight: bold;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  border-radius: 50%;
}

.spots-container {
  max-width: 90%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .tabs-container {
    display: block;
    overflow-x: auto;
  }
}
</style>
