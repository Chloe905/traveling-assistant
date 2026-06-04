export type SpotPriority = 'must' | 'high' | 'medium' | 'low'

export interface User {
  id: number
  email: string
  name: string
}

export interface Collaborator {
  id?: number
  guestId?: string
  email?: string
  name: string
  role: 'editor'
  isGuest?: boolean
}

export interface CandidateSpot {
  id: string
  spotName: string
  category: string
  address: string
  durationMinutes: number
  openTime: string
  closeTime: string
  priority: SpotPriority
  notes: string
}

export interface Spot extends CandidateSpot {
  sourceCandidateId?: string
  time: string
  timeStart: string
  timeEnd: string
  transportMinutes: number
  transportNote: string
  aiReason: string
  description?: string
  isFavorite?: boolean
}

export interface TripDay {
  id: string
  spots: Spot[]
}

export interface Trip {
  id: string
  userId: number
  ownerId: number
  name: string
  dateStart: string
  dateEnd: string
  people: number
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
  banner?: string
  days: TripDay[]
  candidateSpots: CandidateSpot[]
  collaborators: Collaborator[]
  inviteToken?: string
  updatedAt: string
}

export interface TripForm {
  name: string
  dateStart: string
  dateEnd: string
  people: number
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
}

export interface AiPlanRequest {
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
}

export interface AiPlanResult {
  provider: 'mock' | 'gemini-ready'
  summary: string
  days: TripDay[]
  trip: Trip
}

export interface InviteLink {
  inviteToken: string
}

export interface InvitePreview {
  token: string
  tripId: string
  tripName: string
  destination: string
  dateStart: string
  dateEnd: string
  people: number
  ownerId: number
}

export interface AcceptInviteResult {
  tripId: string
  collaborators: Collaborator[]
  collaborator: Collaborator
}
