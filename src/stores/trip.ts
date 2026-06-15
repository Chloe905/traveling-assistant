import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { tripApi } from '@/services/trip-api'
import type { AiPlanRequest, CandidateSpot, Spot, Trip, TripForm } from '@/types/models'
import { normalizeSpotTime, recalculateSequentialSpots } from '@/utils/planner'

export const useTripStore = defineStore('trip', () => {
  const trips = ref<Trip[]>([])
  const currentTrip = ref<Trip | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const selectedDayId = ref('1')
  const selectedDay = computed(() => currentTrip.value?.days.find(day => day.id === selectedDayId.value) ?? null)

  const setError = (message: string) => {
    errorMessage.value = message
  }

  const fetchTrips = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      trips.value = await tripApi.fetchTrips()
    } catch {
      setError('無法取得旅程清單，請確認後端服務是否啟動。')
    } finally {
      isLoading.value = false
    }
  }

  const fetchTrip = async (id: string) => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      currentTrip.value = await tripApi.fetchTrip(id)
      selectedDayId.value = currentTrip.value.days[0]?.id || '1'
    } catch {
      setError('無法取得旅程內容。')
    } finally {
      isLoading.value = false
    }
  }

  const createTrip = async (payload: TripForm) => {
    const trip = await tripApi.createTrip(payload)
    trips.value = [trip, ...trips.value]
    return trip
  }

  const updateTripById = async (id: string, payload: Partial<Trip>) => {
    const trip = await tripApi.updateTrip(id, payload)
    trips.value = trips.value.map(item => (item.id === id ? trip : item))

    if (currentTrip.value?.id === id) {
      currentTrip.value = trip
    }

    return trip
  }

  const updateTrip = async (payload: Partial<Trip>) => {
    if (!currentTrip.value) return
    await updateTripById(currentTrip.value.id, payload)
  }

  const deleteTrip = async (id: string) => {
    await tripApi.deleteTrip(id)
    trips.value = trips.value.filter(trip => trip.id !== id)
  }

  const addCandidate = async (payload: Omit<CandidateSpot, 'id'>) => {
    if (!currentTrip.value) return
    const candidate = await tripApi.addCandidate(currentTrip.value.id, payload)
    currentTrip.value = {
      ...currentTrip.value,
      candidateSpots: [...(currentTrip.value.candidateSpots || []), candidate]
    }
  }

  const updateCandidate = async (payload: CandidateSpot) => {
    if (!currentTrip.value) return
    const candidate = await tripApi.updateCandidate(currentTrip.value.id, payload.id, payload)
    currentTrip.value = {
      ...currentTrip.value,
      candidateSpots: currentTrip.value.candidateSpots.map(spot => (spot.id === candidate.id ? candidate : spot))
    }
  }

  const deleteCandidate = async (spotId: string) => {
    if (!currentTrip.value) return
    await tripApi.deleteCandidate(currentTrip.value.id, spotId)
    currentTrip.value = {
      ...currentTrip.value,
      candidateSpots: currentTrip.value.candidateSpots.filter(spot => spot.id !== spotId)
    }
  }

  const runAiPlan = async (payload: AiPlanRequest) => {
    if (!currentTrip.value) return null
    errorMessage.value = ''
    try {
      const plan = await tripApi.runAiPlan(currentTrip.value.id, payload)
      currentTrip.value = plan.trip
      selectedDayId.value = plan.days[0]?.id || '1'
      return plan
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : '未知錯誤'
      setError(`AI 排程失敗：${message}`)
      return null
    }
  }

  const updateSpot = async (dayId: string, spot: Spot) => {
    if (!currentTrip.value) return
    const days = currentTrip.value.days.map(day => ({
      ...day,
      spots: day.id === dayId
        ? recalculateSequentialSpots(day.spots.map(item => (item.id === spot.id ? normalizeSpotTime(spot) : item)), currentTrip.value?.dailyStartTime)
        : day.spots
    }))
    await updateTrip({ days })
  }

  const deleteSpot = async (dayId: string, spotId: string) => {
    if (!currentTrip.value) return
    const days = currentTrip.value.days.map(day => ({
      ...day,
      spots: day.id === dayId ? day.spots.filter(spot => spot.id !== spotId) : day.spots
    }))
    await updateTrip({ days })
  }

  const moveSpot = async (dayId: string, spotId: string, direction: -1 | 1) => {
    if (!currentTrip.value) return
    const days = currentTrip.value.days.map(day => {
      if (day.id !== dayId) return day
      const spots = [...day.spots]
      const index = spots.findIndex(spot => spot.id === spotId)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= spots.length) return day
      const [spot] = spots.splice(index, 1)
      spots.splice(nextIndex, 0, spot)
      return { ...day, spots: recalculateSequentialSpots(spots, currentTrip.value?.dailyStartTime) }
    })
    await updateTrip({ days })
  }

  const reorderSpot = async (dayId: string, sourceSpotId: string, targetSpotId: string) => {
    if (!currentTrip.value || sourceSpotId === targetSpotId) return
    const days = currentTrip.value.days.map(day => {
      if (day.id !== dayId) return day
      const spots = [...day.spots]
      const sourceIndex = spots.findIndex(spot => spot.id === sourceSpotId)
      if (sourceIndex < 0) return day
      const [spot] = spots.splice(sourceIndex, 1)
      const targetIndex = spots.findIndex(item => item.id === targetSpotId)
      if (targetIndex < 0) return day
      spots.splice(targetIndex, 0, spot)
      return { ...day, spots: recalculateSequentialSpots(spots, currentTrip.value?.dailyStartTime) }
    })
    await updateTrip({ days })
  }

  const addCollaborator = async (email: string) => {
    if (!currentTrip.value) return
    const collaborators = await tripApi.addCollaborator(currentTrip.value.id, email)
    currentTrip.value = { ...currentTrip.value, collaborators }
  }

  const createInviteLink = async () => {
    if (!currentTrip.value) return null
    const invite = await tripApi.createInviteLink(currentTrip.value.id)
    currentTrip.value = { ...currentTrip.value, inviteToken: invite.inviteToken }
    return invite
  }

  return {
    trips,
    currentTrip,
    isLoading,
    errorMessage,
    selectedDayId,
    selectedDay,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTripById,
    updateTrip,
    deleteTrip,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    runAiPlan,
    updateSpot,
    deleteSpot,
    moveSpot,
    reorderSpot,
    addCollaborator,
    createInviteLink
  }
})
