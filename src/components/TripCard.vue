<template>
  <div class="trip-card">
    <div class="card border-0">
      <div class="row no-gutters">
        <!-- picture -->
        <div class="card-container col-md-3">
          <img :key="trip.banner" :src="trip.banner" class="card-img" alt="Trip Image">
        </div>
        <!-- contents -->
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ trip.name }}</h5>
            <p class="card-text"><i class="fa-solid fa-calendar-days"></i> : {{ trip.dateStart }} ~ {{ trip.dateEnd }}
            </p>
            <p class="card-text"><i class="fa-solid fa-person"></i> : {{ trip.people }}</p>
          </div>
        </div>
        <div class="col-md-1">
          <div class="top-right-icon">
            <p class="setting-icon" @click="editTrip"><i class="fa-solid fa-gear"></i></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TripCard',
  props: {
    trip: Object
  },
  methods: {
    editTrip () {
      // this.$router.push({ name: 'TripModal', params: { id: this.trip.id } })
      this.$emit('edit', this.trip)
    }
  }
}
</script>

<style scoped>
.trip-card {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
}

.card-container {
 height: 200px;
 overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-right-icon {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}

.setting-icon {
  color: white;
  background-color: grey;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}

@media (min-width:  576px) {
  .card-img {
    max-width: 300px;
  }
}

@media (min-width: 992px) {
  .card-body {
    text-align: left;
  }
}

@media (max-width: 576px) {
  .setting-icon {
    margin-right: 5px;
    margin-top: 5px;
  }
}
</style>