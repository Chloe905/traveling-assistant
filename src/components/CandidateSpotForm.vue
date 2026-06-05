<template>
  <form class="rounded-2xl border border-morandi-linen bg-white p-4" @submit.prevent="handleSubmit">
    <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.candidateForm.title') }}</h3>
    <div class="mt-4 grid gap-3">
      <label>
        <span class="form-label">{{ t('tripDetail.candidateForm.name') }}</span>
        <input v-model="form.spotName" class="form-field" type="text" required />
      </label>
      <label>
        <span class="form-label">{{ t('tripDetail.candidateForm.address') }}</span>
        <input v-model="form.address" class="form-field" type="text" :placeholder="t('tripDetail.candidateForm.addressPlaceholder')" />
      </label>
      <div class="grid gap-3 sm:grid-cols-2">
        <label>
          <span class="form-label">{{ t('tripDetail.candidateForm.category') }}</span>
          <select v-model="form.category" class="form-field">
            <option value="sightseeing">{{ t('tripDetail.categories.sightseeing') }}</option>
            <option value="food">{{ t('tripDetail.categories.food') }}</option>
            <option value="shopping">{{ t('tripDetail.categories.shopping') }}</option>
            <option value="museum">{{ t('tripDetail.categories.museum') }}</option>
            <option value="hotel">{{ t('tripDetail.categories.hotel') }}</option>
          </select>
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.candidateForm.priority') }}</span>
          <select v-model="form.priority" class="form-field">
            <option value="must">{{ t('tripDetail.priorities.must') }}</option>
            <option value="high">{{ t('tripDetail.priorities.high') }}</option>
            <option value="medium">{{ t('tripDetail.priorities.medium') }}</option>
            <option value="low">{{ t('tripDetail.priorities.low') }}</option>
          </select>
        </label>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label>
          <span class="form-label">{{ t('tripDetail.candidateForm.duration') }}</span>
          <input v-model.number="form.durationMinutes" class="form-field" type="number" min="15" step="15" />
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.candidateForm.openTime') }}</span>
          <input v-model="form.openTime" class="form-field" type="time" />
        </label>
        <label>
          <span class="form-label">{{ t('tripDetail.candidateForm.closeTime') }}</span>
          <input v-model="form.closeTime" class="form-field" type="time" />
        </label>
      </div>
      <label>
        <span class="form-label">{{ t('tripDetail.candidateForm.notes') }}</span>
        <textarea v-model="form.notes" class="form-field min-h-20" :placeholder="t('tripDetail.candidateForm.notesPlaceholder')" />
      </label>
    </div>
    <button class="primary-button mt-4 w-full" type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? t('tripDetail.candidateForm.saving') : editingSpot ? t('tripDetail.candidateForm.update') : t('tripDetail.candidateForm.add') }}
    </button>
    <button v-if="editingSpot" class="ghost-button mt-2 w-full" type="button" @click="resetForm">{{ t('tripDetail.candidateForm.cancelEdit') }}</button>
    <p v-if="message" class="mt-3 rounded-lg px-3 py-2 text-sm" :class="hasError ? 'bg-morandi-rose/15 text-morandi-ink' : 'bg-morandi-sage/15 text-morandi-sageDark'">
      {{ message }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CandidateSpot, SpotPriority } from '@/types/models'

const props = defineProps<{
  editingSpot?: CandidateSpot | null
  onSave: (payload: Omit<CandidateSpot, 'id'> | CandidateSpot) => Promise<void>
}>()

const emit = defineEmits<{
  cancel: []
}>()

const createEmptyForm = () => ({
  spotName: '',
  category: 'sightseeing',
  address: '',
  durationMinutes: 90,
  openTime: '09:00',
  closeTime: '21:00',
  priority: 'medium' as SpotPriority,
  notes: ''
})

const form = reactive(createEmptyForm())
const isSubmitting = ref(false)
const message = ref('')
const hasError = ref(false)
const { t } = useI18n()

watch(
  () => props.editingSpot,
  spot => {
    Object.assign(form, spot || createEmptyForm())
    message.value = ''
    hasError.value = false
  },
  { immediate: true }
)

const resetForm = () => {
  Object.assign(form, createEmptyForm())
  emit('cancel')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  message.value = ''
  hasError.value = false

  try {
    const payload = props.editingSpot ? { ...props.editingSpot, ...form } : { ...form }
    await props.onSave(payload)
    message.value = props.editingSpot ? t('tripDetail.candidateForm.updated') : t('tripDetail.candidateForm.added')
    resetForm()
  } catch {
    hasError.value = true
    message.value = t('tripDetail.candidateForm.saveFailed')
  } finally {
    isSubmitting.value = false
  }
}
</script>
