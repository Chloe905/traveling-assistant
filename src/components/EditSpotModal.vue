<template>
  <div class="edit-spot-modal">
    <div class="spot-modal-content">
      <h3>{{ selectedSpot ? 'Edit Spot' : 'Add New Spot' }}</h3>
      <form @submit.prevent="saveSpot">
        <div class="form-group">
          <label for="spotName">Name</label>
          <input type="text" v-model="editedSpot.spotName" class="form-control" id="spotName" required>
        </div>
        <div class="form-group">
          <label for="spotTime">Time</label>
          <input type="time" v-model="editedSpot.time" class="form-control" id="spotTime" name="spotTime" required>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <input type="text" v-model="editedSpot.description" class="form-control" id="description">
        </div>
        <div class="button-group">
          <button type="button" @click="closeModal" class="btn btn-secondary"><i class="fa-solid fa-ban"></i></button>
          <button type="submit" class="btn btn-light"><i class="fa-regular fa-floppy-disk"></i></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedSpot: Object
  },
  data () {
    return {
      editedSpot: { ...this.selectedSpot }
    }
  },
  methods: {
    saveSpot () {
      this.$emit('save', this.editedSpot)
      this.closeModal()
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-spot-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  overflow-y: auto;
}

.spot-modal-content {
  max-width: 80%;
  color: beige;
  padding: 50px;
}

.edit-spot-modal h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  border-radius: 50%;
  cursor: pointer;
}
</style>