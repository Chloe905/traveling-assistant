<template>
  <section class="rounded-2xl border border-morandi-linen bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-bold text-morandi-ink">{{ t('tripDetail.collaborators.title') }}</h3>
        <p class="mt-1 text-sm text-morandi-sageDark">{{ t('tripDetail.collaborators.description') }}</p>
      </div>
      <button class="secondary-button shrink-0" type="button" :disabled="isGeneratingLink" @click="handleCreateInviteLink">
        {{ isGeneratingLink ? t('tripDetail.collaborators.generating') : t('tripDetail.collaborators.inviteLink') }}
      </button>
    </div>

    <form class="mt-4 flex gap-2" @submit.prevent="handleEmailInvite">
      <input v-model="email" class="form-field" type="email" placeholder="friend@example.com" required />
      <button class="primary-button shrink-0" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? t('tripDetail.collaborators.sending') : t('tripDetail.collaborators.invite') }}
      </button>
    </form>

    <div v-if="inviteUrl" class="mt-4 rounded-xl bg-morandi-mist p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-morandi-sageDark">Invite URL</p>
      <div class="mt-2 flex gap-2">
        <input class="form-field" type="text" :value="inviteUrl" readonly />
        <button class="secondary-button shrink-0" type="button" @click="copyInviteUrl">{{ t('tripDetail.collaborators.copy') }}</button>
      </div>
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <canvas ref="qrCanvas" class="h-32 w-32 rounded-lg bg-white p-2"></canvas>
        <p class="text-sm leading-6 text-morandi-sageDark">
          {{ t('tripDetail.collaborators.qrHelp') }}
        </p>
      </div>
    </div>

    <p v-if="message" class="mt-3 rounded-lg px-3 py-2 text-sm" :class="hasError ? 'bg-morandi-rose/15 text-morandi-ink' : 'bg-morandi-sage/15 text-morandi-sageDark'">
      {{ message }}
    </p>

    <div class="mt-4 space-y-2">
      <div v-for="member in collaborators" :key="member.email || member.guestId" class="flex items-center justify-between rounded-lg bg-morandi-mist px-3 py-2 text-sm">
        <span>{{ member.name || member.email }}</span>
        <span class="text-morandi-sageDark">{{ member.isGuest ? 'guest' : member.role }}</span>
      </div>
      <p v-if="!collaborators.length" class="text-sm text-morandi-sageDark">{{ t('tripDetail.collaborators.empty') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import type { Collaborator } from '@/types/models'

const props = defineProps<{
  collaborators: Collaborator[]
  inviteUrl?: string
  onInvite: (email: string) => Promise<void>
  onCreateInviteLink: () => Promise<string>
}>()

const email = ref('')
const message = ref('')
const hasError = ref(false)
const isSubmitting = ref(false)
const isGeneratingLink = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const { t } = useI18n()

const drawQrCode = async () => {
  if (!props.inviteUrl || !qrCanvas.value) return
  await QRCode.toCanvas(qrCanvas.value, props.inviteUrl, {
    margin: 1,
    width: 128,
    color: {
      dark: '#3f4742',
      light: '#ffffff'
    }
  })
}

watch(
  () => props.inviteUrl,
  async () => {
    await nextTick()
    await drawQrCode()
  },
  { immediate: true }
)

const handleEmailInvite = async () => {
  isSubmitting.value = true
  hasError.value = false
  message.value = ''

  try {
    await props.onInvite(email.value)
    message.value = t('tripDetail.collaborators.inviteSuccess')
    email.value = ''
  } catch {
    hasError.value = true
    message.value = t('tripDetail.collaborators.inviteFailed')
  } finally {
    isSubmitting.value = false
  }
}

const handleCreateInviteLink = async () => {
  isGeneratingLink.value = true
  hasError.value = false
  message.value = ''

  try {
    await props.onCreateInviteLink()
    await nextTick()
    await drawQrCode()
    message.value = t('tripDetail.collaborators.linkSuccess')
  } catch {
    hasError.value = true
    message.value = t('tripDetail.collaborators.linkFailed')
  } finally {
    isGeneratingLink.value = false
  }
}

const copyInviteUrl = async () => {
  if (!props.inviteUrl) return
  await navigator.clipboard.writeText(props.inviteUrl)
  message.value = t('tripDetail.collaborators.copied')
  hasError.value = false
}
</script>
