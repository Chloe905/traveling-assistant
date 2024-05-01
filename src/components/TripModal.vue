<template>
  <div v-if="visible" class="trip-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header mx-auto my-3">
          <h5 class="modal-title">{{ mode === 'edit' ? 'Edit Trip' : 'Add New Trip' }}</h5>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="name">Name<span class="required">*</span></label>
            <input type="text" class="form-control" id="name" v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label for="dateStart">Start Date<span class="required">*</span></label>
            <input type="date" class="form-control" id="dateStart" v-model="formData.dateStart" required>
          </div>
          <div class="form-group">
            <label for="dateEnd">End Date<span class="required">*</span></label>
            <input type="date" class="form-control" id="dateEnd" v-model="formData.dateEnd" required>
          </div>
          <div class="form-group">
            <label for="people">People<span class="required">*</span></label>
            <input type="number" min="1" class="form-control" id="people" v-model="formData.people" required>
          </div>
          <div class="form-group">
            <label for="image">Image</label>
            <img v-if="formData.banner" :src="formData.banner" class="d-block img-thumbnail mb-3 mx-auto" width="150"
              height="100">
            <input id="image" type="file" name="image" accept="image/*" class="form-control form-control-file"
              @change="handleFileChange">
          </div>
        </div>
        <div class="modal-footer mt-4 justify-content-between">
          <button type="button" class="btn btn-secondary me-2" @click="closeModal"><i
              class="fa-solid fa-ban"></i></button>
          <button type="button" class="btn btn-light me-2" @click="saveTrip"><i
              class="fa-regular fa-floppy-disk"></i></button>
          <button v-if="mode === 'edit'" class="btn btn-danger remove-btn" @click="confirmDelete"><i
              class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    mode: String,
    tripData: Object,
  },
  data () {
    return {
      originalFormData: {},
      formData: {...this.tripData} || {},
    }
  }, 
  watch: {
    tripData: {
      handler (newTripData) {
        this.formData = { ...newTripData }
      },
      immediate: true
    },
    mode: {
      handler (newMode) {
        if (newMode === 'add') {
          this.backupFormData()
          this.resetFormData()
        }
      },
      immediate: true
    },
  },
  methods: {
    handleFileChange(e) {
      const { files } = e.target

      if (files.length === 0) {
        this.formData.banner = ''
      } else {
        const imageURL = window.URL.createObjectURL(files[0])
        this.formData.banner = imageURL
      }
    },
    closeModal () {
      this.$emit('close')
      if (this.mode === 'add') {
        this.restoreFormData()
      }
    },
    saveTrip () {
      if (!this.formData.name || !this.formData.dateStart || !this.formData.dateEnd || !this.formData.people) {
        alert('Please fill in all required fields！')
        return
      }

      if (this.formData.people < 1) {
        this.formData.people = 1
      }

      if (this.formData.dateStart > this.formData.dateEnd) {
        const tempDate = this.formData.dateStart
        this.formData.dateStart = this.formData.dateEnd
        this.formData.dateEnd = tempDate
      }

      console.log('formData:', this.formData)
      this.$emit('save', this.formData)
      this.closeModal()
    },
    resetFormData () {
      this.formData = {}
    }, 
    backupFormData () {
      this.originalFormData = { ...this.formData }
    },
    restoreFormData () {
      if (this.originalFormData) {
        this.formData = { ...this.originalFormData }
        this.originalFormData = {}
      }
    },
    confirmDelete () {
      if (confirm('Are you sure you want to delete this trip?')) {
        this.deleteTrip()
      }
    },
    deleteTrip () {
      this.$emit('delete', this.tripData.id)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
  .trip-modal {
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
  }

  .trip-modal .modal-dialog {
    z-index: 1001;
  }

  .trip-modal .modal-content {
    color: beige;
  }

  .trip-modal button {
    border-radius: 50%;
  }

  .required {
    color: red;
    margin-left: 5px;
  }
</style>
