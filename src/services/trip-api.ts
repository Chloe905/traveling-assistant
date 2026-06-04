import { apiClient } from './http'
import type {
  AcceptInviteResult,
  AiPlanRequest,
  AiPlanResult,
  CandidateSpot,
  Collaborator,
  InviteLink,
  InvitePreview,
  Trip,
  TripForm
} from '@/types/models'

export const tripApi = {
  async fetchTrips() {
    const { data } = await apiClient.get<Trip[]>('/trips')
    return data
  },

  async fetchTrip(id: string) {
    const { data } = await apiClient.get<Trip>(`/trips/${id}`)
    return data
  },

  async createTrip(payload: TripForm) {
    const { data } = await apiClient.post<Trip>('/trips', payload)
    return data
  },

  async updateTrip(id: string, payload: Partial<Trip>) {
    const { data } = await apiClient.put<Trip>(`/trips/${id}`, payload)
    return data
  },

  async deleteTrip(id: string) {
    await apiClient.delete(`/trips/${id}`)
  },

  async addCandidate(tripId: string, payload: Omit<CandidateSpot, 'id'>) {
    const { data } = await apiClient.post<CandidateSpot>(`/trips/${tripId}/candidates`, payload)
    return data
  },

  async updateCandidate(tripId: string, spotId: string, payload: CandidateSpot) {
    const { data } = await apiClient.put<CandidateSpot>(`/trips/${tripId}/candidates/${spotId}`, payload)
    return data
  },

  async deleteCandidate(tripId: string, spotId: string) {
    await apiClient.delete(`/trips/${tripId}/candidates/${spotId}`)
  },

  async runAiPlan(tripId: string, payload: AiPlanRequest) {
    const { data } = await apiClient.post<AiPlanResult>(`/trips/${tripId}/ai-plan`, payload)
    return data
  },

  async addCollaborator(tripId: string, email: string) {
    const { data } = await apiClient.post<Collaborator[]>(`/trips/${tripId}/collaborators`, { email })
    return data
  },

  async createInviteLink(tripId: string) {
    const { data } = await apiClient.post<InviteLink>(`/trips/${tripId}/invite-link`)
    return data
  },

  async fetchInvite(token: string) {
    const { data } = await apiClient.get<InvitePreview>(`/invites/${token}`)
    return data
  },

  async acceptInvite(token: string, payload: { guestName?: string; guestId?: string } = {}) {
    const { data } = await apiClient.post<AcceptInviteResult>(`/invites/${token}/accept`, payload)
    return data
  }
}
