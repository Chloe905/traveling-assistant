<template>
  <form class="rounded-2xl border border-morandi-linen bg-white p-4" @submit.prevent="handleSubmit">
    <h3 class="text-lg font-bold text-morandi-ink">候選景點</h3>
    <div class="mt-4 grid gap-3">
      <label>
        <span class="form-label">景點名稱</span>
        <input v-model="form.spotName" class="form-field" type="text" required />
      </label>
      <label>
        <span class="form-label">地址 / 區域</span>
        <input v-model="form.address" class="form-field" type="text" placeholder="例如：中京區、台北信義區" />
      </label>
      <div class="grid gap-3 sm:grid-cols-2">
        <label>
          <span class="form-label">類型</span>
          <select v-model="form.category" class="form-field">
            <option value="sightseeing">景點</option>
            <option value="food">美食</option>
            <option value="shopping">購物</option>
            <option value="museum">展館</option>
            <option value="hotel">住宿</option>
          </select>
        </label>
        <label>
          <span class="form-label">優先級</span>
          <select v-model="form.priority" class="form-field">
            <option value="must">必去</option>
            <option value="high">很想去</option>
            <option value="medium">可安排</option>
            <option value="low">有空再去</option>
          </select>
        </label>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label>
          <span class="form-label">停留分鐘</span>
          <input v-model.number="form.durationMinutes" class="form-field" type="number" min="15" step="15" />
        </label>
        <label>
          <span class="form-label">營業開始</span>
          <input v-model="form.openTime" class="form-field" type="time" />
        </label>
        <label>
          <span class="form-label">營業結束</span>
          <input v-model="form.closeTime" class="form-field" type="time" />
        </label>
      </div>
      <label>
        <span class="form-label">備註</span>
        <textarea v-model="form.notes" class="form-field min-h-20" placeholder="想吃的店、門票、同行者偏好..." />
      </label>
    </div>
    <button class="primary-button mt-4 w-full" type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? '儲存中...' : editingSpot ? '更新候選景點' : '加入候選景點' }}
    </button>
    <button v-if="editingSpot" class="ghost-button mt-2 w-full" type="button" @click="resetForm">取消編輯</button>
    <p v-if="message" class="mt-3 rounded-lg px-3 py-2 text-sm" :class="hasError ? 'bg-morandi-rose/15 text-morandi-ink' : 'bg-morandi-sage/15 text-morandi-sageDark'">
      {{ message }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
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
    message.value = props.editingSpot ? '候選景點已更新。' : '候選景點已加入。'
    resetForm()
  } catch {
    hasError.value = true
    message.value = '儲存失敗，請稍後再試。'
  } finally {
    isSubmitting.value = false
  }
}
</script>
