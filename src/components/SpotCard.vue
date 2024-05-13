<template>
  <div class="spot-card mx-auto">
    <div class="card border-0">
      <div class="row no-gutters">
        <!-- spot picture -->
        <div class="card-container col-md-3 col-1">
          <img :key="spot.banner" :src="spot.banner" class="card-img" alt="Spot Image">
        </div>
        <!-- contents -->
        <div class="col-md-8 col-7">
          <div class="card-body text-start">
            <p class="card-text"><i class="fa-solid fa-clock"></i>  {{ spot.time }}</p>
            <h4 class="card-title"><i class="fa-solid fa-location-dot"></i>  {{ spot.spotName }}</h4>
            <p class="card-text"><i class="fa-solid fa-circle-info"></i>  {{ spot.description }}</p>
          </div>
        </div>
        <!-- <div class="col-md-1">
          <button @click="openEditModal" class="btn btn-sm btn-outline-primary"><i
              class="fa-solid fa-gear"></i>Edit</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    spot: Object
  },
  methods: {
    openEditModal () {
      this.$emit('edit')
    }
  }
}
</script>

<style scoped>
.spot-card {
  width: 80%;
  border: 1px solid grey;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.card-container {
  height: 100px;
  width: 150px;
  overflow: hidden;
}

.card-body {
  padding: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-icon {
  cursor: pointer;
}

.fa-heart.fa-solid {
  color: red;
}

.fa {
  font-size: 24px;
}

@media (max-width: 576px) {
  .spot-card {
      width: 90%;
    }

  .card-container {
      height: 100px;
      width: 100px;
    }
}
</style>
